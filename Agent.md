# Pico Technical Specification

## 1. Project Name

**Pico**

## 2. Product Summary

Pico is a self-healing startup opportunity radar.

It scrapes public startup and hiring signals from approved public sources, normalizes the data, stores it in Neon Postgres using Drizzle ORM, scores each startup, and presents the result in a polished dashboard for developers looking for high-quality startup opportunities.

The product must feel like a finished professional tool, not a hackathon table.

## 3. Core Product Promise

> Pico helps developers discover startups worth applying to by turning messy public startup and hiring data into a clean, searchable, scored opportunity dashboard.

## 4. Non-Negotiable Rules

Follow these strictly.

### 4.1 No Fake UI

Every visible button must work.

If a button, tab, dropdown, filter, link, or card action is not implemented, remove it.

Do not show:

- fake login buttons
- disabled dashboard actions
- dead navigation links
- fake pricing
- fake export buttons
- fake “invite team” features
- fake “connect LinkedIn”
- fake notifications
- fake settings page

The judges should be able to click everything visible without hitting unfinished features.

### 4.2 No Login

Do not add authentication.

Reason:

- Judges must access the project easily.
- The demo should open directly.
- No login screens, no Clerk, no NextAuth, no Better Auth.

Allowed:

- Public landing page
- Public dashboard
- Public demo data
- Public scraper status page

### 4.3 Public Data Only

Only scrape public pages.

Allowed:

- public company names
- public startup descriptions
- public founder names
- public team names
- public company websites
- public company socials
- public hiring roles
- public application links
- public official contact emails such as `jobs@`, `careers@`, `hello@`, `contact@`

Avoid:

- login-protected data
- paywalled data
- LinkedIn profile scraping
- hidden emails
- private personal data
- aggressive personal email extraction
- anything that looks like spam tooling

Product wording should say:

> Pico only surfaces public startup, company, hiring, and contact signals. It does not scrape login-protected, paywalled, hidden, or private personal data.

### 4.4 Use Latest Docs Before Implementing Integrations

Before implementing Bright Data, Drizzle, Neon, or Next.js-specific functionality, check the latest official docs.

Do not guess Bright Data CLI/API syntax.

For Bright Data, verify:

- CLI install/auth flow
- scraper create flow
- scraper run flow
- collector ID format
- API trigger flow
- output format
- self-healing workflow
- error behavior

Bright Data CLI supports the `brightdata` command with `bdata` as shorthand, and official docs describe CLI auth, scraper commands, and API key usage. Scraper Studio collections can be triggered through API/manual/scheduled flows and delivered in formats such as JSON, NDJSON, CSV, XLSX, and Parquet.

## 5. Tech Stack

Use this stack unless there is a clear blocker.

### 5.1 Framework

- Next.js latest stable
- App Router
- TypeScript
- Server Components by default
- Client Components only when interactivity is required

Next.js currently recommends `create-next-app`, which sets up TypeScript, ESLint, Tailwind, App Router, Turbopack, and import alias `@/*` by default.

### 5.2 Styling

- Tailwind CSS
- CSS variables for design tokens
- Framer Motion or Motion for microanimations
- `lucide-react` for icons
- optional: `clsx` and `tailwind-merge`
- optional: `class-variance-authority` for reusable component variants

### 5.3 Validation

- Zod for all external data validation
- Zod for environment variable validation
- Zod for scraper output parsing
- Zod for API request/response contracts

### 5.4 Database

- Neon Postgres
- Drizzle ORM
- Drizzle Kit for migrations
- No Prisma

Use database persistence for:

- startups
- people
- roles
- source runs
- scraper health
- extracted links
- score reasons

### 5.5 Scraping

- Bright Data Scraper Studio
- Bright Data CLI/API
- Collector IDs stored in environment variables
- Scraper output validated before database writes

### 5.6 Package Manager

Use **pnpm**.

Do not mix npm, yarn, and pnpm lockfiles.

### 5.7 Suggested Libraries

Install only what is needed.

Recommended:

```bash
pnpm add drizzle-orm @neondatabase/serverless zod lucide-react framer-motion clsx tailwind-merge date-fns
pnpm add -D drizzle-kit eslint prettier
```

Optional only if needed:

```bash
pnpm add sonner
```

Do not add unnecessary UI kits if custom UI can be built cleanly.

## 6. Product Pages

### 6.1 Landing Page

Route:

```text
/
```

