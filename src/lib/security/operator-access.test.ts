import { describe, expect, it } from "vitest";
import {
  acquireSourceRun,
  matchesSecret,
  releaseSourceRun,
} from "./operator-access";

describe("operator access", () => {
  it("compares operator secrets without exposing the source value", async () => {
    await expect(matchesSecret("correct", "correct")).resolves.toBe(true);
    await expect(matchesSecret("incorrect", "correct")).resolves.toBe(false);
  });

  it("allows only one in-process run per source", () => {
    expect(acquireSourceRun("product-hunt")).toBe(true);
    expect(acquireSourceRun("product-hunt")).toBe(false);
    releaseSourceRun("product-hunt");
    expect(acquireSourceRun("product-hunt")).toBe(true);
    releaseSourceRun("product-hunt");
  });
});
