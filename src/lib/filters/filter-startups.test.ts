import { describe, expect, it } from "vitest";

import { demoStartups } from "@/data/demo-startups";
import { filterStartups } from "./filter-startups";

describe("filterStartups", () => {
  it("searches technology and role text", () => {
    expect(filterStartups(demoStartups, { q: "rust" })).toHaveLength(1);
    expect(
      filterStartups(demoStartups, { q: "backend engineer" }),
    ).toHaveLength(1);
  });

  it("combines boolean filters", () => {
    const results = filterStartups(demoStartups, {
      q: "",
      remote: true,
      hasApplyLink: true,
      hasFounderInfo: true,
    });
    expect(results.map((startup) => startup.name)).toEqual(["Orbital"]);
  });
});
