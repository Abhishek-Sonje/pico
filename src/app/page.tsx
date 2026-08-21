import Link from "next/link";
import {
  ArrowRight,
  Database,
  Radar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { HeroCardStack } from "@/components/landing/isometric-card-stack";
import { Badge } from "@/components/ui/badge";

const sources = [
  {
    name: "Hacker News",
    detail: "Who is Hiring?",
    href: "https://news.ycombinator.com/submitted?id=whoishiring",
  },
  {
    name: "Y Combinator",
    detail: "Companies",
    href: "https://www.ycombinator.com/companies",
  },
  {
    name: "YC Jobs",
    detail: "Open roles",
    href: "https://www.ycombinator.com/jobs",
  },
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <section className="relative min-h-screen border-b border-border-muted">
        <div className="pico-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="absolute left-1/3 top-0 h-96 w-96 rounded-full bg-primary/15 blur-[120px]" />
        <nav
          className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8"
          aria-label="Primary navigation"
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Radar className="size-4" />
            </span>
            Pico
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-border bg-surface/70 px-4 py-2 text-sm font-medium transition hover:border-primary hover:bg-surface-muted"
          >
            View dashboard
          </Link>
        </nav>
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pt-28">
          <div>
            <Badge className="mb-6 border-primary/40 bg-primary-muted text-primary">
              <Sparkles className="mr-1.5 size-3" />
              Startup opportunity radar
            </Badge>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Find the startup signal before everyone else.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg">
              Pico turns scattered public hiring and company data into a
              focused, explainable radar for developers choosing where to apply
              next.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-medium text-primary-foreground transition hover:brightness-110"
              >
                View Dashboard <ArrowRight className="size-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-border px-5 font-medium transition hover:bg-surface-muted"
              >
                See How It Works
              </a>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              No login. Public data only. Every signal keeps its source.
            </p>
          </div>
          <HeroCardStack />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Radar,
              title: "Useful signal, not noise",
              copy: "Roles, founders, links, location, freshness, and salary roll into one transparent score.",
            },
            {
              icon: Database,
              title: "Normalized at the source",
              copy: "Messy records become consistent startup profiles that remain searchable and comparable.",
            },
            {
              icon: ShieldCheck,
              title: "Public by design",
              copy: "Only public company, team, hiring, application, and official contact signals are surfaced.",
            },
          ].map(({ icon: Icon, title, copy }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <span className="mb-5 grid size-10 place-items-center rounded-xl bg-primary-muted text-primary">
                <Icon className="size-5" />
              </span>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
            </div>
          ))}
        </div>
      </section>
      <section
        id="how-it-works"
        className="border-y border-border-muted bg-surface/50 px-6 py-24 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-medium text-accent">How it works</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            From changing source pages to a resilient opportunity feed.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              "Collect public signals",
              "Validate and normalize",
              "Score what matters",
            ].map((title, index) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-background p-6"
              >
                <span className="font-mono text-xs text-primary">
                  0{index + 1}
                </span>
                <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {index === 0
                    ? "Bright Data collectors watch approved public startup and hiring pages."
                    : index === 1
                      ? "Every row passes source-specific validation. Good partial records survive; bad rows are counted."
                      : "A deterministic score explains exactly why each startup deserves attention."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="text-sm font-medium text-primary">
              Source-aware and self-healing
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              A broken source never erases yesterday&apos;s useful data.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted">
              Pico validates each record, saves valid partial results, reports
              source health, and keeps the last successful dataset visible when
              a collector fails.
            </p>
          </div>
          <div className="grid gap-3">
            {sources.map((source) => (
              <a
                key={source.name}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 transition hover:border-primary"
              >
                <span>
                  <strong className="block text-sm">{source.name}</strong>
                  <span className="text-xs text-muted">{source.detail}</span>
                </span>
                <ArrowRight className="size-4 text-muted" />
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-primary/30 bg-[radial-gradient(circle_at_top_left,var(--primary-muted),var(--surface)_60%)] p-8 sm:p-12">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Your next application deserves better signal.
          </h2>
          <p className="mt-4 max-w-xl text-muted">
            Explore a clean, ranked view of startup opportunities—without
            creating an account.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-5 font-medium text-primary-foreground"
          >
            Open Pico <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
      <footer className="border-t border-border-muted px-6 py-8 text-center text-xs text-muted-foreground">
        Pico only surfaces public startup, company, hiring, and contact signals.
        It does not scrape login-protected, paywalled, hidden, or private
        personal data.
      </footer>
    </main>
  );
}
