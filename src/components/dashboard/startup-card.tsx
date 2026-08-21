import { ArrowUpRight, BriefcaseBusiness, MapPin, Users } from "lucide-react";

import type { StartupProfile } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const sourceNames = {
  "product-hunt": "Product Hunt",
  "yc-companies": "YC Companies",
  "yc-jobs": "YC Jobs",
};

export function StartupCard({
  startup,
  onOpen,
}: {
  startup: StartupProfile;
  onOpen: () => void;
}) {
  const hasApply =
    startup.roles.some((role) => role.applyUrl) ||
    startup.links.some((link) => ["apply", "careers"].includes(link.type));

  return (
    <Card className="group lift flex min-h-72 flex-col overflow-hidden border border-transparent p-5 transition-[transform,box-shadow,border-color] duration-200 hover:border-border hover:shadow-card">
      <button
        type="button"
        className="flex h-full flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={onOpen}
        aria-label={`View ${startup.name} details`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge>{sourceNames[startup.source]}</Badge>
            <h2 className="mt-3 text-xl font-semibold tracking-tight">
              {startup.name}
            </h2>
          </div>
          <span className="grid size-11 shrink-0 place-items-center bg-primary font-mono text-sm font-bold text-primary-foreground">
            {startup.signalScore}
          </span>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted">
          {startup.description ?? "No public description available."}
        </p>

        <div className="mt-5 space-y-2 text-xs text-muted">
          <span className="flex items-center gap-2">
            <BriefcaseBusiness className="size-3.5" />
            {startup.roles[0]?.title ?? "No role title published"}
            {startup.roles.length > 1 && ` +${startup.roles.length - 1}`}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="size-3.5" />
            {startup.location ??
              startup.roles[0]?.location ??
              "Location unavailable"}
          </span>
          <span className="flex items-center gap-2">
            <Users className="size-3.5" />
            {startup.people.length
              ? `${startup.people.length} public team signal${startup.people.length > 1 ? "s" : ""}`
              : "Founder info unavailable"}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-6">
          <span
            className={
              hasApply
                ? "text-xs font-medium text-success"
                : "text-xs text-muted-foreground"
            }
          >
            {hasApply ? "Apply link available" : "No apply link"}
          </span>
          <ArrowUpRight className="size-4 text-muted transition group-hover:text-accent" />
        </div>
      </button>
    </Card>
  );
}