Purpose:

Introduce Pico and guide judges to the product.

Required sections:

1. Hero
2. Product value
3. How it works
4. Data sources
5. Bright Data/self-healing explanation
6. CTA to dashboard

Visual direction:

- premium dark interface
- isometric components
- startup cards floating in the hero
- subtle grid background
- clean gradients
- smooth microanimations
- no clutter

Required working buttons:

- `View Dashboard` → `/dashboard`
- `See How It Works` → scrolls to how-it-works section
- source cards may link to real public sources if shown

Do not add:

- login
- pricing
- contact sales
- fake waitlist
- fake GitHub button unless the real repo link is configured

### 6.2 Dashboard Page

Route:

```text
/dashboard
```

Purpose:

Main product experience.

Required UI:

- search bar
- role filter
- source filter
- remote filter
- “has apply link” filter
- “has founder info” filter
- startup cards
- startup detail drawer
- scraper health summary
- empty state
- loading state
- error state

Required working interactions:

- search filters visible cards
- role filter changes ranking or filtering
- source filter works
- startup card opens detail drawer
- drawer close button works
- external links open real URLs
- refresh data button works only if implemented; otherwise remove it

### 6.3 Source Health Page or Panel

Preferred as dashboard panel, not separate page.

Show:

- source name
- last run time
- total records
- valid records
- records with missing required fields
- health status: `healthy`, `warning`, `failed`
- collector ID if available
- source URL

Do not show fake health states. If using demo data, mark it as demo data.

## 7. Data Sources

### 7.1 MVP Sources

Build in this order:

1. YC Companies
2. YC Jobs
3. Product Hunt

### 7.2 Optional Sources

Only add after MVP is stable:

1. Wellfound
2. Company official websites

### 7.3 Source Strategy

Each source must have:

- collector config
- parser output schema
- normalizer
- validation
- source health tracking
- graceful failure handling

Do not scrape too many sources badly. Two solid sources are better than six broken sources.

## 8. Data Model

Use normalized database tables.

### 8.1 Tables

Required tables:

- `startups`
- `people`
- `startup_people`
- `roles`
- `startup_links`
- `source_runs`
- `score_reasons`

Optional:

- `raw_scrape_records`

### 8.2 Startup Entity

```ts
type Startup = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  industry: string | null;
  location: string | null;
  batch: string | null;
  source: DataSource;
  sourceUrl: string;
  websiteUrl: string | null;
  signalScore: number;
  createdAt: Date;
  updatedAt: Date;
};
```

### 8.3 Person Entity

```ts
type Person = {
  id: string;
  name: string;
  role: string | null;
  sourceUrl: string;
  createdAt: Date;
};
```

### 8.4 Role Entity

```ts
type Role = {
  id: string;
  startupId: string;
  title: string;
  location: string | null;
  remote: boolean | null;
  salary: string | null;
  applyUrl: string | null;
  sourceUrl: string;
  createdAt: Date;
};
```

### 8.5 Link Entity

```ts
type StartupLink = {
  id: string;
  startupId: string;
  type:
    | "website"
    | "careers"
    | "apply"
    | "twitter"
    | "linkedin"
    | "github"
    | "email"
    | "source";
  url: string;
  label: string | null;
};
```

### 8.6 Source Run Entity

```ts
type SourceRun = {
  id: string;
  source: DataSource;
  collectorId: string | null;
  status: "healthy" | "warning" | "failed";
  recordsFound: number;
  recordsValid: number;
  recordsInvalid: number;
  errorMessage: string | null;
  startedAt: Date;
  finishedAt: Date | null;
};
```

## 9. Zod Schemas

Every external scraper output must pass Zod validation before entering the app.

Create schemas in:

```text
src/lib/validators/
```

Required schemas:

```text
env.schema.ts
scraper.schema.ts
startup.schema.ts
filters.schema.ts
```

Example:

```ts
import { z } from "zod";

export const scrapedStartupSchema = z.object({
  name: z.string().min(1),
  sourceUrl: z.string().url(),
  description: z.string().optional().nullable(),
  websiteUrl: z.string().url().optional().nullable(),
  location: z.string().optional().nullable(),
  roles: z.array(z.string()).default([]),
  founders: z.array(z.string()).default([]),
});
```

Validation rule:

- Invalid records should not crash the app.
- Invalid records should be counted in source health.
- Valid partial records should still render with missing-field labels.

## 10. Folder Structure

