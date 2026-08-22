import "server-only";

import type { CollectorConfig, CollectionResult } from "./types";
import { BrightDataError } from "./types";
import { requireBrightDataApiKey } from "./collectors";

type Fetch = typeof fetch;

function parseDatasetPayload(body: string): unknown {
  try {
    return JSON.parse(body) as unknown;
  } catch {
    try {
      const records = body
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => JSON.parse(line) as unknown);
      if (records.length) return records;
    } catch {
      // A structured error below keeps upstream response details private.
    }
    throw new BrightDataError(
      "Bright Data returned an unsupported dataset format.",
      "INVALID_RESPONSE",
    );
  }
}

export class BrightDataClient {
  constructor(
    private readonly fetchImpl: Fetch = fetch,
    private readonly pollIntervalMs = 5_000,
    private readonly timeoutMs = 240_000,
    private readonly apiKey = requireBrightDataApiKey(),
  ) {}

  async run(config: CollectorConfig): Promise<CollectionResult> {
    const snapshotId = await this.trigger(config);
    const records = await this.poll(snapshotId);
    return { snapshotId, records };
  }

  private async trigger(config: CollectorConfig) {
    const url = new URL("https://api.brightdata.com/dca/trigger");
    url.searchParams.set("collector", config.collectorId);
    url.searchParams.set("queue_next", "1");

    const response = await this.request(url, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify([{ url: config.sourceUrl }]),
    });
    const payload: unknown = await response.json();

    if (
      typeof payload !== "object" ||
      payload === null ||
      !("collection_id" in payload) ||
      typeof payload.collection_id !== "string"
    ) {
      throw new BrightDataError(
        "Bright Data returned an invalid trigger response.",
        "INVALID_RESPONSE",
      );
    }

    return payload.collection_id;
  }

  private async poll(snapshotId: string) {
    const startedAt = Date.now();
    const url = new URL("https://api.brightdata.com/dca/dataset");
    url.searchParams.set("id", snapshotId);

    while (Date.now() - startedAt < this.timeoutMs) {
      const response = await this.request(url, { headers: this.headers() });
      const payload = parseDatasetPayload(await response.text());

      if (Array.isArray(payload)) return payload;
      if (
        typeof payload === "object" &&
        payload !== null &&
        "status" in payload &&
        payload.status === "failed"
      ) {
        throw new BrightDataError(
          "The Bright Data collection failed.",
          "UPSTREAM_ERROR",
        );
      }

      await new Promise((resolve) => setTimeout(resolve, this.pollIntervalMs));
    }

    throw new BrightDataError(
      "Timed out waiting for Bright Data collection results.",
      "TIMEOUT",
    );
  }

  private headers() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  private async request(
    url: URL,
    init: RequestInit,
    attempt = 0,
  ): Promise<Response> {
    let response: Response;
    try {
      response = await this.fetchImpl(url, init);
    } catch {
      throw new BrightDataError(
        "Could not reach Bright Data.",
        "UPSTREAM_ERROR",
      );
    }

    if (response.ok) return response;
    if (response.status >= 500 && attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 1_000));
      return this.request(url, init, attempt + 1);
    }
    if (response.status === 401) {
      throw new BrightDataError(
        "Bright Data rejected the API key.",
        "UNAUTHORIZED",
        401,
      );
    }
    if (response.status === 404) {
      throw new BrightDataError(
        "Bright Data collector was not found.",
        "COLLECTOR_NOT_FOUND",
        404,
      );
    }
    if (response.status === 422) {
      throw new BrightDataError(
        "Collector input does not match its published schema.",
        "INVALID_INPUT",
        422,
      );
    }
    throw new BrightDataError(
      `Bright Data request failed with status ${response.status}.`,
      "UPSTREAM_ERROR",
      response.status,
    );
  }
}
