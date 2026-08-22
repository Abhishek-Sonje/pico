import { describe, expect, it } from "vitest";
import { demoStartups } from "@/data/demo-startups";
import { calculateTechnologyMatch } from "./technology-match";

describe("calculateTechnologyMatch", () => {
  it("returns no personal score before preferences are selected", () => {
    expect(calculateTechnologyMatch(demoStartups[0], [])).toBeNull();
  });

  it("scores selected technologies case-insensitively", () => {
    expect(
      calculateTechnologyMatch(demoStartups[0], [
        "typescript",
        "Postgres",
        "Python",
      ]),
    ).toEqual({
      score: 67,
      matchedTechnologies: ["typescript", "Postgres"],
    });
  });
});