Use this structure.

```text
src/
  app/
    page.tsx
    layout.tsx
    globals.css
    dashboard/
      page.tsx
    api/
      scrape/
        run/
          route.ts
      startups/
        route.ts

  components/
    landing/
      hero-section.tsx
      how-it-works.tsx
      source-showcase.tsx
      isometric-card-stack.tsx
      landing-cta.tsx

    dashboard/
      dashboard-shell.tsx
      startup-card.tsx
      startup-detail-drawer.tsx
      startup-filters.tsx
      startup-search.tsx
      source-health-panel.tsx
      signal-score.tsx
      empty-state.tsx
      error-state.tsx
      loading-state.tsx

    ui/
      button.tsx
      badge.tsx
      card.tsx
      input.tsx
      select.tsx
      sheet.tsx
      skeleton.tsx

  db/
    index.ts
    schema.ts
    migrations/

  lib/
    bright-data/
      client.ts
      collectors.ts
      types.ts

    normalizers/
      product-hunt.ts
      yc-companies.ts
      yc-jobs.ts

    scoring/
      signal-score.ts

    validators/
      env.schema.ts
      scraper.schema.ts
      startup.schema.ts
      filters.schema.ts

    utils/
      cn.ts
      dates.ts
      links.ts
      text.ts

  server/
    queries/
      startups.ts
      source-runs.ts

    actions/
      run-scrape.ts

  data/
    demo-startups.ts
```

Rules:

- Do not put business logic directly inside React components.
- Do not put database queries inside UI components.
- Do not put scraper normalization inside route handlers.
- Keep route handlers thin.
- Keep components small and readable.
- Prefer named exports.
- Avoid giant files.

## 11. Architecture

```text
Bright Data Scraper Studio
        ↓
Bright Data CLI/API client
        ↓
Raw scraper output
        ↓
Zod validation
        ↓
Source-specific normalizer
        ↓
Unified startup model
        ↓
Drizzle insert/update
        ↓
Dashboard query
        ↓
UI filters + detail drawer
```

## 12. Bright Data Integration

### 12.1 Required Files

```text
src/lib/bright-data/client.ts
src/lib/bright-data/collectors.ts
src/lib/bright-data/types.ts
```

### 12.2 Environment Variables

```env
DATABASE_URL=
BRIGHTDATA_API_KEY=
BRIGHTDATA_PRODUCT_HUNT_COLLECTOR_ID=
BRIGHTDATA_YC_COMPANIES_COLLECTOR_ID=
BRIGHTDATA_YC_JOBS_COLLECTOR_ID=
NEXT_PUBLIC_APP_URL=
```

Validate all env vars using Zod.

Do not access `process.env` randomly across the codebase. Use one validated env module.

### 12.3 Bright Data Rules

Before implementing, check the latest Bright Data docs.

Use the official CLI/API patterns.

Do not hardcode API keys.

Do not commit `.env`.

Do not expose `BRIGHTDATA_API_KEY` to the client.

Only call Bright Data from server-side code.

### 12.4 Scraper Run Behavior

When scraper run succeeds:

- validate output
- normalize records
- upsert startups
- create source run entry
- update source health

When scraper run partially fails:

- save valid records
- count invalid records
- mark source as `warning`
- store error summary

When scraper run fails:

- mark source as `failed`
- keep previous successful data visible
- show graceful error in dashboard

## 13. Database Rules

Use Drizzle for all database access.

Required scripts:

```json
{
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:studio": "drizzle-kit studio"
}
```

Rules:

- Use migrations.
- Do not push random schema changes without migration.
- Use indexes for searchable fields.
- Use unique constraints where needed.
- Use timestamps.
- Use slugs for startup URLs.
- Use upsert logic to avoid duplicates.

Suggested unique constraints:

- startup name + source
- role title + startup ID + source URL
- person name + source URL

## 14. Signal Score

Signal score must be simple, explainable, and deterministic.

Do not use random scoring.

Recommended formula:

```text
Hiring role exists: +25
Apply/careers link exists: +15
Founder/team info exists: +10
Remote/location info exists: +10
Tech stack detected: +15
Fresh source/post: +10
Company website exists: +10
Salary listed: +5
```

Maximum score: 100.

Each score must generate reasons.

Example:

```text
+ Hiring roles found
+ Clear apply link available
+ Founder information available
- Salary not listed
```

UI must show score reasons, not just a number.

## 15. Filtering

