import "server-only";

import { env } from "@/lib/validators/env.schema";

const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; resetsAt: number }>();
const activeSources = new Set<string>();

async function digest(value: string) {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
}

export async function matchesSecret(provided: string, expected: string) {
  const [providedDigest, expectedDigest] = await Promise.all([
    digest(provided),
    digest(expected),
  ]);
  const left = new Uint8Array(providedDigest);
  const right = new Uint8Array(expectedDigest);
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index] ^ right[index];
  }
  return difference === 0;
}

function requestIdentity(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function isTrustedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return origin === new URL(env.NEXT_PUBLIC_APP_URL).origin;
}

export function consumeOperatorAttempt(request: Request) {
  const key = requestIdentity(request);
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetsAt <= now) {
    attempts.set(key, { count: 1, resetsAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  current.count += 1;
  return {
    allowed: current.count <= MAX_ATTEMPTS,
    retryAfter: Math.max(1, Math.ceil((current.resetsAt - now) / 1000)),
  };
}

export async function isOperatorAuthorized(request: Request) {
  if (!env.PICO_OPERATOR_KEY) return false;
  const provided = request.headers.get("x-pico-operator-key") ?? "";
  return matchesSecret(provided, env.PICO_OPERATOR_KEY);
}

export function acquireSourceRun(source: string) {
  if (activeSources.has(source)) return false;
  activeSources.add(source);
  return true;
}

export function releaseSourceRun(source: string) {
  activeSources.delete(source);
}
