"use client";
import { Activity, CheckCircle2, TriangleAlert } from "lucide-react";
const rows = [
  ["HN Who is Hiring", "82 records", "healthy"],
  ["YC Companies", "7 missing fields", "warning"],
  ["YC Jobs", "51 records", "healthy"],
] as const;
export function IsometricScraperHealthConsole() {
  return (
    <div
      className="iso-stage relative min-h-[390px] overflow-hidden"
      aria-label="Scraper health console showing validation and recovery"
    >
      <div className="iso-plane iso-card absolute left-[10%] top-12 w-[78%] border border-border bg-card p-5 sm:left-[14%] sm:w-[72%]">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-sm font-semibold">Source health</p>
            <p className="font-mono text-[9px] text-muted">LAST RUN · 2M AGO</p>
          </div>
          <Activity className="size-5 text-accent" />
        </div>
        <div className="mt-3 grid gap-2">
          {rows.map(([name, detail, status]) => (
            <div
              key={name}
              className="flex items-center gap-3 border border-border bg-surface p-3"
            >
              <span
                className={`size-2 ${status === "healthy" ? "bg-success" : "soft-pulse bg-warning"}`}
              />
              <span className="min-w-0 flex-1 truncate text-xs font-medium">
                {name}
              </span>
              <span className="font-mono text-[9px] text-muted">{detail}</span>
              {status === "healthy" ? (
                <CheckCircle2 className="size-3 text-success" />
              ) : (
                <TriangleAlert className="size-3 text-warning" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 h-1 bg-surface-muted">
          <div className="signal-line h-full w-[88%]" />
        </div>
      </div>
      <div className="absolute bottom-6 left-[6%] right-[6%] z-20 grid grid-cols-4 border border-border bg-accent text-accent-foreground">
        {["Detect", "Validate", "Preserve", "Update"].map((step, index) => (
          <div
            key={step}
            className="border-r border-accent-foreground/20 p-3 text-center last:border-r-0"
          >
            <span className="block font-mono text-[9px] opacity-60">
              {index + 1}/4
            </span>
            <span className="mt-1 block text-[10px] font-medium">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
