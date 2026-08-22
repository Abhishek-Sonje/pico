import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { AppNavbar } from "@/components/navigation/app-navbar";
import { IsometricSignalPipeline } from "@/components/landing/isometric-signal-pipeline";
import { IsometricScraperHealthConsole } from "@/components/landing/isometric-scraper-health-console";
import { IsometricStartupCardStack } from "@/components/landing/isometric-startup-card-stack";

const facts = [
  "Public sources only",
  "Explainable score",
  "Previous data preserved",
];

export default function Home() {
  return (
    <main className="w-full max-w-full overflow-x-clip">
      <AppNavbar page="home" />

      <section className="editorial-grid border-b border-border">
        <div className="mx-auto grid min-h-[calc(100svh-73px)] max-w-[1440px] items-center gap-8 px-5 py-12 lg:grid-cols-[.9fr_1.1fr] lg:px-10 lg:py-16">
          <div className="relative z-10">
            <h1 className="max-w-4xl text-[clamp(2.75rem,5vw,4.5rem)] font-semibold leading-[.98] tracking-[-.04em]">
              Public startup signals, cleaned and scored.
            </h1>
            <p className="mt-6 max-w-[62ch] text-base leading-7 text-muted sm:text-lg">
              Pico gives developers one decision-ready view of startup roles
              from the Y Combinator company directory, with the source and every
              scoring reason kept visible.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center gap-2 bg-primary px-6 font-medium text-primary-foreground"
              >
                Explore opportunities <ArrowRight className="size-4" />
              </Link>
              <a
                href="#workflow"
                className="inline-flex h-12 items-center justify-center border border-foreground px-6 font-medium"
              >
                See the workflow
              </a>
            </div>
            <div className="mt-8 grid gap-3 text-xs text-muted sm:grid-cols-3">
              {facts.map((fact) => (
                <span key={fact} className="flex items-center gap-2">
                  <Check className="size-3.5 text-success" />
                  {fact}
                </span>
              ))}
            </div>
          </div>
          <IsometricSignalPipeline />
        </div>
      </section>

      <section
        id="workflow"
        className="mx-auto flex min-h-[92svh] max-w-[1440px] items-center px-5 py-20 lg:px-10 lg:py-24"
      >
        <div className="grid w-full gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
          <div>
            <h2 className="max-w-2xl text-4xl font-medium leading-tight tracking-[-.035em] sm:text-5xl">
              Messy inputs become a shortlist you can trust.
            </h2>
            <p className="mt-6 max-w-[62ch] leading-7 text-muted">
              Pico collects approved public pages, validates each row,
              normalizes each source, and assigns a deterministic score with
              visible reasons.
            </p>
            <ol className="mt-8 divide-y divide-border border-y border-border">
              {[
                ["Collect", "YC Companies"],
                ["Clean", "Validate and normalize"],
                ["Decide", "Score with reasons"],
              ].map(([title, detail]) => (
                <li
                  key={title}
                  className="flex items-center justify-between gap-6 py-4"
                >
                  <span className="font-medium">{title}</span>
                  <span className="text-right text-sm text-muted">
                    {detail}
                  </span>
                </li>
              ))}
            </ol>
            <Link
              href="/dashboard"
              className="mt-8 inline-flex items-center gap-2 border-b border-foreground pb-1 text-sm font-medium"
            >
              Browse the ranked feed <ArrowRight className="size-4" />
            </Link>
          </div>
          <IsometricStartupCardStack />
        </div>
      </section>

      <section id="resilience" className="border-y border-border bg-surface">
        <div className="mx-auto grid min-h-[92svh] max-w-[1440px] items-center gap-12 px-5 py-20 lg:grid-cols-[.9fr_1.1fr] lg:px-10 lg:py-24">
          <div>
            <ShieldCheck className="size-8 text-accent" />
            <h2 className="mt-7 max-w-xl text-4xl font-medium tracking-[-.035em] sm:text-5xl">
              A broken source does not erase yesterday’s useful data.
            </h2>
            <p className="mt-6 max-w-[62ch] leading-7 text-muted">
              Pico isolates invalid rows, saves valid partial results, records
              collection health, and preserves previously successful startup
              fields when new values are unavailable.
            </p>
            <Link
              href="/health"
              className="mt-8 inline-flex items-center gap-2 border-b border-foreground pb-1 text-sm font-medium"
            >
              View current source health <ArrowRight className="size-4" />
            </Link>
          </div>
          <IsometricScraperHealthConsole />
        </div>
      </section>

      <section className="flex min-h-[72svh] items-center px-5 py-20 lg:px-10">
        <div className="mx-auto w-full max-w-[1440px] bg-foreground px-6 py-14 text-background sm:px-12 lg:flex lg:items-end lg:justify-between lg:px-16 lg:py-16">
          <div>
            <h2 className="max-w-4xl text-4xl font-medium leading-tight tracking-[-.035em] sm:text-5xl">
              Spend less time reconciling tabs. Spend more time choosing well.
            </h2>
            <p className="mt-5 text-background/65">
              No login required. Demo data is clearly marked.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex h-14 shrink-0 items-center gap-3 bg-primary px-6 font-medium text-primary-foreground lg:mt-0"
          >
            Open Pico <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
      <footer className="border-t border-border px-5 py-10 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span className="font-semibold text-foreground">Pico</span>
          <p>
            Public startup, company, hiring, and official contact signals only.
          </p>
          <div className="flex gap-5">
            <Link href="/health" className="text-foreground hover:text-accent">
              Source health
            </Link>
            <Link
              href="/dashboard"
              className="text-foreground hover:text-accent"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
