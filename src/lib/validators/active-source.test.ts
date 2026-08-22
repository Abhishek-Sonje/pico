import { describe, expect, it } from "vitest";
import { filtersSchema } from "./filters.schema";
import { scraperRunRequestSchema } from "./scraper.schema";

describe("submission source boundary", () => {
  it("accepts YC Companies and rejects inactive source triggers", () => {
    expect(
      scraperRunRequestSchema.safeParse({ source: "yc-companies" }).success,
    ).toBe(true);
    expect(
      scraperRunRequestSchema.safeParse({ source: "product-hunt" }).success,
    ).toBe(false);
    expect(
      scraperRunRequestSchema.safeParse({ source: "yc-jobs" }).success,
    ).toBe(false);
  });

  it("rejects inactive source filters at the public API boundary", () => {
    expect(filtersSchema.safeParse({ source: "yc-companies" }).success).toBe(
      true,
    );
    expect(filtersSchema.safeParse({ source: "product-hunt" }).success).toBe(
      false,
    );
  });
});
