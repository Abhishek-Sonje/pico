import "server-only";

import type { DataSource } from "@/lib/types";
import { env } from "@/lib/validators/env.schema";
import type { CollectorConfig } from "./types";
import { BrightDataError } from "./types";

const sourceUrls: Record<DataSource, string> = {
  hn: "https://news.ycombinator.com/submitted?id=whoishiring",
  "yc-companies": "https://www.ycombinator.com/companies",
  "yc-jobs": "https://www.ycombinator.com/jobs",
};

function getCollectorId(source: DataSource) {
  if (source === "hn") return env.BRIGHTDATA_HN_COLLECTOR_ID;
  if (source === "yc-companies") {
    return env.BRIGHTDATA_YC_COMPANIES_COLLECTOR_ID;
  }
  return env.BRIGHTDATA_YC_JOBS_COLLECTOR_ID;
}

export function getCollectorConfig(source: DataSource): CollectorConfig {
  const collectorId = getCollectorId(source);
  if (!collectorId) {
    throw new BrightDataError(
      `The ${source} Bright Data collector is not configured.`,
      "NOT_CONFIGURED",
    );
  }

  return { source, collectorId, sourceUrl: sourceUrls[source] };
}

export function requireBrightDataApiKey() {
  if (!env.BRIGHTDATA_API_KEY) {
    throw new BrightDataError(
      "BRIGHTDATA_API_KEY is not configured.",
      "NOT_CONFIGURED",
    );
  }
  return env.BRIGHTDATA_API_KEY;
}
