import { getDashboardData } from "@/server/queries/startups";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getDashboardData();
    return Response.json(
      {
        status: "ready",
        mode: data.mode,
        source: "yc-companies",
        records: data.startups.length,
        latestRun: data.health[0]?.status ?? "unknown",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { status: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
