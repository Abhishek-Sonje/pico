import "server-only";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { env, requireDatabaseUrl } from "@/lib/validators/env.schema";
import * as schema from "./schema";

let database: ReturnType<typeof createDatabase> | undefined;

function createDatabase() {
  const pool = new Pool({ connectionString: requireDatabaseUrl() });
  return drizzle({ client: pool, schema });
}

export function isDatabaseConfigured() {
  return Boolean(env.DATABASE_URL);
}
export function getDatabase() {
  database ??= createDatabase();
  return database;
}
export type PicoDatabase = ReturnType<typeof getDatabase>;
