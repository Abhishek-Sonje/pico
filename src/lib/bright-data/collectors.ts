import "server-only";

import type { DataSource } from "@/lib/types";
import { env } from "@/lib/validators/env.schema";
import type { CollectorConfig } from "./types";
import { BrightDataError } from "./types";

export function getCollectorConfig(source: DataSource): CollectorConfig {
  if (source !== "yc-companies") {
    throw new BrightDataError(
      "Pico's submission build supports YC Companies only.",
      "NOT_CONFIGURED",
    );
  }
  const collectorId = env.BRIGHTDATA_YC_COMPANIES_COLLECTOR_ID;
  if (!collectorId) {
    throw new BrightDataError(
      `The ${source} Bright Data collector is not configured.`,
      "NOT_CONFIGURED",
    );
  }

  return {
    source,
    collectorId,
    sourceUrl: "https://www.ycombinator.com/companies",
  };
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
