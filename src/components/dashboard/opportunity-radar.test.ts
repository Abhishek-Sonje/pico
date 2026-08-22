import { describe, expect, it } from "vitest";
import { demoStartups } from "@/data/demo-startups";
import { profileCompleteness } from "./opportunity-radar";

describe("profileCompleteness", () => {
  it("maps the six visible evidence fields to a bounded percentage", () => {
    expect(profileCompleteness(demoStartups[0])).toBe(100);
    expect(profileCompleteness(demoStartups[2])).toBe(50);
    expect(
      profileCompleteness({
        ...demoStartups[0],
        missingFields: Array.from({ length: 20 }, (_, index) => String(index)),
      }),
    ).toBe(0);
  });
});
