# Harness Policy

`npm run harness:all` (from `apps/maxx-web`) must pass before this stage
is considered complete, and before any future PR touching `apps/maxx-web`
is merged. It runs, in order: preflight, no-stubs, route-audit,
link-check, api-smoke, copy-audit, env-audit, and artifact-audit, then
writes `ops/reports/harness/build-report.{json,md}`.

`npm run verify:full` additionally runs lint, typecheck, the unit test
suite, and a production build before the harness — this is the single
command a reviewer or CI job should run.

See `docs/harness/BUILD_HARNESS.md` for what each check does and how to
read a failure.
