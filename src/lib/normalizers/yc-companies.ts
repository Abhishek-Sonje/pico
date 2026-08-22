import { z } from "zod";
import {
  rawLinkSchema,
  rawPersonSchema,
  rawRoleSchema,
} from "@/lib/validators/scraper.schema";
import { normalizedStartupSchema } from "@/lib/validators/startup.schema";
import { buildLinks, cleanText, uniqueStrings } from "./shared";

export const ycCompanyRecordSchema = z.object({
  name: z.string().min(1).optional(),
  company_name: z.string().min(1).optional(),
  description: z.string().nullish(),
  sourceUrl: z.string().url().optional(),
  company_url: z.string().url().optional(),
  websiteUrl: z.string().url().nullish(),
  location: z.string().nullish(),
  batch: z.string().nullish(),
  yc_batch: z.string().nullish(),
  industry: z.union([z.string(), z.array(z.string())]).nullish(),
  input: z
    .object({ url: z.string().url().optional() })
    .passthrough()
    .optional(),
  founders: z.array(rawPersonSchema).default([]),
  roles: z.array(rawRoleSchema).default([]),
  links: z.array(rawLinkSchema).default([]),
  technologies: z.array(z.string()).default([]),
});

export function normalizeYcCompany(input: unknown) {
  const raw = ycCompanyRecordSchema.parse(input);
  const name = raw.name ?? raw.company_name;
  const sourceUrl = raw.sourceUrl ?? raw.company_url ?? raw.input?.url;
  const industry = Array.isArray(raw.industry)
    ? raw.industry.join(", ")
    : raw.industry;
  return normalizedStartupSchema.parse({
    name: name?.trim(),
    description: cleanText(raw.description),
    industry: cleanText(industry),
    location: cleanText(raw.location),
    batch: cleanText(raw.batch ?? raw.yc_batch),
    source: "yc-companies",
    sourceUrl,
    websiteUrl: raw.websiteUrl ?? null,
    sourcePublishedAt: null,
    roles: raw.roles.map((role) => ({
      ...role,
      sourceUrl: role.sourceUrl ?? raw.sourceUrl,
    })),
    people: raw.founders.map((person) => ({
      ...person,
      sourceUrl: person.sourceUrl ?? sourceUrl,
    })),
    links: sourceUrl ? buildLinks(sourceUrl, raw.websiteUrl, raw.links) : [],
    technologies: uniqueStrings(raw.technologies),
  });
}
