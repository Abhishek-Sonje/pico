"use client";

import { ArrowUpRight, X } from "lucide-react";
import type { StartupProfile } from "@/lib/types";
import { profileCompleteness } from "./opportunity-radar";

export function ComparisonPanel({
  startups,
  onRemove,
}: {
  startups: StartupProfile[];
  onRemove: (id: string) => void;
}) {
  if (!startups.length) return null;

  return (
    <section
      id="company-comparison"
      aria-labelledby="comparison-title"
      className="border-y border-border bg-primary-muted px-5 py-8 lg:px-8"
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2
              id="comparison-title"
              className="text-2xl font-semibold tracking-tight"
            >
              Compare the evidence
            </h2>
            <p className="mt-2 text-sm text-muted">
              Choose two companies. Pico keeps the reasons visible.
            </p>
          </div>
          <span className="font-mono text-xs text-muted">
            {startups.length}/2 selected
          </span>
        </div>
        <div className="mt-6 grid gap-px bg-border lg:grid-cols-2">
          {startups.map((startup) => (
            <article
              key={startup.id}
              className="min-w-0 bg-surface-elevated p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate text-xl font-semibold">
                    {startup.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {startup.industry ?? "Industry unavailable"} ·{" "}
                    {startup.batch ?? "Batch unavailable"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(startup.id)}
                  className="grid size-11 shrink-0 place-items-center"
                  aria-label={`Remove ${startup.name} from comparison`}
                >
                  <X className="size-4" />
                </button>
              </div>
              <dl className="mt-6 grid grid-cols-3 gap-px bg-border">
                <div className="bg-card p-3">
                  <dt className="text-[10px] uppercase tracking-wider text-muted">
                    Signal
                  </dt>
                  <dd className="mt-2 font-mono text-xl font-semibold">
                    {startup.signalScore}
                  </dd>
                </div>
                <div className="bg-card p-3">
                  <dt className="text-[10px] uppercase tracking-wider text-muted">
                    Complete
                  </dt>
                  <dd className="mt-2 font-mono text-xl font-semibold">
                    {profileCompleteness(startup)}%
                  </dd>
                </div>
                <div className="bg-card p-3">
                  <dt className="text-[10px] uppercase tracking-wider text-muted">
                    Roles
                  </dt>
                  <dd className="mt-2 font-mono text-xl font-semibold">
                    {startup.roles.length}
                  </dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                {startup.technologies.slice(0, 5).map((technology) => (
                  <span
                    key={technology}
                    className="border border-border px-2.5 py-1 text-xs"
                  >
                    {technology}
                  </span>
                ))}
              </div>
              <ul className="mt-5 space-y-2 text-sm text-muted">
                {startup.scoreReasons
                  .filter((reason) => reason.present)
                  .slice(0, 4)
                  .map((reason) => (
                    <li
                      key={reason.label}
                      className="flex justify-between gap-4"
                    >
                      <span>{reason.label}</span>
                      <span className="font-mono text-foreground">
                        +{reason.points}
                      </span>
                    </li>
                  ))}
              </ul>
              <a
                href={startup.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex h-11 items-center gap-2 border-b border-foreground text-sm font-medium"
              >
                Open YC profile <ArrowUpRight className="size-4" />
              </a>
            </article>
          ))}
          {startups.length === 1 && (
            <div className="grid min-h-72 place-items-center bg-surface p-8 text-center text-sm text-muted">
              Select one more company from the ranked feed or radar.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
