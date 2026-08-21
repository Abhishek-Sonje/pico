"use client";
import { ArrowUpRight, Check, MapPin } from "lucide-react";
const cards = [
  {
    name: "Kite Systems",
    role: "Product Engineer",
    score: 84,
    offset: "translate-x-8 translate-y-8 opacity-45",
  },
  {
    name: "Northstar Labs",
    role: "Full-stack Developer",
    score: 88,
    offset: "translate-x-4 translate-y-4 opacity-70",
  },
  { name: "Orbit AI", role: "Backend Engineer", score: 91, offset: "" },
];
export function IsometricStartupCardStack() {
  return (
    <div
      className="iso-stage relative min-h-[430px] overflow-hidden"
      aria-label="Ranked startup opportunity cards"
    >
      <div className="iso-plane absolute left-[13%] top-20 h-64 w-[72%] border border-border bg-primary-muted" />
      <div className="absolute left-[9%] top-12 h-72 w-[78%] sm:left-[14%] sm:w-[70%]">
        {cards.map((card, index) => (
          <article
            key={card.name}
            className={`iso-hover iso-card absolute inset-0 border border-border bg-card p-5 transition-[transform] duration-200 ${card.offset}`}
            style={{ zIndex: index }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted">
                  YC source · AI infrastructure
                </p>
                <h3 className="mt-2 text-xl font-semibold">{card.name}</h3>
              </div>
              <span className="bg-primary px-3 py-2 font-mono text-sm font-bold">
                {card.score}
              </span>
            </div>
            <p className="mt-5 text-sm text-muted">
              Hiring:{" "}
              <span className="font-medium text-foreground">{card.role}</span>
            </p>
            <div className="mt-5 grid grid-cols-2 gap-px bg-border text-[11px]">
              <span className="flex items-center gap-2 bg-surface p-3">
                <MapPin className="size-3 text-accent" /> Remote
              </span>
              <span className="flex items-center gap-2 bg-surface p-3">
                <Check className="size-3 text-success" /> Founder info
              </span>
              <span className="col-span-2 flex items-center gap-2 bg-surface p-3 text-success">
                <Check className="size-3" /> Apply link available{" "}
                <ArrowUpRight className="ml-auto size-3" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
