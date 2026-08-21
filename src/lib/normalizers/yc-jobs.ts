import { z } from "zod";
import {
  rawLinkSchema,
  rawPersonSchema,
  rawRoleSchema,
} from "@/lib/validators/scraper.schema";
import { normalizedStartupSchema } from "@/lib/validators/startup.schema";
import { buildLinks, cleanText, uniqueStrings } from "./shared";

export const ycJobRecordSchema = z.object({
  companyName: z.string().min(1),
  description: z.string().nullish(),
  companySourceUrl: z.string().url().nullish(),
  sourceUrl: z.string().url(),
  websiteUrl: z.string().url().nullish(),
  location: z.string().nullish(),
  industry: z.string().nullish(),
  postedAt: z.coerce.date().nullish(),
  role: rawRoleSchema,
  founders: z.array(rawPersonSchema).default([]),
  links: z.array(rawLinkSchema).default([]),
  technologies: z.array(z.string()).default([]),
});

export function normalizeYcJob(input: unknown) {
  const raw = ycJobRecordSchema.parse(input);
  return normalizedStartupSchema.parse({
    name: raw.companyName.trim(),
    description: cleanText(raw.description),
    industry: cleanText(raw.industry),
    location: cleanText(raw.location ?? raw.role.location),
    batch: null,
    source: "yc-jobs",
    sourceUrl: raw.companySourceUrl ?? raw.sourceUrl,
    websiteUrl: raw.websiteUrl ?? null,
    sourcePublishedAt: raw.postedAt ?? null,
    roles: [{ ...raw.role, sourceUrl: raw.role.sourceUrl ?? raw.sourceUrl }],
    people: raw.founders.map((person) => ({
      ...person,
      sourceUrl: person.sourceUrl ?? raw.companySourceUrl ?? raw.sourceUrl,
    })),
    links: buildLinks(raw.companySourceUrl ?? raw.sourceUrl, raw.websiteUrl, [
      {
        type: "apply",
        url: raw.role.applyUrl ?? raw.sourceUrl,
        label: "Apply",
      },
      ...raw.links,
    ]),
    technologies: uniqueStrings(raw.technologies),
  });
}
