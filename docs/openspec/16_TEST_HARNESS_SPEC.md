# 16 — Test & Harness Spec

See `docs/harness/BUILD_HARNESS.md` for the harness itself. This document
covers the test suite.

## Unit tests (Vitest, 27 tests / 6 files)

`tests/unit/contact-validation.test.ts`,
`migration-audit-validation.test.ts`, `ghl-import.test.ts` (csv-parser,
mapper, validator, import-runner), `mctb-engine.test.ts` (including the
required "blocks opted-out number" case), `social-provider.test.ts`
(mock publish + schema), `agent-runtime.test.ts` (model router, tool
policy, budget enforcement).

## E2E tests (Playwright, 42 tests / 5 files)

`public-routes.spec.ts` (all 14 public routes render with no console
errors, nav links resolve), `app-routes.spec.ts` (all 22 app routes
render, sidebar nav works), `forms-and-crm.spec.ts` (migration audit
validation + success, contact creation validation + success),
`workflows-social-import.spec.ts` (template selection, social scheduling
in local mode, full GHL CSV import wizard flow), `missed-calls-and-api.spec.ts`
(opt-out list + compliance notice, `/api/health`, no internal link on the
homepage 404s).

## A real bug this suite caught

`components/ui/Input.tsx`'s `Input`/`Textarea`/`Select` were plain
function components (no `React.forwardRef`), so `react-hook-form`'s
`register()` ref never attached to the real DOM node. Every field on top
of these shared components validated as "undefined" regardless of what a
user typed — invisible in a quick manual click-through, but caught
immediately by the e2e contact-creation test. Fixed by wrapping all three
in `forwardRef`. This is the harness doing its job, not a footnote.

## Running everything

```bash
cd apps/maxx-web
npm run verify:full   # lint, typecheck, test, build, harness:all
npm run test:e2e      # Playwright, separate because it needs a built server
```
