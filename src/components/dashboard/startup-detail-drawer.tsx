"use client";

import { useEffect, useRef } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  MapPin,
  Minus,
  Users,
  X,
} from "lucide-react";

import type { StartupProfile } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function StartupDetailDrawer({
  startup,
  onClose,
}: {
  startup: StartupProfile | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (startup && !dialog.open) dialog.showModal();
    if (!startup && dialog.open) dialog.close();
  }, [startup]);

  if (!startup) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => event.target === dialogRef.current && onClose()}
      className="ml-auto mr-0 h-dvh max-h-none w-full max-w-xl border-l border-border bg-surface p-0 text-foreground backdrop:bg-background/75 backdrop:backdrop-blur-sm"
      aria-labelledby="startup-drawer-title"
    >
      <div className="flex min-h-full flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface/95 px-6 py-5 backdrop-blur">
          <div>
            <Badge>{startup.source}</Badge>
            <h2
              id="startup-drawer-title"
              className="mt-2 text-2xl font-semibold"
            >
              {startup.name}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close details"
          >
            <X className="size-5" />
          </Button>
        </header>

        <div className="space-y-8 p-6">
          <div className="flex items-center gap-4 rounded-2xl border border-primary/30 bg-primary-muted/50 p-4">
            <span className="grid size-16 place-items-center rounded-full border border-primary/40 text-xl font-semibold text-primary">
              {startup.signalScore}
            </span>
            <div>
              <p className="font-medium">Signal score</p>
              <p className="mt-1 text-sm text-muted">
                Deterministic and based only on public signals.
              </p>
            </div>
          </div>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
              Company
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              {startup.description ?? "Not publicly available"}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {startup.industry && <Badge>{startup.industry}</Badge>}
              {startup.batch && <Badge>{startup.batch}</Badge>}
              {startup.technologies.map((technology) => (
                <Badge key={technology} className="text-accent">
                  {technology}
                </Badge>
              ))}
            </div>
          </section>

          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <BriefcaseBusiness className="size-4 text-primary" /> Roles
            </h3>
            {startup.roles.length ? (
              <div className="mt-3 space-y-3">
                {startup.roles.map((role) => (
                  <div
                    key={role.id}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <p className="font-medium">{role.title}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                      <MapPin className="size-3" />
                      {role.location ??
                        (role.remote ? "Remote" : "Location unavailable")}
                    </p>
                    {role.salary && (
                      <p className="mt-2 text-sm text-success">{role.salary}</p>
                    )}
                    {role.applyUrl && (
                      <a
                        href={role.applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        Apply <ArrowUpRight className="size-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted">Not publicly available</p>
            )}
          </section>

          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Users className="size-4 text-primary" /> Founders and team
            </h3>
            {startup.people.length ? (
              <div className="mt-3 space-y-2">
                {startup.people.map((person) => (
                  <a
                    key={person.id}
                    href={person.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-border p-3 text-sm hover:border-primary"
                  >
                    <span>
                      {person.name}
                      {person.role && (
                        <span className="ml-2 text-muted">· {person.role}</span>
                      )}
                    </span>
                    <ArrowUpRight className="size-3.5" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted">Not publicly available</p>
            )}
          </section>

          <section>
            <h3 className="text-sm font-semibold">Why this score</h3>
            <ul className="mt-3 space-y-2">
              {startup.scoreReasons.map((reason) => (
                <li
                  key={reason.label}
                  className="flex items-center gap-2 text-sm text-muted"
                >
                  {reason.present ? (
                    <Check className="size-4 text-success" />
                  ) : (
                    <Minus className="size-4 text-muted-foreground" />
                  )}
                  {reason.label}
                  <span className="ml-auto font-mono text-xs">
                    {reason.present ? `+${reason.points}` : "—"}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-semibold">Public links</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                ...startup.links,
                {
                  id: "source",
                  type: "source" as const,
                  url: startup.sourceUrl,
                  label: "Source",
                },
              ].map((link) => (
                <a
                  key={`${link.id}-${link.url}`}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:border-primary"
                >
                  {link.label ?? link.type} <ArrowUpRight className="size-3" />
                </a>
              ))}
            </div>
          </section>

          {startup.missingFields.length > 0 && (
            <section className="rounded-xl border border-warning/25 bg-warning/5 p-4">
              <h3 className="text-sm font-medium text-warning">
                Missing public fields
              </h3>
              <p className="mt-2 text-xs leading-5 text-muted">
                {startup.missingFields.join(", ")}. Pico keeps useful partial
                records instead of hiding the company.
              </p>
            </section>
          )}
        </div>
      </div>
    </dialog>
  );
}
