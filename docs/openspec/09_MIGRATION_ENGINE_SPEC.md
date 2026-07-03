# 09 — Migration Engine Spec

## Pipeline stages

`intake → crawling → extracting → designing → review → ready_to_publish →
published` (`MigrationJobStatus` in `lib/types/migrations.ts`;
`nextStatus()` in `lib/migration/migration-runner.ts` advances one stage
at a time).

## Modules

- `crawler.ts` — `buildSeedCrawlPlan()` returns a deterministic 5-page
  plan (/, /about, /donate, /volunteer, /contact) for local/demo use.
  `isLiveCrawlEnabled()` gates a future server-side live crawl adapter
  behind `MIGRATION_CRAWLER_ENABLED`; this build intentionally does not
  fetch arbitrary third-party URLs from a request handler.
- `extractor.ts` — `rewriteCopy()` / `countWords()`, the deterministic
  local stand-in for the Copy Agent's real rewrite pass.
- `asset-inventory.ts` — classifies and summarizes page assets by type and
  size.
- `component-mapper.ts` — maps legacy UI patterns (hero banner, feature
  grid, donation button, footer, testimonial carousel) to the design
  system's real components.
- `design-auditor.ts` — `runDesignAudit()` scores a job 0–100 against 5
  checks (contrast, nav clarity, CTA specificity, no unfinished/generic
  filler copy, responsive behavior) based on page approval ratio.
- `report-generator.ts` — `generateMigrationReport()` combines asset
  summary + design audit into one report consumed by `/app/migrations/[jobId]`.
- `migration-runner.ts` — `createMigrationJob()` builds a new job from a
  submitted URL.

## UI

`/app/migrations/[jobId]` renders pages, assets, agent task timeline,
design audit, and a publish checklist, plus the `BeforeAfterSitePreview`
artifact toggling between the legacy and rebuilt site framing.
