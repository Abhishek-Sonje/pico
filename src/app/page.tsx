import Link from "next/link";
import { ArrowRight, Check, Radar, ShieldCheck } from "lucide-react";
import { IsometricSignalPipeline } from "@/components/landing/isometric-signal-pipeline";
import { IsometricScraperHealthConsole } from "@/components/landing/isometric-scraper-health-console";
import { IsometricStartupCardStack } from "@/components/landing/isometric-startup-card-stack";

const facts = [
  "Public sources only",
  "Explainable 100-point score",
  "Last good dataset preserved",
];

export default function Home() {
  return (
    <main className="w-full max-w-full overflow-x-hidden">
      <header className="border-b border-border bg-background">
        <nav
          className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 lg:px-10"
          aria-label="Primary navigation"
        >
          <Link
            href="/"
            className="flex items-center gap-3 text-base font-semibold"
          >
            <span className="grid size-9 place-items-center bg-foreground text-primary">
              <Radar className="size-4" />
            </span>
            Pico
          </Link>
          <div className="hidden items-center gap-8 text-sm text-muted md:flex">
            <a href="#workflow" className="hover:text-foreground">
              Workflow
            </a>
            <a href="#resilience" className="hover:text-foreground">
              Source health
            </a>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center gap-2 bg-foreground px-4 text-sm font-medium text-primary"
          >
            Open dashboard <ArrowRight className="size-4" />
          </Link>
        </nav>
      </header>
      <section className="editorial-grid border-b border-border">
        <div className="mx-auto grid min-h-[760px] max-w-[1440px] items-center gap-10 px-5 py-20 lg:grid-cols-[.88fr_1.12fr] lg:px-10 lg:py-24">
          <div className="relative z-10">
            <h1 className="max-w-5xl text-[clamp(3.35rem,6vw,5.75rem)] font-semibold leading-[.94] tracking-[-.04em]">
              Public startup signals, cleaned and scored.
            </h1>
            <p className="mt-8 max-w-[62ch] text-base leading-7 text-muted sm:text-lg">
              Pico gives developers one decision-ready view of startup roles
              scattered across Hacker News and Y Combinator—without hiding the
              source or the reason behind the score.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
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
                See the pipeline
              </a>
            </div>
            <div className="mt-10 grid gap-3 text-xs text-muted sm:grid-cols-3">
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
        className="mx-auto max-w-[1440px] px-5 py-32 lg:px-10 lg:py-48"
      >
        <div className="grid items-end gap-10 border-b border-border pb-14 lg:grid-cols-2">
          <h2 className="max-w-3xl text-4xl font-medium leading-tight tracking-[-.035em] sm:text-5xl">
            Messy inputs become a shortlist you can trust.
          </h2>
          <p className="max-w-[62ch] text-base leading-7 text-muted lg:justify-self-end">
            Each source gets its own validation and normalization contract.
            Valid partial records survive. Bad rows are counted. Every retained
            opportunity keeps a path back to public evidence.
          </p>
        </div>
        <div className="mt-16 grid grid-flow-dense grid-cols-1 gap-px bg-border lg:grid-cols-12">
          <div className="bg-surface p-7 lg:col-span-7">
            <IsometricSignalPipeline />
          </div>
          <div className="flex flex-col justify-between bg-accent p-8 text-accent-foreground lg:col-span-5">
            <div>
              <h3 className="text-3xl font-medium tracking-[-.03em]">
                One pipeline. Four explicit transformations.
              </h3>
              <p className="mt-5 max-w-md leading-7 opacity-75">
                Collect, validate, normalize, then score. The visual order is
                the actual product order—not a marketing abstraction.
              </p>
            </div>
            <ol className="mt-12 divide-y divide-accent-foreground/20 font-mono text-xs">
              {[
                "Approved public pages",
                "Row-level schema validation",
                "Source-specific normalized profile",
                "Deterministic score + reasons",
              ].map((item) => (
                <li key={item} className="flex justify-between py-4">
                  <span>{item}</span>
                  <ArrowRight className="size-3" />
                </li>
              ))}
            </ol>
          </div>
          <div className="bg-card p-7 lg:col-span-5">
            <IsometricStartupCardStack />
          </div>
          <div className="flex flex-col justify-center bg-primary p-8 lg:col-span-7">
            <h3 className="max-w-xl text-4xl font-medium tracking-[-.035em]">
              The output feels like a product, not a spreadsheet cleanup.
            </h3>
            <p className="mt-6 max-w-[62ch] leading-7 text-primary-foreground/75">
              Search by company, role, description, or technology. Filter for
              remote work, application links, and founder information. Open any
              card to see exactly what raised—or limited—its score.
            </p>
            <Link
              href="/dashboard"
              className="mt-10 inline-flex w-fit items-center gap-2 border-b border-foreground pb-1 font-medium"
            >
              Browse the ranked feed <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
      <section id="resilience" className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-32 lg:grid-cols-[.86fr_1.14fr] lg:px-10 lg:py-40">
          <div>
            <ShieldCheck className="size-8 text-accent" />
            <h2 className="mt-8 max-w-xl text-4xl font-medium tracking-[-.035em] sm:text-5xl">
              A broken source does not erase yesterday’s useful data.
            </h2>
            <p className="mt-6 max-w-[62ch] leading-7 text-muted">
              Pico isolates invalid rows, saves valid partial results, records
              collection health, and preserves the last successful dataset.
              Collector repairs remain observable and human-controlled.
            </p>
            <div className="mt-10 grid gap-px bg-border sm:grid-cols-3">
              {[
                ["Healthy", "Valid run"],
                ["Warning", "Partial data"],
                ["Failed", "Prior data kept"],
              ].map(([title, copy]) => (
                <div key={title} className="bg-background p-4">
                  <p className="font-medium">{title}</p>
                  <p className="mt-1 text-xs text-muted">{copy}</p>
                </div>
              ))}
            </div>
          </div>
          <IsometricScraperHealthConsole />
        </div>
      </section>
      <section className="px-5 py-32 lg:px-10 lg:py-48">
        <div className="mx-auto max-w-[1440px] bg-foreground px-6 py-16 text-background sm:px-12 lg:flex lg:items-end lg:justify-between lg:px-16 lg:py-20">
          <div>
            <h2 className="max-w-4xl text-4xl font-medium leading-tight tracking-[-.035em] sm:text-6xl">
              Spend less time reconciling tabs. Spend more time choosing well.
            </h2>
            <p className="mt-6 text-background/65">
              No login required. The demo dataset is clearly marked.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="mt-10 inline-flex h-14 shrink-0 items-center gap-3 bg-primary px-6 font-medium text-primary-foreground lg:mt-0"
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
          <Link href="/dashboard" className="text-foreground hover:text-accent">
            Dashboard
          </Link>
        </div>
      </footer>
    </main>
  );
}
