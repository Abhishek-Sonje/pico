"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Radar, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import type { DashboardData, DataSource, StartupProfile } from "@/lib/types";
import { filterStartups } from "@/lib/filters/filter-startups";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StartupCard } from "./startup-card";
import { StartupDetailDrawer } from "./startup-detail-drawer";
import { SourceHealthPanel } from "./source-health-panel";

type UiFilters = {
  q: string;
  source: DataSource | "";
  role: string;
  remote: boolean;
  hasApplyLink: boolean;
  hasFounderInfo: boolean;
};

const initialFilters: UiFilters = {
  q: "",
  source: "",
  role: "",
  remote: false,
  hasApplyLink: false,
  hasFounderInfo: false,
};

const booleanFilters = [
  ["remote", "Remote only"],
  ["hasApplyLink", "Has apply link"],
  ["hasFounderInfo", "Has founder info"],
] as const;

export function DashboardShell({
  initialData,
}: {
  initialData: DashboardData;
}) {
  const [filters, setFilters] = useState(initialFilters);
  const [selected, setSelected] = useState<StartupProfile | null>(null);
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
  const visible = useMemo(
    () =>
      filterStartups(initialData.startups, {
        ...filters,
        source: filters.source || undefined,
        role: filters.role || undefined,
      }),
    [filters, initialData.startups],
  );
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-foreground text-background">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid size-8 place-items-center bg-primary text-primary-foreground">
              <Radar className="size-4" />
            </span>
            Pico
          </Link>
          <Link
            href="/"
            className="text-xs text-background/65 hover:text-primary"
          >
            Back to product story
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-[1500px] px-5 py-10 lg:px-8 lg:py-14">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-semibold tracking-[-.035em] sm:text-5xl">
              Startups worth a closer look
            </h1>
            <p className="mt-4 text-sm text-muted">
              Ranked from explainable public company and hiring signals.
            </p>
          </div>
          <div className="rounded-full bg-primary-muted px-3 py-1.5 font-mono text-[10px] font-medium text-accent">
            {initialData.mode === "demo" ? "Demo dataset" : "Live database"}
          </div>
        </div>
        {initialData.notice && (
          <div className="mt-6 border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
            {initialData.notice}
          </div>
        )}
        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_330px]">
          <section>
            <div className="border-y border-border bg-surface py-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 size-4 text-muted" />
                <Input
                  value={filters.q}
                  onChange={(event) =>
                    setFilters({ ...filters, q: event.target.value })
                  }
                  placeholder="Search startups, roles, descriptions, tech..."
                  className="pl-10"
                  aria-label="Search startups"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Select
                  value={filters.source}
                  onChange={(event) =>
                    setFilters({
                      ...filters,
                      source: event.target.value as DataSource | "",
                    })
                  }
                  aria-label="Filter by source"
                >
                  <option value="">All sources</option>
                  <option value="hn">Hacker News</option>
                  <option value="yc-companies">YC Companies</option>
                  <option value="yc-jobs">YC Jobs</option>
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
                    className="flex h-11 cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-muted"
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
                  <RotateCcw className="size-4" />
                  Reset
                </Button>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-muted">
                {visible.length} opportunities
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <SlidersHorizontal className="size-3" />
                Highest signal first
              </span>
            </div>
            {visible.length ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {visible
                  .sort((a, b) => b.signalScore - a.signalScore)
                  .map((startup) => (
                    <StartupCard
                      key={startup.id}
                      startup={startup}
                      onOpen={() => setSelected(startup)}
                    />
                  ))}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-border bg-card py-20 text-center">
                <Search className="mx-auto size-8 text-muted" />
                <h2 className="mt-4 font-semibold">No signals match</h2>
                <p className="mt-2 text-sm text-muted">
                  Try removing a filter or broadening your search.
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
          </section>
          <SourceHealthPanel health={initialData.health} />
        </div>
      </div>
      <StartupDetailDrawer
        startup={selected}
        onClose={() => setSelected(null)}
      />
    </main>
  );
}
