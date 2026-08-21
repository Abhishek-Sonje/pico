import { z } from "zod";
import {
  rawLinkSchema,
  rawPersonSchema,
  rawRoleSchema,
} from "@/lib/validators/scraper.schema";
import { normalizedStartupSchema } from "@/lib/validators/startup.schema";
import { buildLinks, cleanText, uniqueStrings } from "./shared";

export const ycCompanyRecordSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullish(),
  sourceUrl: z.string().url(),
  websiteUrl: z.string().url().nullish(),
  location: z.string().nullish(),
  batch: z.string().nullish(),
  industry: z.string().nullish(),
  founders: z.array(rawPersonSchema).default([]),
  roles: z.array(rawRoleSchema).default([]),
  links: z.array(rawLinkSchema).default([]),
  technologies: z.array(z.string()).default([]),
});

export function normalizeYcCompany(input: unknown) {
  const raw = ycCompanyRecordSchema.parse(input);
  return normalizedStartupSchema.parse({
    name: raw.name.trim(),
    description: cleanText(raw.description),
    industry: cleanText(raw.industry),
    location: cleanText(raw.location),
    batch: cleanText(raw.batch),
    source: "yc-companies",
    sourceUrl: raw.sourceUrl,
    websiteUrl: raw.websiteUrl ?? null,
    sourcePublishedAt: null,
    roles: raw.roles.map((role) => ({
      ...role,
      sourceUrl: role.sourceUrl ?? raw.sourceUrl,
    })),
    people: raw.founders.map((person) => ({
      ...person,
      sourceUrl: person.sourceUrl ?? raw.sourceUrl,
    })),
    links: buildLinks(raw.sourceUrl, raw.websiteUrl, raw.links),
    technologies: uniqueStrings(raw.technologies),
  });
}
