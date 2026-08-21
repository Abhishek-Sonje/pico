import { BrightDataError } from "@/lib/bright-data/types";
import { scraperRunRequestSchema } from "@/lib/validators/scraper.schema";
import { runScrape } from "@/server/actions/run-scrape";

export const maxDuration = 300;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        error: {
          code: "INVALID_JSON",
          message: "Request body must be valid JSON.",
        },
      },
      { status: 400 },
    );
  }

  const parsed = scraperRunRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        error: {
          code: "INVALID_SOURCE",
          message: "Choose a supported Pico source.",
        },
      },
      { status: 400 },
    );
  }

  try {
    const result = await runScrape(parsed.data.source);
    return Response.json({
      data: {
        sourceRunId: result.run.id,
        status: result.run.status,
        recordsFound: result.run.recordsFound,
        recordsValid: result.run.recordsValid,
        recordsInvalid: result.run.recordsInvalid,
      },
      meta: { snapshotId: result.snapshotId },
    });
  } catch (error) {
    const known = error instanceof BrightDataError;
    console.error("Scraper run failed", error);
    return Response.json(
      {
        error: {
          code: known ? error.code : "SCRAPER_FAILED",
          message: known
            ? error.message
            : "The scraper could not refresh this source. Previous saved data is still available.",
        },
      },
      { status: known && error.code === "NOT_CONFIGURED" ? 503 : 502 },
    );
  }
}
