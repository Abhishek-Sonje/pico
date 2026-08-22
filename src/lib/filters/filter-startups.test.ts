import { describe, expect, it } from "vitest";

import { demoStartups } from "@/data/demo-startups";
import { filterStartups } from "./filter-startups";

describe("filterStartups", () => {
  it("searches technology and role text", () => {
    expect(filterStartups(demoStartups, { q: "rust" })).toHaveLength(1);
    expect(
      filterStartups(demoStartups, { q: "infrastructure engineer" }),
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

  it("filters every visible dashboard control", () => {
    expect(filterStartups(demoStartups, { q: "  " })).toHaveLength(3);
    expect(filterStartups(demoStartups, { q: "climate" })[0]?.name).toBe(
      "Morrow Systems",
    );
    expect(
      filterStartups(demoStartups, { q: "", role: "full-stack" })[0]?.name,
    ).toBe("Tandem Health");
    expect(filterStartups(demoStartups, { q: "", remote: true })).toHaveLength(
      1,
    );
    expect(
      filterStartups(demoStartups, { q: "", hasApplyLink: true }),
    ).toHaveLength(2);
    expect(
      filterStartups(demoStartups, { q: "", hasFounderInfo: true }),
    ).toHaveLength(2);
  });
});
