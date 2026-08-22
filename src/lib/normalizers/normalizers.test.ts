import { describe, expect, it } from "vitest";
import { normalizeProductHuntPost } from "./product-hunt";
import { normalizeYcCompany } from "./yc-companies";
import { normalizeYcJob } from "./yc-jobs";

describe("source normalizers", () => {
  it("keeps a partial Product Hunt record", () => {
    const result = normalizeProductHuntPost({
      name: " Acme ",
      sourceUrl: "https://www.producthunt.com/products/acme",
      makers: [],
      links: [],
      topics: ["Developer Tools", "Developer Tools"],
    });
    expect(result.name).toBe("Acme");
    expect(result.source).toBe("product-hunt");
    expect(result.technologies).toEqual(["Developer Tools"]);
    expect(result.description).toBeNull();
    expect(result.location).toBeNull();
    expect(result.roles).toEqual([]);
  });
  it("normalizes a YC company", () => {
    const result = normalizeYcCompany({
      name: "Careful",
      sourceUrl: "https://www.ycombinator.com/companies/careful",
      founders: [{ name: "Mina" }],
    });
    expect(result.people[0].sourceUrl).toContain("careful");
  });
  it("normalizes the published YC collector output", () => {
    const result = normalizeYcCompany({
      company_name: "Careful",
      description: "Clinical infrastructure",
      company_url: "https://www.ycombinator.com/companies/careful",
      yc_batch: "W24",
      industry: ["Healthcare", "B2B"],
      location: "San Francisco",
      input: { url: "https://www.ycombinator.com/companies" },
    });
    expect(result.name).toBe("Careful");
    expect(result.batch).toBe("W24");
    expect(result.industry).toBe("Healthcare, B2B");
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
