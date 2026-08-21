import { describe, expect, it } from "vitest";
import { normalizeHackerNewsPost } from "./hn-who-is-hiring";
import { normalizeYcCompany } from "./yc-companies";
import { normalizeYcJob } from "./yc-jobs";

describe("source normalizers", () => {
  it("keeps a partial Hacker News record", () => {
    const result = normalizeHackerNewsPost({
      companyName: " Acme ",
      sourceUrl: "https://news.ycombinator.com/item?id=1",
      roles: [],
      people: [],
      links: [],
      technologies: ["Go", "Go"],
    });
    expect(result.name).toBe("Acme");
    expect(result.technologies).toEqual(["Go"]);
  });
  it("normalizes a YC company", () => {
    const result = normalizeYcCompany({
      name: "Careful",
      sourceUrl: "https://www.ycombinator.com/companies/careful",
      founders: [{ name: "Mina" }],
    });
    expect(result.people[0].sourceUrl).toContain("careful");
  });
  it("turns a YC job into a startup role", () => {
    const result = normalizeYcJob({
      companyName: "North",
      sourceUrl: "https://www.ycombinator.com/jobs/1",
      role: { title: "Engineer", remote: true },
    });
    expect(result.roles[0].title).toBe("Engineer");
    expect(result.links.some((link) => link.type === "apply")).toBe(true);
  });
});
