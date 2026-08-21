import { z } from "zod";
import {
  rawLinkSchema,
  rawPersonSchema,
  rawRoleSchema,
} from "@/lib/validators/scraper.schema";
import { normalizedStartupSchema } from "@/lib/validators/startup.schema";
import { buildLinks, cleanText, uniqueStrings } from "./shared";

export const hackerNewsRecordSchema = z.object({
  companyName: z.string().min(1),
  description: z.string().nullish(),
  sourceUrl: z.string().url(),
  websiteUrl: z.string().url().nullish(),
  location: z.string().nullish(),
  postedAt: z.coerce.date().nullish(),
  roles: z.array(rawRoleSchema).default([]),
  people: z.array(rawPersonSchema).default([]),
  links: z.array(rawLinkSchema).default([]),
  technologies: z.array(z.string()).default([]),
});

export function normalizeHackerNewsPost(input: unknown) {
  const raw = hackerNewsRecordSchema.parse(input);
  return normalizedStartupSchema.parse({
    name: raw.companyName.trim(),
    description: cleanText(raw.description),
    industry: null,
    location: cleanText(raw.location),
    batch: null,
    source: "hn",
    sourceUrl: raw.sourceUrl,
    websiteUrl: raw.websiteUrl ?? null,
    sourcePublishedAt: raw.postedAt ?? null,
    roles: raw.roles.map((role) => ({
      ...role,
      sourceUrl: role.sourceUrl ?? raw.sourceUrl,
    })),
    people: raw.people.map((person) => ({
      ...person,
      sourceUrl: person.sourceUrl ?? raw.sourceUrl,
    })),
    links: buildLinks(raw.sourceUrl, raw.websiteUrl, raw.links),
    technologies: uniqueStrings(raw.technologies),
  });
}
