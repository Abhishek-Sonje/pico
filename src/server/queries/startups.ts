import "server-only";
import { demoDashboardData } from "@/data/demo-startups";
import { env } from "@/lib/validators/env.schema";
import type { DashboardData } from "@/lib/types";

export async function getDashboardData(): Promise<DashboardData> {
  if (env.PICO_DEMO_MODE === "true" || !env.DATABASE_URL)
    return demoDashboardData;
  // The database projection is isolated here so UI components never own persistence logic.
  const { getStoredDashboardData } = await import("./stored-startups");
  const stored = await getStoredDashboardData();
  return stored.startups.length
    ? stored
    : {
        ...demoDashboardData,
        notice:
          "The database is empty, so Pico is showing clearly marked demo data.",
      };
}
