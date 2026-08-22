import "server-only";

import { z } from "zod";

const optionalSecret = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

const envSchema = z.object({
  DATABASE_URL: optionalSecret.pipe(z.string().url().optional()),
  BRIGHTDATA_API_KEY: optionalSecret,
  BRIGHTDATA_YC_COMPANIES_COLLECTOR_ID: optionalSecret,
  PICO_OPERATOR_KEY: optionalSecret,
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  PICO_DEMO_MODE: z.enum(["true", "false"]).default("false"),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  BRIGHTDATA_API_KEY: process.env.BRIGHTDATA_API_KEY,
  BRIGHTDATA_YC_COMPANIES_COLLECTOR_ID:
    process.env.BRIGHTDATA_YC_COMPANIES_COLLECTOR_ID,
  PICO_OPERATOR_KEY: process.env.PICO_OPERATOR_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  PICO_DEMO_MODE: process.env.PICO_DEMO_MODE,
});

export function requireDatabaseUrl() {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }
  return env.DATABASE_URL;
}
