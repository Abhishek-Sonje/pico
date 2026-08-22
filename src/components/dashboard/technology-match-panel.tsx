"use client";

import { Check, Sparkles, X } from "lucide-react";

export function TechnologyMatchPanel({
  technologies,
  selected,
  onToggle,
  onClear,
}: {
  technologies: string[];
  selected: string[];
  onToggle: (technology: string) => void;
  onClear: () => void;
}) {
  return (
    <section
      aria-labelledby="technology-match-title"
      className="bg-foreground px-5 py-4 text-background sm:px-6"
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(190px,.5fr)_minmax(0,1.5fr)] xl:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" aria-hidden="true" />
            <h2
              id="technology-match-title"
              className="text-lg font-semibold tracking-tight"
            >
              Personalize your radar
            </h2>
          </div>
          <p className="mt-1.5 max-w-[48ch] text-xs leading-5 text-background/70">
            Select your stack to rank companies by technology overlap. Signal
            scores stay source-based.
          </p>
        </div>

        {technologies.length ? (
          <div>
            <div className="flex flex-wrap gap-2" aria-label="Technology stack">
              {technologies.map((technology) => {
                const active = selected.includes(technology);
                return (
                  <button
                    key={technology}
                    type="button"
                    onClick={() => onToggle(technology)}
                    aria-pressed={active}
                    className={`inline-flex min-h-10 items-center gap-2 border px-3 text-sm font-medium ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-background/25 text-background hover:border-background/60"
                    }`}
                  >
                    {active && (
                      <Check className="size-3.5" aria-hidden="true" />
                    )}
                    {technology}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex min-h-6 items-center justify-between gap-4 text-xs text-background/60">
              <span aria-live="polite">
                {selected.length
                  ? `${selected.length} selected · ranked by your match`
                  : "Choose one or more technologies"}
              </span>
              {selected.length > 0 && (
                <button
                  type="button"
                  onClick={onClear}
                  className="inline-flex items-center gap-1.5 text-background underline decoration-background/35 underline-offset-4 hover:decoration-background"
                >
                  Clear <X className="size-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-background/70">
            Technology signals will appear here after the next enriched scrape.
          </p>
        )}
      </div>
    </section>
  );
}
