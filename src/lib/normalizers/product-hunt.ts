import { z } from "zod";
import {
  rawLinkSchema,
  rawPersonSchema,
} from "@/lib/validators/scraper.schema";
import { normalizedStartupSchema } from "@/lib/validators/startup.schema";
import { buildLinks, cleanText, uniqueStrings } from "./shared";

export const productHuntRecordSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().nullish(),
  description: z.string().nullish(),
  sourceUrl: z.string().url(),
  websiteUrl: z.string().url().nullish(),
  location: z.string().nullish(),
  launchedAt: z.coerce.date().nullish(),
  makers: z.array(rawPersonSchema).default([]),
  links: z.array(rawLinkSchema).default([]),
  topics: z.array(z.string()).default([]),
});

export function normalizeProductHuntPost(input: unknown) {
  const raw = productHuntRecordSchema.parse(input);
  return normalizedStartupSchema.parse({
    name: raw.name.trim(),
    description: cleanText(raw.description ?? raw.tagline),
    industry: null,
    location: cleanText(raw.location),
    batch: null,
    source: "product-hunt",
    sourceUrl: raw.sourceUrl,
    websiteUrl: raw.websiteUrl ?? null,
    sourcePublishedAt: raw.launchedAt ?? null,
    roles: [],
    people: raw.makers.map((maker) => ({
      ...maker,
      sourceUrl: maker.sourceUrl ?? raw.sourceUrl,
    })),
    links: buildLinks(raw.sourceUrl, raw.websiteUrl, raw.links),
    technologies: uniqueStrings(raw.topics),
  });
}
