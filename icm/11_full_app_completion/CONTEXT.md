# Stage 11 — Full App Completion

## Where this picks up

Stage 1 (see `beads/checkpoints/0001`–`0004`) delivered a scaffold: a
marketing landing page, a `/how-it-works` and `/pricing` page, and a
migration audit intake form. PR #1 merged that scaffold into `develop`.

Stage 11 is the full end-state build requested on top of that scaffold:
every public and app route, the full CRM (contacts, pipeline, forms,
workflows, community, courses, social planner, GHL import, missed-call
text back), the website migration engine, the AI agent runtime,
integration adapters, a Supabase schema draft, copy decks, a design
system, interactive artifacts, and a build harness that proves the result
has no stubs, no broken routes, and no dead links.

## Non-negotiables carried into this stage

- No stubs, placeholders, `coming soon` sections, or dead links anywhere
  in shipped product code.
- External services (Twilio, Meta, GHL API, Supabase) may remain
  unconfigured, but every adapter, validation path, and error state is
  real — "setup required" is a real UI state, not a TODO.
- A harness (`apps/maxx-web/scripts/harness/`) enforces the above and is
  run as part of `npm run verify:full`.
