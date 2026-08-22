import { AlertTriangle, ArrowRight, Check, Database } from "lucide-react";

export function IsometricScraperHealthConsole() {
  return (
    <div
      className="relative min-h-[360px] overflow-hidden border border-border bg-background p-5 sm:p-8"
      aria-label="Failed collection run preserves the last successful startup dataset"
    >
      <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
      <div className="relative grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <article className="border border-warning/40 bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-muted">
              CONTROLLED RECOVERY
            </span>
            <AlertTriangle className="size-4 text-warning" />
          </div>
          <h3 className="mt-8 text-lg font-semibold">YC Companies</h3>
          <p className="mt-2 text-sm text-warning">
            Run completed with warnings
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-px bg-border text-xs">
            <div className="bg-surface p-3">
              <dt className="text-muted">Valid rows</dt>
              <dd className="mt-1 font-mono font-bold">SAVED</dd>
            </div>
            <div className="bg-surface p-3">
              <dt className="text-muted">Isolated</dt>
              <dd className="mt-1 font-mono font-bold text-warning">HELD</dd>
            </div>
          </dl>
        </article>
        <div className="hidden size-10 place-items-center bg-primary sm:grid">
          <ArrowRight className="size-4" />
        </div>
        <article className="border border-success/35 bg-accent p-5 text-accent-foreground shadow-card">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] opacity-65">
              VISIBLE DATASET
            </span>
            <Database className="size-4 text-primary" />
          </div>
          <h3 className="mt-8 text-lg font-semibold">
            Last successful data kept
          </h3>
          <p className="mt-2 text-sm opacity-70">
            Useful opportunities remain searchable while the warning is visible.
          </p>
          <div className="mt-5 flex items-center gap-2 border-t border-accent-foreground/20 pt-4 text-xs text-primary">
            <Check className="size-3.5" /> No destructive overwrite
          </div>
        </article>
      </div>
      <div className="relative mt-6 grid gap-px bg-border text-xs sm:grid-cols-3">
        <div className="bg-surface p-4">
          <span className="font-mono text-[10px] text-muted">01</span>
          <p className="mt-2 font-medium">Validate each row</p>
        </div>
        <div className="bg-surface p-4">
          <span className="font-mono text-[10px] text-muted">02</span>
          <p className="mt-2 font-medium">Save valid partial results</p>
        </div>
        <div className="bg-surface p-4">
          <span className="font-mono text-[10px] text-muted">03</span>
          <p className="mt-2 font-medium">Record source health</p>
        </div>
      </div>
    </div>
  );
}