Required filters:

- search by startup name, role, description, tech stack
- source
- role type
- remote only
- has apply link
- has founder info

Optional filters:

- salary listed
- location
- YC batch
- industry

Filter behavior:

- Filters must update visible cards.
- Empty result state must be polished.
- Reset filters button must work if shown.

## 16. UI Quality Bar

This project is competing for UI quality. Treat UI as a core feature.

### 16.1 Visual Style

Use:

- dark premium theme
- soft gradients
- glass-like cards only where useful
- strong spacing
- subtle shadows
- clean typography
- consistent badges
- smooth transitions
- isometric hero components

Avoid:

- default shadcn-looking page without customization
- overcrowded tables
- too many colors
- random gradients
- noisy animations
- tiny unreadable text

### 16.2 Motion Rules

Use microanimations, not heavy animations.

Good:

- card hover lift
- drawer slide
- filter transition
- score badge pulse on refresh
- skeleton shimmer
- hero floating cards

Bad:

- constant bouncing
- slow animations
- excessive parallax
- animation that blocks usage

### 16.3 Accessibility

Required:

- semantic buttons
- visible focus states
- readable contrast
- `aria-label` for icon buttons
- keyboard-close drawer with Escape if possible
- no click-only hidden controls

## 17. Component Rules

### 17.1 Button

All buttons must use shared `Button` component.

Variants:

- primary
- secondary
- ghost
- outline

Do not create custom button styles everywhere.

### 17.2 Badge

Use badges for:

- source
- role
- remote
- score
- scraper health

### 17.3 Startup Card

Must show:

- startup name
- source badge
- short description
- score
- top roles
- location/remote
- apply/careers availability
- click to open detail drawer

Do not overload the card.

### 17.4 Detail Drawer

Must show:

- full company summary
- roles
- founders/team
- public links
- score reasons
- source health/missing fields
- source URLs

Only show sections with data. If a section has no data, show a clean “Not publicly available” label.

## 18. API Routes

Keep API routes minimal.

### 18.1 `GET /api/startups`

Returns startups with filters.

Query params:

```text
q
source
role
remote
hasApplyLink
hasFounderInfo
```

### 18.2 `POST /api/scrape/run`

Runs scraper for selected source.

Body:

```ts
{
  source: "product-hunt" | "yc-companies" | "yc-jobs";
}
```

Rules:

- server-side only
- validate request body with Zod
- do not expose Bright Data secrets
- return structured success/error response
- do not crash on Bright Data failure

## 19. Error Handling

Every async flow must handle failure.

Required error states:

- scraper failed
- no data available
- database error
- invalid scraper output
- external link missing
- no filter results

Do not show raw stack traces to users.

Log useful errors server-side.

UI errors should be human-readable.

Example:

```text
Could not refresh Product Hunt data. Showing the latest saved results instead.
```

## 20. Demo Data

Keep demo fallback data.

File:

```text
src/data/demo-startups.ts
```

Use demo data only when:

- database is empty
- scraper is not configured
- local demo mode is enabled

Clearly mark demo data if shown.

Do not fake live scraper success.

## 21. README Requirements

README must be professional and judge-friendly.

Required sections:

```md
# Pico

## One-Line Pitch

## Problem

## Solution

## Demo

## Features

## Tech Stack

## Data Sources

## Bright Data Usage

## Self-Healing Strategy

## Data Ethics

## Architecture

## Local Setup

## Environment Variables

## Database Setup

## Running Scrapers

## Commit History / Build Phases

## Known Limitations

## Future Improvements
```

README must explain:

- what was scraped
- why Bright Data is used
- how collector IDs are configured
- how scraper health works
- how invalid/missing fields are handled
- that no login is needed
- that only public data is used

## 22. Commit Plan

Do not create one giant commit.

Use small, meaningful commits.

Recommended commit sequence:

```text
chore: initialize next app with typescript and tooling
chore: configure eslint prettier and project aliases
feat: add landing page layout and design tokens
feat: build reusable ui primitives
feat: add dashboard shell and navigation
feat: add database schema with drizzle and neon
feat: add environment validation
feat: add startup data model and demo dataset
feat: add startup cards and detail drawer
feat: add search and filters
feat: add signal scoring logic
feat: add source health panel
feat: add bright data client wrapper
feat: add hacker news scraper normalizer
feat: add yc scraper normalizer
feat: add scraper run api route
feat: persist scraper results to database
feat: add loading empty and error states
docs: add professional readme and architecture notes
refactor: clean dashboard component boundaries
chore: final polish for demo submission
```

