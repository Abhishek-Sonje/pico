import "server-only";

import { getDatabase } from "@/db";
import { sourceRuns } from "@/db/schema";
import { BrightDataClient } from "@/lib/bright-data/client";
import { getCollectorConfig } from "@/lib/bright-data/collectors";
import { normalizeProductHuntPost } from "@/lib/normalizers/product-hunt";
import { normalizeYcCompany } from "@/lib/normalizers/yc-companies";
import { normalizeYcJob } from "@/lib/normalizers/yc-jobs";
import type { DataSource, HealthStatus } from "@/lib/types";
import type { NormalizedStartup } from "@/lib/validators/startup.schema";
import { persistStartup } from "./persist-scrape";

function normalizeRecord(
  source: DataSource,
  record: unknown,
): NormalizedStartup {
  if (source === "product-hunt") return normalizeProductHuntPost(record);
  if (source === "yc-companies") return normalizeYcCompany(record);
  return normalizeYcJob(record);
}

export async function runScrape(source: DataSource) {
  const startedAt = new Date();
  const config = getCollectorConfig(source);
  const db = getDatabase();

  try {
    const collection = await new BrightDataClient().run(config);
    let valid = 0;
    const invalidMessages: string[] = [];

    for (const record of collection.records) {
      try {
        const normalized = normalizeRecord(source, record);
        await persistStartup(normalized);
        valid += 1;
      } catch (error) {
        invalidMessages.push(
          error instanceof Error
            ? error.message.slice(0, 180)
            : "Invalid record",
        );
      }
    }

    const invalid = collection.records.length - valid;
    const status: HealthStatus =
      valid === 0 ? "failed" : invalid > 0 ? "warning" : "healthy";
    const [run] = await db
      .insert(sourceRuns)
      .values({
        source,
        collectorId: config.collectorId,
        status,
        recordsFound: collection.records.length,
        recordsValid: valid,
        recordsInvalid: invalid,
        errorMessage: invalidMessages.slice(0, 3).join(" | ") || null,
        startedAt,
        finishedAt: new Date(),
      })
      .returning();

    return { run, snapshotId: collection.snapshotId };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown scraper failure";
    await db.insert(sourceRuns).values({
      source,
      collectorId: config.collectorId,
      status: "failed",
      recordsFound: 0,
      recordsValid: 0,
      recordsInvalid: 0,
      errorMessage: message.slice(0, 500),
      startedAt,
      finishedAt: new Date(),
    });
    throw error;
  }
}
