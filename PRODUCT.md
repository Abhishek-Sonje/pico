# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers evaluating startup opportunities from fragmented public company and hiring sources. They use Pico to search, compare, and understand which startups are worth applying to without manually reconciling inconsistent records.

## Product Purpose

Pico turns public startup and hiring signals into a clean, searchable, explainable opportunity dashboard. Success means a developer can quickly find credible opportunities, understand why each one scores well, and follow the retained public source or application link.

## Positioning

Pico combines approved Bright Data collectors, row-level validation, source-specific normalization, durable last-known-good data, visible source health, and deterministic scoring with human-readable reasons. Its self-healing claim refers to partial-progress preservation, validation, health visibility, and a documented collector recovery loop—not an autonomous repair agent.

## Operating Context

Users evaluate records gathered from Hacker News Who is Hiring, Y Combinator Companies, and Y Combinator Jobs. They search and filter opportunities, inspect role and founder details, review score reasons, and monitor source health. Operators configure and publish the fixed Bright Data collectors and can trigger approved source runs.

## Capabilities and Constraints

- Search across company names, descriptions, roles, and technology signals.
- Filter by source, role, remote status, application-link availability, and founder information.
- Explain a deterministic 100-point opportunity score.
- Expose record-level details, missing fields, source provenance, and source-run health.
- Preserve successful startup data when a later source run fails.
- Use public pages only; no authentication or paywall bypass, LinkedIn scraping, private email discovery, spam, or outreach workflow.
- Product Hunt and Wellfound are not MVP data sources.
- Demo data is clearly marked when service credentials are unavailable.

## Brand Commitments

The product name is Pico. The interface voice is concise, technical, transparent, and product-focused. The replacement visual system is governed by `paid-DESIGN.md`: warm off-white surfaces, forest green, electric lime, Geist Sans and Geist Mono, structured geometry, restrained depth, and a tight spacing rhythm.

## Evidence on Hand

- Product behavior and constraints: `README.md`.
- Replacement visual direction and tokens: `paid-DESIGN.md`.
- Required explanatory isometric components: `component.md`.
- Synthetic opportunity and source-health records: `src/data/demo-startups.ts`.
- No testimonials, customer logos, commercial benchmarks, or pricing claims are supplied and none should be fabricated.

## Product Principles

- Make provenance and score reasoning visible.
- Preserve useful data through partial or failed collection runs.
- Turn messy source records into decision-ready opportunities.
- Keep operational health observable and claims technically honest.
- Let users reach primary search, filtering, and application actions quickly.

## Accessibility & Inclusion

The web interface must remain responsive and keyboard accessible, provide visible focus states, meet WCAG AA contrast, and reduce nonessential motion when the user requests reduced motion.
