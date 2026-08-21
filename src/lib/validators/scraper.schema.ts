import { z } from "zod";
import { dataSources } from "@/lib/types";

export const scraperRunRequestSchema = z.object({
  source: z.enum(dataSources),
});

export const rawRoleSchema = z.object({
  title: z.string().min(1),
  location: z.string().nullish(),
  remote: z.boolean().nullish(),
  salary: z.string().nullish(),
  applyUrl: z.string().url().nullish(),
  sourceUrl: z.string().url().nullish(),
});

export const rawPersonSchema = z.object({
  name: z.string().min(1),
  role: z.string().nullish(),
  sourceUrl: z.string().url().nullish(),
});

export const rawLinkSchema = z.object({
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
