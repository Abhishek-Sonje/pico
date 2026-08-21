import type { DataSource } from "@/lib/types";

export type CollectorConfig = {
  source: DataSource;
  collectorId: string;
  sourceUrl: string;
};

export type CollectionResult = {
  snapshotId: string;
  records: unknown[];
};

export class BrightDataError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "NOT_CONFIGURED"
      | "UNAUTHORIZED"
      | "COLLECTOR_NOT_FOUND"
      | "INVALID_INPUT"
      | "TIMEOUT"
      | "UPSTREAM_ERROR"
      | "INVALID_RESPONSE",
    public readonly status?: number,
  ) {
    super(message);
    this.name = "BrightDataError";
  }
}
