# QA Checklist

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run test` (27 unit tests)
- [x] `npm run build`
- [x] `npm run test:e2e` (42 Playwright tests across desktop viewport)
- [x] `npm run harness:all` (preflight, no-stubs, routes, links, api, copy,
      env, artifacts)
- [x] Manual click-through of every public and app route in a real
      browser session (see `docs/qa/FULL_APP_BROWSER_VERIFICATION.md`)
- [x] Contact creation, migration audit submission, workflow template
      selection, social post scheduling, and GHL CSV import each
      exercised end-to-end via Playwright, not just typechecked
- [x] Missed-call opt-out blocking verified via unit test
      (`tests/unit/mctb-engine.test.ts`)
- [ ] Live verification against real Twilio/Meta/GHL/Supabase accounts —
      blocked on credentials not available in this environment; every
      adapter's "setup required" path is verified instead