Commit rules:

- Each commit should build.
- Each commit should have one purpose.
- Do not mix UI, DB, scraper, and docs in one commit.
- Do not commit broken code.
- Do not commit `.env`.
- Do not commit generated junk.

## 23. Code Style

### 23.1 General

Use:

- TypeScript everywhere
- strict types
- Zod for unknown data
- named exports
- clear file names
- small functions
- readable component names

Avoid:

- `any`
- giant files
- nested ternaries
- magic strings everywhere
- business logic in JSX
- repeated Tailwind class chaos
- unnecessary comments

### 23.2 Comments

Comments should be rare and useful.

Good comment:

```ts
// Keep partial records so one bad source row does not hide the whole run.
```

Bad comment:

```ts
// This function calculates the score for the startup using various parameters.
```

Comments should sound human, not AI-generated.

Use comments only when:

- business rule is not obvious
- scraper behavior is fragile
- a fallback exists for a reason
- data shape is messy

### 23.3 Naming

Use clear names:

Good:

```ts
calculateSignalScore;
normalizeProductHuntPost;
getSourceHealthSummary;
upsertStartupWithRoles;
```

Bad:

```ts
handleData;
processStuff;
doThing;
finalData;
```

## 24. Testing and Quality Checks

Minimum before every push:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Add scripts:

```json
{
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "build": "next build",
  "format": "prettier --write ."
}
```

If using Next.js latest where lint command behavior changed, follow the official current Next.js docs and configure ESLint properly.

Do not submit if:

- TypeScript has errors
- build fails
- dashboard has broken buttons
- scraper failure crashes page
- README is incomplete

## 25. Environment Example

Create:

```text
.env.example
```

Content:

```env
DATABASE_URL="postgresql://..."
BRIGHTDATA_API_KEY=""
BRIGHTDATA_PRODUCT_HUNT_COLLECTOR_ID=""
BRIGHTDATA_YC_COMPANIES_COLLECTOR_ID=""
BRIGHTDATA_YC_JOBS_COLLECTOR_ID=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Do not put real secrets in this file.

## 26. Development Order

Follow this exact order.

### Phase 1: Foundation

- create Next.js project
- configure TypeScript
- configure Tailwind
- configure lint/format scripts
- set up folder structure
- add env validation

### Phase 2: UI Foundation

- create design tokens
- build landing page
- build dashboard shell
- build reusable UI components

### Phase 3: Data Model

- set up Neon
- set up Drizzle
- define schema
- generate migration
- add seed/demo data

### Phase 4: Dashboard MVP

- startup cards
- detail drawer
- search
- filters
- signal score
- source health panel

### Phase 5: Bright Data

- read latest Bright Data docs
- create collector manually or through supported CLI/API
- store collector IDs in env
- add server-side Bright Data client
- add scraper run route
- validate output
- normalize output
- persist results

### Phase 6: Polish

- loading states
- empty states
- error states
- mobile responsiveness
- microanimations
- README
- demo video prep

## 27. Definition of Done

The project is done when:

- landing page looks premium
- dashboard works without login
- search works
- filters work
- cards open detail drawer
- every button works
- no fake UI remains
- database schema exists
- Drizzle migrations work
- Bright Data integration is documented
- at least one real scraper source works
- app handles scraper failure gracefully
- README is complete
- build passes
- demo can be recorded smoothly

## 28. Things Not to Build

Do not build these for MVP:

- login
- user accounts
- saved profiles
- team workspace
- payments
- admin panel
- email outreach tool
- LinkedIn scraper
- private email finder
- browser extension
- complex AI agent
- multi-tenant system
- analytics dashboard
- notification system
- fake export system

## 29. Final Build Goal

Build a small but excellent product.

The judges should feel:

> This is polished, useful, technically clean, and clearly built around Bright Data’s scraping workflow.

Pico should look like a real startup intelligence product, not a weekend script.

# Pico Styling and Design Token Rules

## Project Name

The product name is **Pico**.

Use **Pico** consistently across:

- landing page
- dashboard
- metadata
- README
- browser title
- Open Graph metadata
- empty states
- error states
- demo copy

Do not use old names like SignalScout, Startup Signal Radar, or StartupScout unless they are removed everywhere.

## Global Styling Rule

Maintain a clean and professional `src/app/globals.css`.

Do not hardcode random colors directly in components.

Avoid this:

```tsx
<div className="bg-[#101014] text-[#f7f7f8] border-[#2a2a31]">
```

Prefer this:

```tsx
<div className="bg-surface text-foreground border-border">
```

Or use CSS variables through Tailwind theme tokens.

## Design Token Requirement

All major colors must be defined as named tokens.

Required token groups:

```css
:root {
  --background: ;
  --foreground: ;

  --surface: ;
  --surface-muted: ;
  --surface-elevated: ;

  --border: ;
  --border-muted: ;

  --primary: ;
  --primary-foreground: ;
  --primary-muted: ;

  --accent: ;
  --accent-foreground: ;

  --success: ;
  --warning: ;
  --danger: ;

  --muted: ;
  --muted-foreground: ;

  --card: ;
  --card-foreground: ;

  --input: ;
  --ring: ;
}
```

Use these tokens throughout the app.

## Tailwind Naming Rule

Tailwind classes should use semantic names.

Good:

```tsx
className = "bg-background text-foreground";
className = "bg-card border-border";
className = "text-muted-foreground";
className = "bg-primary text-primary-foreground";
```

Bad:

```tsx
className = "bg-black text-white";
className = "text-gray-400";
className = "border-zinc-800";
className = "bg-[#0B0D13]";
```

Small exceptions are allowed only for very specific decorative gradients or one-off visual effects, but core UI should use named tokens.

## Typography Rule

Do not randomly use text sizes everywhere.

Create a consistent scale.

Preferred usage:

```tsx
<h1 className="text-display font-semibold tracking-tight">
<p className="text-body text-muted-foreground">
<span className="text-caption">
```

If custom text utilities are not configured, use consistent Tailwind sizes:

- hero title: `text-5xl` to `text-7xl`
- section heading: `text-3xl` to `text-4xl`
- card title: `text-lg` to `text-xl`
- body: `text-sm` to `text-base`
- metadata/caption: `text-xs`

Do not mix many random sizes without reason.

## `globals.css` Structure

Keep `globals.css` organized like this:

```css
@import "tailwindcss";

