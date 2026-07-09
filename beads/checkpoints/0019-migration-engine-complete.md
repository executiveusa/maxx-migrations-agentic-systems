```yaml
id: bead-0019
timestamp: 2026-07-03T11:00:00Z
actor: claude-build-agent
phase: stage-2
repo: executiveusa/maxx-migrations-agentic-systems
branch: claude/maxx-migrations-full-build-5jh55a
files_changed:
  - apps/maxx-web/components/migrations/*.tsx
  - apps/maxx-web/lib/migration/*.ts
  - apps/maxx-web/app/api/migrations/**/*.ts
decision: >
  Built migration job creation, page/asset inventory, agent task timeline,
  design audit scoring, before/after preview, and a publish checklist.
  lib/migration/crawler.ts returns a deterministic seed crawl plan unless
  MIGRATION_CRAWLER_ENABLED is set, at which point callers should route
  through a server-side crawl adapter rather than fetching arbitrary URLs
  inline from a request handler — documented explicitly so this is never
  mistaken for a live crawler that silently isn't running.
reason: Matches spec 8.11.
rollback_command: git checkout -- apps/maxx-web/components/migrations apps/maxx-web/lib/migration
risks:
  - Live crawling is intentionally not implemented (no arbitrary outbound
    HTTP fetch from a request handler); this is a documented scope
    boundary, not an oversight.
next_action: Build AI agent runtime routes (bead-0020).
human_needed: false
```
