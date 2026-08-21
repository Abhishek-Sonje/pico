import { filterStartups } from "@/lib/filters/filter-startups";
import { filtersSchema } from "@/lib/validators/filters.schema";
import { getDashboardData } from "@/server/queries/startups";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = filtersSchema.safeParse(Object.fromEntries(url.searchParams));

  if (!parsed.success) {
    return Response.json(
      {
        error: {
          code: "INVALID_FILTERS",
          message: "One or more startup filters are invalid.",
        },
      },
      { status: 400 },
    );
  }

  try {
    const dashboard = await getDashboardData();
    const startups = filterStartups(dashboard.startups, parsed.data);

    return Response.json({
      data: startups,
      meta: {
        mode: dashboard.mode,
        total: startups.length,
      },
    });
  } catch (error) {
    console.error("Failed to load startups", error);
    return Response.json(
      {
        error: {
          code: "STARTUPS_UNAVAILABLE",
          message: "Startup data is temporarily unavailable.",
        },
      },
      { status: 500 },
    );
  }
}
