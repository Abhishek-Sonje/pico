import { z } from "zod";
import { dataSources } from "@/lib/types";

export const startupRoleSchema = z.object({
  title: z.string().min(1),
  location: z.string().nullish(),
  remote: z.boolean().nullish(),
  salary: z.string().nullish(),
  applyUrl: z.string().url().nullish(),
  sourceUrl: z.string().url(),
});
export const startupPersonSchema = z.object({
  name: z.string().min(1),
  role: z.string().nullish(),
  sourceUrl: z.string().url(),
});
export const startupLinkSchema = z.object({
  type: z.enum([
    "website",
    "careers",
    "apply",
    "twitter",
    "linkedin",
    "github",
    "email",
    "source",
  ]),
  url: z.string().url(),
  label: z.string().nullish(),
});
export const normalizedStartupSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullish(),
  industry: z.string().nullish(),
  location: z.string().nullish(),
  batch: z.string().nullish(),
  source: z.enum(dataSources),
  sourceUrl: z.string().url(),
  websiteUrl: z.string().url().nullish(),
  sourcePublishedAt: z.coerce.date().nullish(),
  roles: z.array(startupRoleSchema).default([]),
  people: z.array(startupPersonSchema).default([]),
  links: z.array(startupLinkSchema).default([]),
  technologies: z.array(z.string().min(1)).default([]),
});
export type NormalizedStartup = z.infer<typeof normalizedStartupSchema>;
