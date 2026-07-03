```yaml
id: bead-0011
timestamp: 2026-07-03T06:00:00Z
actor: claude-build-agent
phase: stage-2
repo: executiveusa/maxx-migrations-agentic-systems
branch: claude/maxx-migrations-full-build-5jh55a
files_changed: []
decision: >
  Scoped the full end-state build requested on top of the stage-1 scaffold
  (marketing site + migration audit form only). Planned 23 work units
  covering: design system primitives, shared types/schemas/mock data,
  integration adapters (social, telephony, GHL, migration, agents), every
  public and app route in the spec's route map, all required API routes,
  13 interactive artifacts, a Supabase schema + RLS draft, copy decks, a
  no-stub/no-404 build harness, unit + e2e tests, Vercel config, and this
  documentation set.
reason: >
  The instruction was explicit: build the entire end-state app in one pass,
  not a phase, with a harness that proves no stubs/placeholders/broken
  routes/404s remain.
rollback_command: N/A (planning only)
risks:
  - Scope is large enough that some depth tradeoffs are necessary (e.g. an
    in-memory data store instead of a live Supabase project) — documented
    explicitly rather than hidden.
next_action: Build design system + shared UI primitives (bead-0012 onward).
human_needed: false
```
