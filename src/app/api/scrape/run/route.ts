import { BrightDataError } from "@/lib/bright-data/types";
import { scraperRunRequestSchema } from "@/lib/validators/scraper.schema";
import {
  acquireSourceRun,
  consumeOperatorAttempt,
  isOperatorAuthorized,
  isTrustedOrigin,
  releaseSourceRun,
} from "@/lib/security/operator-access";
import { env } from "@/lib/validators/env.schema";
import { runScrape } from "@/server/actions/run-scrape";

export const maxDuration = 300;

export async function POST(request: Request) {
  if (!env.PICO_OPERATOR_KEY) {
    return Response.json(
      {
        error: {
          code: "OPERATOR_ACCESS_NOT_CONFIGURED",
          message: "Operator access is not configured for scraper runs.",
        },
      },
      { status: 503 },
    );
  }

  if (!isTrustedOrigin(request)) {
    return Response.json(
      { error: { code: "UNTRUSTED_ORIGIN", message: "Origin not allowed." } },
      { status: 403 },
    );
  }

  const rate = consumeOperatorAttempt(request);
  if (!rate.allowed) {
    return Response.json(
      {
        error: {
          code: "RATE_LIMITED",
          message: "Too many scraper requests. Try again shortly.",
        },
      },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
    );
  }

  if (!(await isOperatorAuthorized(request))) {
    return Response.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "A valid operator key is required.",
        },
      },
      { status: 401 },
    );
  }

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

  if (!acquireSourceRun(parsed.data.source)) {
    return Response.json(
      {
        error: {
          code: "SOURCE_RUN_IN_PROGRESS",
          message: "This source is already being refreshed.",
        },
      },
      { status: 409 },
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
      meta: { completed: true },
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
  } finally {
    releaseSourceRun(parsed.data.source);
  }
}
