# 18 — Handoff

## What's real vs. what's waiting on credentials

Every feature is fully built and testable today in seed mode. Four things
require external credentials the build environment didn't have, and each
has a real "setup required" state instead of a silent fake:

1. Live social publishing (Meta) — `META_ACCESS_TOKEN`, `META_PAGE_ID`.
2. Live SMS/voice (Twilio) — `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`,
   `TWILIO_PHONE_NUMBER`.
3. Live GHL API import — `GHL_API_KEY`, `GHL_LOCATION_ID` (CSV import
   works today with zero configuration).
4. Persistent database — a Supabase project (schema is ready in
   `supabase/migrations/`; the app runs on an in-memory seed store until
   then).

## Where to start reading

`docs/openspec/00_CONTEXT.md` → `02_FULL_APP_REQUIREMENTS.md` →
`03_ARCHITECTURE.md`, then the numbered spec matching whatever you're
touching. `icm/11_full_app_completion/` has the process history;
`beads/checkpoints/0011`–`0024` has the decision-by-decision log.

## Known scope boundaries (not gaps)

- No live website crawler (`lib/migration/crawler.ts` documents why —
  no arbitrary outbound fetch from a request handler without an explicit
  server-side crawl adapter).
- No payment/Stripe integration was in scope for this build.
- Auth is not wired up; the app runs in a documented seed/demo mode.

## Next owner's first task

Wire Supabase per `docs/openspec/17_RELEASE_PLAN.md` step 1–3, then run
`npm run verify:full` again — everything else should keep passing
unchanged since the API layer already goes through `getStore()`.
