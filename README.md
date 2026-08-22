# Pico
<img width="2400" height="1350" alt="screenshot-studio-1787410189125" src="https://github.com/user-attachments/assets/2c9406ba-9188-4b59-88b9-75a14ef59286" />


## One-Line Pitch

Pico is a self-healing startup opportunity radar that turns public company and hiring signals into a clean, searchable, explainable dashboard for developers.

## Problem

High-quality startup roles are scattered across monthly forum posts, company directories, and job pages. Each source has different fields, inconsistent formatting, and changing page structure. Developers lose time comparing incomplete records and still cannot tell which opportunities have the strongest signals.

## Solution

Pico collects the public Y Combinator company directory through Bright Data Scraper Studio, validates every row, stores useful records in Neon Postgres, and ranks companies with a deterministic signal score. Every score shows its reasons, every external link retains its source, and a broken collection cannot erase the last successful dataset.

## Demo

- Open `/` for the public product story.
- Open `/dashboard` for search, filters, startup details, scoring reasons, and source health.
- No login is required.
- Without service credentials, Pico automatically shows clearly marked demo data.

## Features

- Search across company names, descriptions, roles, and technology signals
- Industry, role, remote, apply-link, and founder-info filters
- Interactive opportunity radar and two-company evidence comparison
- Real scraper flight recorder with recent collection history
- Explainable 100-point opportunity score
- Detailed role, team, public-link, and missing-field drawer
- Real source-run counts and healthy, warning, or failed states
- Partial-record tolerance and previous-data preservation
- Responsive, keyboard-accessible warm light interface
- Structured startup and scraper APIs
- Bounded startup API pagination (`page`, `limit`, maximum 100 records)

## Tech Stack

- Next.js 16 App Router, React 19, and strict TypeScript
- Tailwind CSS 4 with semantic design tokens
- Motion and Lucide icons
- Neon Postgres with Drizzle ORM and generated SQL migrations
- Zod validation for environment values, API contracts, and scraper output
- Vitest and Testing Library
- pnpm only

## Data Source

The submission build intentionally supports one reliable source: **Y Combinator Companies**. Historical experiments with other collectors are excluded from product queries and claims.

Pico only surfaces public startup, company, hiring, application, team, and official contact signals. It does not scrape login-protected, paywalled, hidden, or private personal data. LinkedIn profiles and private email discovery are explicitly out of scope.

## Bright Data Usage

The source has a published Scraper Studio collector, an environment-configured collector ID, a raw Zod schema, and a dedicated normalizer. The application uses Bright Data's Collection API:

1. `POST /dca/trigger` starts the configured collector with a fixed approved public URL.
2. The returned `collection_id` is retained as the snapshot ID.
3. `GET /dca/dataset?id=<snapshot_id>` is polled until JSON records are ready.
4. Transient server failures are retried with bounded exponential backoff.
5. Each returned record is validated independently before any database write.

The API key is imported only by server modules and is never returned to the browser.

### Collector output contracts

Collectors should publish camelCase JSON matching the schemas under `src/lib/normalizers`.

- YC Companies: `name`, `description`, `sourceUrl`, `websiteUrl`, `location`, `batch`, `industry`, `founders`, `roles`, `links`, `technologies`

## Self-Healing Strategy

Pico's resilience is deliberately observable:

- Invalid rows are isolated instead of crashing the entire run.
- Valid rows from a partial run are persisted and the run becomes `warning`.
- Complete upstream failures create a `failed` source-run record.
- Existing successful startup data is never deleted by a failed run.
- Missing optional fields remain visible as missing-field labels.
- Source health exposes record counts and the last completed outcome.
- Collector schema drift is repaired in Scraper Studio, republished, and retried.

Pico does not claim an unimplemented autonomous repair agent. Its “self-healing” behavior is the combination of validation, partial progress, saved-data preservation, visible health, and a documented collector recovery loop.

## Data Ethics

- Public pages only
- No authentication bypass
- No paywall bypass
- No hidden or personal email extraction
- No LinkedIn profile scraping
- No spam or outreach workflow
- Source URLs retained for traceability

## Architecture

```text
Bright Data Scraper Studio
        ↓
Collection API client
        ↓
Source-specific Zod validation
        ↓
Source normalizer
        ↓
Deterministic score + reasons
        ↓
Transactional Drizzle upserts
        ↓
Neon Postgres
        ↓
Server query / API
        ↓
Interactive dashboard
```

Business logic lives outside React components and route handlers. Database queries are isolated under `src/server`; route handlers validate and delegate.

## Local Setup

Requirements:

- Node.js 20.9 or newer
- pnpm 10 or newer

```bash
pnpm install
cp .env.example .env
pnpm dev
```

On Windows PowerShell installations that block the pnpm script shim, use `pnpm.cmd`.

## Environment Variables

| Variable                               | Purpose                                         |
| -------------------------------------- | ----------------------------------------------- |
| `DATABASE_URL`                         | Neon pooled Postgres connection string          |
| `BRIGHTDATA_API_KEY`                   | Server-only Bright Data API key                 |
| `BRIGHTDATA_YC_COMPANIES_COLLECTOR_ID` | Published YC Companies collector                |
| `PICO_OPERATOR_KEY`                    | Secret required to trigger paid scraper runs    |
| `NEXT_PUBLIC_APP_URL`                  | Trusted application origin for metadata         |
| `PICO_DEMO_MODE`                       | Set to `true` to force clearly marked demo data |

Empty Bright Data values are allowed for local demo mode. Operations that require a missing value return a structured configuration error.

## Database Setup

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:studio
```

The codebase-first Drizzle schema is the source of truth. Generated migrations under `src/db/migrations` are committed; schema changes must never be pushed without a migration.

## Running Scrapers

Publish the matching collectors in Bright Data Scraper Studio, copy their IDs into `.env`, migrate the database, then invoke:

```bash
curl -X POST http://localhost:3000/api/scrape/run \
  -H "Content-Type: application/json" \
  -H "x-pico-operator-key: $PICO_OPERATOR_KEY" \
  -d '{"source":"yc-companies"}'
```

The only supported source value is `yc-companies`. The route accepts only its fixed collector and public URL; callers cannot submit arbitrary scraping targets. The operator key, trusted-origin check, bounded request rate, and concurrency guard protect paid collection runs. Multi-instance deployments should also add provider-level distributed rate limiting.

## Commit History / Build Phases

The Git history is intentionally incremental:

1. Next.js and tooling foundation
2. Semantic design system and landing page
3. Neon/Drizzle schema and migration
4. Domain contracts, scoring, and demo data
5. Dashboard, filters, drawer, health, and APIs
6. Bright Data client and source normalizers
7. Transactional scraper persistence
8. Documentation and final quality audit

Every implementation phase is expected to pass lint, type checking, tests, and a production build.

## Known Limitations

- Live operation requires user-owned Neon and Bright Data accounts.
- Collectors must be created and published in Scraper Studio before their IDs can be configured.
- The scraper endpoint performs bounded polling and therefore needs a host that permits the configured route duration.
- In-memory rate and concurrency guards apply per application instance; use provider-level distributed protection when scaling horizontally.
- Product Hunt, YC Jobs, Wellfound, and company websites are not submission sources.

## Future Improvements

- Webhook delivery for long-running collections
- Carefully reviewed cross-source entity resolution
- Additional public sources only after the YC collector remains demonstrably healthy
- Webhook delivery and durable distributed coordination for long-running collections
