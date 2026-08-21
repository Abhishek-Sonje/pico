import { describe, expect, it } from "vitest";
import { calculateSignalScore } from "./signal-score";
import type { NormalizedStartup } from "@/lib/validators/startup.schema";

const rich: NormalizedStartup = {
  name: "Pico",
  source: "product-hunt",
  sourceUrl: "https://example.com/source",
  description: null,
  industry: null,
  location: "Remote",
  batch: null,
  websiteUrl: "https://example.com",
  sourcePublishedAt: new Date("2026-08-01"),
  technologies: ["TypeScript"],
  people: [
    { name: "Ada", role: "Founder", sourceUrl: "https://example.com/ada" },
  ],
  links: [{ type: "careers", url: "https://example.com/jobs", label: null }],
  roles: [
    {
      title: "Engineer",
      location: "Remote",
      remote: true,
      salary: "$150k",
      applyUrl: "https://example.com/apply",
      sourceUrl: "https://example.com/job",
    },
  ],
};
describe("calculateSignalScore", () => {
  it("returns a deterministic maximum with reasons", () => {
    const result = calculateSignalScore(rich, new Date("2026-08-22"));
    expect(result.score).toBe(100);
    expect(result.reasons).toHaveLength(8);
  });
  it("does not award freshness without a reliable date", () => {
    expect(
      calculateSignalScore(
        { ...rich, sourcePublishedAt: null },
        new Date("2026-08-22"),
      ).score,
    ).toBe(90);
  });
});