:root {
  /* Core */
  --background: ;
  --foreground: ;

  /* Surfaces */
  --surface: ;
  --surface-muted: ;
  --surface-elevated: ;

  /* Borders */
  --border: ;
  --border-muted: ;

  /* Brand */
  --primary: ;
  --primary-foreground: ;
  --primary-muted: ;

  /* Semantic */
  --success: ;
  --warning: ;
  --danger: ;

  /* Text */
  --muted: ;
  --muted-foreground: ;

  /* Components */
  --card: ;
  --card-foreground: ;
  --input: ;
  --ring: ;

  /* Radius */
  --radius-sm: ;
  --radius-md: ;
  --radius-lg: ;
  --radius-xl: ;

  /* Shadows */
  --shadow-soft: ;
  --shadow-card: ;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);

  --color-surface: var(--surface);
  --color-surface-muted: var(--surface-muted);
  --color-surface-elevated: var(--surface-elevated);

  --color-border: var(--border);
  --color-border-muted: var(--border-muted);

  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary-muted: var(--primary-muted);

  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-danger: var(--danger);

  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);

  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);

  --color-input: var(--input);
  --color-ring: var(--ring);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

## Component Styling Rule

Components should not define their own color systems.

Shared UI components must consume global tokens.

Example:

```tsx
export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow-card",
        className,
      )}
      {...props}
    />
  );
}
```

## Landing Page Styling Rule

The landing page can use beautiful gradients and isometric visuals, but the base styling should still use global tokens.

Allowed:

```tsx
<div className="bg-[radial-gradient(circle_at_top,var(--primary-muted),transparent_40%)]">
```

Avoid:

```tsx
<div className="bg-[radial-gradient(circle_at_top,#6D5DFB,transparent_40%)]">
```

## Dashboard Styling Rule

Dashboard components must be especially consistent.

Use tokens for:

- cards
- borders
- badges
- filters
- drawer
- search bar
- score indicators
- source health indicators

Do not create different card styles randomly across the page.

## Final Styling Standard

The Pico UI should feel like one carefully designed product.

Every page should share:

- same color system
- same spacing rhythm
- same border style
- same card radius
- same typography scale
- same animation style
- same button behavior

No random hardcoded design decisions should appear inside individual components.
