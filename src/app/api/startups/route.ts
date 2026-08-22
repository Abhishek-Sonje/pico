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
    const filtered = filterStartups(dashboard.startups, parsed.data);
    const start = (parsed.data.page - 1) * parsed.data.limit;
    const startups = filtered.slice(start, start + parsed.data.limit);

    return Response.json({
      data: startups,
      meta: {
        mode: dashboard.mode,
        total: filtered.length,
        page: parsed.data.page,
        limit: parsed.data.limit,
        pages: Math.ceil(filtered.length / parsed.data.limit),
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
