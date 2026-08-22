"use client";

import { useMemo, useState } from "react";
import { ArrowRight, GitCompareArrows, RotateCcw, Search } from "lucide-react";
import type { DashboardData, StartupProfile } from "@/lib/types";
import { filterStartups } from "@/lib/filters/filter-startups";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AppNavbar } from "@/components/navigation/app-navbar";
import { StartupDetailDrawer } from "./startup-detail-drawer";
import { OpportunityRadar, profileCompleteness } from "./opportunity-radar";
import { ComparisonPanel } from "./comparison-panel";
import { ScraperFlightRecorder } from "./scraper-flight-recorder";

type UiFilters = {
  q: string;
  role: string;
  industry: string;
  remote: boolean;
  hasApplyLink: boolean;
  hasFounderInfo: boolean;
};
const initialFilters: UiFilters = {
  q: "",
  role: "",
  industry: "",
  remote: false,
  hasApplyLink: false,
  hasFounderInfo: false,
};
const booleanFilters = [
  ["remote", "Remote"],
  ["hasApplyLink", "Apply link"],
  ["hasFounderInfo", "Founder info"],
] as const;

export function DashboardShell({
  initialData,
}: {
  initialData: DashboardData;
}) {
  const [filters, setFilters] = useState(initialFilters);
  const [selected, setSelected] = useState<StartupProfile | null>(null);
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const roleOptions = useMemo(
    () =>
      [
        ...new Set(
          initialData.startups.flatMap((startup) =>
            startup.roles.map((role) => role.title),
          ),
        ),
      ].sort(),
    [initialData.startups],
  );
  const industryOptions = useMemo(
    () =>
      [
        ...new Set(
          initialData.startups
            .map((startup) => startup.industry)
            .filter(Boolean) as string[],
        ),
      ].sort(),
    [initialData.startups],
  );
  const visible = useMemo(
    () =>
      filterStartups(initialData.startups, {
        q: filters.q,
        role: filters.role || undefined,
        remote: filters.remote,
        hasApplyLink: filters.hasApplyLink,
        hasFounderInfo: filters.hasFounderInfo,
      })
        .filter(
          (startup) =>
            !filters.industry || startup.industry === filters.industry,
        )
        .sort((a, b) => b.signalScore - a.signalScore),
    [filters, initialData.startups],
  );
  const compared = comparedIds
    .map((id) => initialData.startups.find((startup) => startup.id === id))
    .filter(Boolean) as StartupProfile[];
  const toggleCompare = (startup: StartupProfile) =>
    setComparedIds((current) =>
      current.includes(startup.id)
        ? current.filter((id) => id !== startup.id)
        : current.length === 2
          ? [current[1], startup.id]
          : [...current, startup.id],
    );

  return (
    <main className="min-h-screen bg-background">
      <AppNavbar page="dashboard" />
      <ScraperFlightRecorder data={initialData} />
      <div className="mx-auto max-w-[1500px] px-5 py-9 lg:px-8 lg:py-12">
        <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <h1 className="max-w-4xl text-[clamp(2.5rem,5vw,4.75rem)] font-semibold leading-[.98] tracking-[-.04em]">
              Find the YC company worth your next move.
            </h1>
            <p className="mt-5 max-w-[68ch] leading-7 text-muted">
              One public directory, validated row by row and ranked with every
              scoring reason intact.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 self-start border border-border bg-card px-3 py-2 font-mono text-[11px] text-accent lg:self-auto">
            <span className="size-2 bg-primary" />
            {initialData.mode === "demo" ? "DEMO DATA" : "LIVE · YC COMPANIES"}
          </div>
        </header>
        {initialData.notice && (
          <div className="mt-6 border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
            {initialData.notice}
          </div>
        )}
        <section
          aria-label="Opportunity filters"
          className="mt-9 border-y border-border py-4"
        >
          <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_auto]">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 size-4 text-muted" />
              <Input
                value={filters.q}
                onChange={(event) =>
                  setFilters({ ...filters, q: event.target.value })
                }
                placeholder="Search company, role, technology..."
                className="pl-10"
                aria-label="Search opportunities"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                value={filters.industry}
                onChange={(event) =>
                  setFilters({ ...filters, industry: event.target.value })
                }
                aria-label="Filter by industry"
              >
                <option value="">All industries</option>
                {industryOptions.map((industry) => (
                  <option key={industry}>{industry}</option>
                ))}
              </Select>
              <Select
                value={filters.role}
                onChange={(event) =>
                  setFilters({ ...filters, role: event.target.value })
                }
                aria-label="Filter by role"
              >
                <option value="">All roles</option>
                {roleOptions.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </Select>
              {booleanFilters.map(([key, label]) => (
                <label
                  key={key}
                  className="flex h-11 cursor-pointer items-center gap-2 border border-border bg-card px-3 text-sm text-muted"
                >
                  <input
                    type="checkbox"
                    checked={filters[key]}
                    onChange={(event) =>
                      setFilters({ ...filters, [key]: event.target.checked })
                    }
                    className="accent-primary"
                  />
                  {label}
                </label>
              ))}
              <Button
                variant="ghost"
                onClick={() => setFilters(initialFilters)}
              >
                <RotateCcw className="size-4" /> Reset
              </Button>
            </div>
          </div>
        </section>
        {visible.length ? (
          <div className="mt-9 grid gap-10 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,.65fr)]">
            <OpportunityRadar
              startups={visible}
              comparedIds={comparedIds}
              onOpen={setSelected}
              onCompare={toggleCompare}
            />
            <section aria-labelledby="ranked-title" className="min-w-0">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2
                    id="ranked-title"
                    className="text-xl font-semibold tracking-tight"
                  >
                    Ranked evidence
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {visible.length} companies · strongest signal first
                  </p>
                </div>
                <GitCompareArrows className="size-5 text-accent" />
              </div>
              <div className="mt-5 max-h-[470px] overflow-y-auto border-y border-border pr-2">
                {visible.map((startup, index) => {
                  const chosen = comparedIds.includes(startup.id);
                  return (
                    <article
                      key={startup.id}
                      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border py-4 last:border-b-0"
                    >
                      <span className="w-6 font-mono text-[10px] text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelected(startup)}
                        className="min-w-0 text-left"
                      >
                        <span className="flex items-center gap-2">
                          <strong className="truncate font-semibold">
                            {startup.name}
                          </strong>
                          <span className="font-mono text-xs text-accent">
                            {startup.signalScore}
                          </span>
                        </span>
                        <span className="mt-1 block truncate text-xs text-muted">
                          {startup.industry ?? "Industry unavailable"} ·{" "}
                          {profileCompleteness(startup)}% complete
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleCompare(startup)}
                        className={`inline-flex h-11 items-center gap-1.5 px-3 text-xs font-medium ${chosen ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}
                        aria-pressed={chosen}
                      >
                        {chosen ? "Selected" : "Compare"}
                        <ArrowRight className="size-3.5" />
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        ) : (
          <div className="mt-9 border border-dashed border-border bg-card py-20 text-center">
            <Search className="mx-auto size-8 text-muted" />
            <h2 className="mt-4 font-semibold">No signals match</h2>
            <p className="mt-2 text-sm text-muted">
              Broaden the search or remove a filter.
            </p>
            <Button
              className="mt-5"
              variant="outline"
              onClick={() => setFilters(initialFilters)}
            >
              Reset filters
            </Button>
          </div>
        )}
      </div>
      <ComparisonPanel
        startups={compared}
        onRemove={(id) =>
          setComparedIds((current) => current.filter((item) => item !== id))
        }
      />
      <StartupDetailDrawer
        startup={selected}
        onClose={() => setSelected(null)}
        onCompare={toggleCompare}
      />
    </main>
  );
}
