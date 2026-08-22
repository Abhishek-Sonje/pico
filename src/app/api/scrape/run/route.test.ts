import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("scraper run route", () => {
  it("fails closed when operator access is not configured", async () => {
    const response = await POST(
      new Request("http://localhost:3000/api/scrape/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ source: "product-hunt" }),
      }),
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: "OPERATOR_ACCESS_NOT_CONFIGURED" },
    });
  });
});
