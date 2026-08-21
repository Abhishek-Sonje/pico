import { describe, expect, it, vi } from "vitest";

import { BrightDataClient } from "./client";

describe("BrightDataClient", () => {
  it("triggers a collector and polls until records are ready", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json({ collection_id: "j_snapshot" }))
      .mockResolvedValueOnce(Response.json({ status: "building" }))
      .mockResolvedValueOnce(Response.json([{ companyName: "Acme" }]));

    const client = new BrightDataClient(fetchMock, 0, 500, "test-key");
    const result = await client.run({
      source: "product-hunt",
      collectorId: "c_test",
      sourceUrl: "https://www.producthunt.com/",
    });

    expect(result.snapshotId).toBe("j_snapshot");
    expect(result.records).toEqual([{ companyName: "Acme" }]);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
