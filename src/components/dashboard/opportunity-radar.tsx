"use client";

import { Crosshair, Plus, X } from "lucide-react";
import type { StartupProfile } from "@/lib/types";

export function profileCompleteness(startup: StartupProfile) {
  return Math.max(
    0,
    Math.round(((6 - startup.missingFields.length) / 6) * 100),
  );
}

export function OpportunityRadar({
  startups,
  comparedIds,
  onOpen,
  onCompare,
}: {
  startups: StartupProfile[];
  comparedIds: string[];
  onOpen: (startup: StartupProfile) => void;
  onCompare: (startup: StartupProfile) => void;
}) {
  return (
    <section aria-labelledby="radar-title" className="min-w-0">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="radar-title" className="text-xl font-semibold tracking-tight">
            Opportunity radar
          </h2>
          <p className="mt-1 text-sm text-muted">
            Signal strength against public-profile completeness.
          </p>
        </div>
        <Crosshair className="size-5 text-accent" aria-hidden="true" />
      </div>

      <div className="relative mt-5 hidden h-[470px] overflow-hidden border border-border bg-card md:block">
        <div className="radar-grid absolute inset-0" aria-hidden="true" />
        <span className="absolute left-4 top-4 text-[10px] font-medium uppercase tracking-[.16em] text-muted">
          Complete profile
        </span>
        <span className="absolute bottom-4 left-4 text-[10px] font-medium uppercase tracking-[.16em] text-muted">
          Sparse profile
        </span>
        <span className="absolute bottom-4 right-4 text-[10px] font-medium uppercase tracking-[.16em] text-muted">
          Strong signal
        </span>

        {startups.map((startup, index) => {
          const completeness = profileCompleteness(startup);
          const compared = comparedIds.includes(startup.id);
          const jitter = ((index % 5) - 2) * 0.7;
          return (
            <button
              key={startup.id}
              type="button"
              onClick={() => onOpen(startup)}
              className={`group absolute grid -translate-x-1/2 translate-y-1/2 place-items-center border-2 text-[10px] font-bold shadow-soft transition-[transform,background-color,border-color] hover:z-20 hover:scale-125 focus-visible:z-20 ${
                compared
                  ? "border-foreground bg-primary text-primary-foreground"
                  : "border-accent bg-surface-elevated text-foreground"
              }`}
              style={{
                left: `${Math.min(92, Math.max(8, startup.signalScore + jitter))}%`,
                bottom: `${Math.min(90, Math.max(10, completeness + jitter))}%`,
                width: `${Math.min(54, 32 + startup.roles.length * 4)}px`,
                height: `${Math.min(54, 32 + startup.roles.length * 4)}px`,
              }}
              aria-label={`${startup.name}, signal ${startup.signalScore}, ${completeness}% complete`}
            >
              {startup.signalScore}
              <span className="pointer-events-none absolute left-1/2 top-[calc(100%+8px)] z-30 hidden w-max max-w-48 -translate-x-1/2 bg-foreground px-2 py-1 text-xs font-medium text-background group-hover:block group-focus-visible:block">
                {startup.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 divide-y divide-border border-y border-border md:hidden">
        {startups.slice(0, 12).map((startup) => {
          const compared = comparedIds.includes(startup.id);
          return (
            <div key={startup.id} className="flex items-center gap-3 py-3">
              <button
                className="min-w-0 flex-1 text-left"
                onClick={() => onOpen(startup)}
              >
                <span className="block truncate font-medium">
                  {startup.name}
                </span>
                <span className="mt-1 block text-xs text-muted">
                  {startup.signalScore} signal · {profileCompleteness(startup)}%
                  complete
                </span>
              </button>
              <button
                type="button"
                onClick={() => onCompare(startup)}
                className="grid size-11 place-items-center border border-border bg-card"
                aria-label={`${compared ? "Remove" : "Add"} ${startup.name} ${compared ? "from" : "to"} comparison`}
              >
                {compared ? (
                  <X className="size-4" />
                ) : (
                  <Plus className="size-4" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
