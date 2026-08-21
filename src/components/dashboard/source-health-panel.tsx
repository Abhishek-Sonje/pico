import { formatDistanceToNow } from "date-fns";
import { Activity, ArrowUpRight } from "lucide-react";

import type { SourceHealth } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const statusStyles = {
  healthy: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  failed: "border-danger/30 bg-danger/10 text-danger",
};

export function SourceHealthPanel({ health }: { health: SourceHealth[] }) {
  return (
    <aside>
      <Card className="border border-border p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Source health</p>
            <p className="mt-1 text-xs text-muted">
              Latest collection outcomes
            </p>
          </div>
          <Activity className="size-5 text-primary" />
        </div>

        <div className="mt-5 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
          {health.length ? (
            health.map((source) => (
              <div key={source.source} className="bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <a
                      href={source.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium hover:text-primary"
                    >
                      {source.sourceName} <ArrowUpRight className="size-3" />
                    </a>
                    <p className="mt-1 text-xs text-muted">
                      {source.lastRunAt
                        ? formatDistanceToNow(new Date(source.lastRunAt), {
                            addSuffix: true,
                          })
                        : "No completed run"}
                    </p>
                  </div>
                  <Badge className={statusStyles[source.status]}>
                    {source.status}
                  </Badge>
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <dt className="text-[10px] uppercase text-muted-foreground">
                      Found
                    </dt>
                    <dd className="mt-1 text-sm font-medium">
                      {source.recordsFound}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase text-muted-foreground">
                      Valid
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-success">
                      {source.recordsValid}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase text-muted-foreground">
                      Invalid
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-warning">
                      {source.recordsInvalid}
                    </dd>
                  </div>
                </dl>
                {source.demo && (
                  <p className="mt-3 border-t border-border-muted pt-3 text-[11px] text-warning">
                    Demo health data
                  </p>
                )}
                {source.collectorId && (
                  <p className="mt-3 truncate font-mono text-[10px] text-muted-foreground">
                    {source.collectorId}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="rounded-xl border border-dashed border-border p-5 text-center text-sm text-muted">
              No source runs yet.
            </p>
          )}
        </div>
      </Card>
    </aside>
  );
}
