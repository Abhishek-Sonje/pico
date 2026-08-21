import "server-only";
import { drizzle } from "drizzle-orm/neon-http";
import { env, requireDatabaseUrl } from "@/lib/validators/env.schema";
import * as schema from "./schema";

export function isDatabaseConfigured() {
  return Boolean(env.DATABASE_URL);
}
export function getDatabase() {
  return drizzle(requireDatabaseUrl(), { schema });
}
export type PicoDatabase = ReturnType<typeof getDatabase>;
