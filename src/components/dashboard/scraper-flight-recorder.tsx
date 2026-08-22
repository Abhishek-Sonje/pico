import { formatDistanceToNow } from "date-fns";
import { Check, Database, ShieldCheck, Sparkles } from "lucide-react";
import type { DashboardData } from "@/lib/types";

export function ScraperFlightRecorder({ data }: { data: DashboardData }) {
  const latest = data.health[0];
  const stages = [
    { label: "Collected", value: latest?.recordsFound ?? 0, icon: Database },
    { label: "Validated", value: latest?.recordsValid ?? 0, icon: ShieldCheck },
    { label: "Normalized", value: latest?.recordsValid ?? 0, icon: Sparkles },
    { label: "Ranked", value: data.startups.length, icon: Check },
  ];

  return (
    <section
      aria-labelledby="flight-recorder-title"
      className="bg-foreground px-5 py-5 text-background sm:px-6"
    >
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="max-w-sm">
          <div className="flex items-center gap-2">
            <span
              className={`size-2 ${latest?.status === "healthy" ? "bg-primary" : "bg-warning"}`}
            />
            <h2 id="flight-recorder-title" className="text-sm font-semibold">
              Scraper flight recorder
            </h2>
          </div>
          <p className="mt-2 text-xs leading-5 text-background/65">
            One YC collector. Every row checked before it reaches the radar.
          </p>
        </div>
        <ol className="grid flex-1 grid-cols-2 gap-px bg-background/15 sm:grid-cols-4 lg:max-w-3xl">
          {stages.map(({ label, value, icon: Icon }) => (
            <li key={label} className="bg-foreground px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-background/60">{label}</span>
                <Icon className="size-3.5 text-primary" aria-hidden="true" />
              </div>
              <p className="mt-2 font-mono text-xl font-semibold tabular-nums">
                {value}
              </p>
            </li>
          ))}
        </ol>
      </div>
      {data.runHistory.length > 0 && (
        <div
          className="mt-4 flex gap-2 overflow-x-auto border-t border-background/15 pt-4"
          aria-label="Recent collection runs"
        >
          {data.runHistory.map((run) => (
            <div
              key={run.id}
              className="flex shrink-0 items-center gap-2 border border-background/15 px-2.5 py-1.5 text-[10px] text-background/65"
            >
              <span
                className={`size-1.5 ${run.status === "healthy" ? "bg-primary" : run.status === "warning" ? "bg-warning" : "bg-danger"}`}
              />
              <span>
                {run.recordsValid}/{run.recordsFound} valid
              </span>
              <span>·</span>
              <time dateTime={run.startedAt}>
                {formatDistanceToNow(new Date(run.startedAt), {
                  addSuffix: true,
                })}
              </time>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
