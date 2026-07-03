# Build Harness

`apps/maxx-web/scripts/harness/` proves the app has no stubs, no broken
routes, and no dead links, and that every required route and API file
exists. Run it with:

```bash
cd apps/maxx-web
npm run harness:all
```

`npm run verify:full` runs lint, typecheck, unit tests, the production
build, and the full harness in one command — this is what CI (or a human
reviewer) should run before merging.

## Checks

| Script | What it checks |
| --- | --- |
| `preflight.mjs` | Node version, required files/directories, `.env.example`, `vercel.json` exist. |
| `no-stubs.mjs` | Scans `app/`, `components/`, `lib/` for `TODO`, `FIXME`, `stub`, placeholder copy, `lorem`, `coming soon`, `fake`, `dummy`, `mock only`, `not implemented`, `under construction`, dead `href="#"`, `javascript:void(0)`, and `console.log`. |
| `route-audit.mjs` | Confirms every route in the product spec's route map has a `page.tsx` file. |
| `link-check.mjs` | Statically resolves every internal `href` in `app/`, `components/`, `lib/` against the real route tree (including dynamic `[param]` segments) and fails on unresolved paths or dead anchors. |
| `api-smoke.mjs` | Confirms every required `/api/*` route file exists, and — if a dev/preview server is already running — makes a live request to `/api/health` to check the response shape. |
| `copy-audit.mjs` | Confirms public marketing pages carry real copy (not just imported components with nothing to say) and scans for generic AI-hype phrasing and literal lorem ipsum filler. |
| `env-audit.mjs` | Confirms `.env.example` documents every integration variable the app reads, and that no value looks like a real committed secret. |
| `artifact-audit.mjs` | Confirms every component in `components/artifacts/` has a matching scored report in `ops/reports/artifacts/`. |
| `build-report.mjs` | Runs all of the above, then writes `ops/reports/harness/build-report.json` and `.md`. |
| `run-all.mjs` | The entry point for `npm run harness:all` — invokes `build-report.mjs`. |

## Allowed exception

`MOCK_INTEGRATIONS=true` is allowed as a local safety mode when external
API credentials are missing (see `apps/maxx-web/lib/data/mode.ts`). It
never fakes a successful send or publish — every mock path returns a
clearly-labeled local-mode message (e.g. "Local mock publish completed"),
and every path that requires real credentials returns a "setup required"
message instead. `no-stubs.mjs` specifically bans the phrase "mock only",
not the word "mock" itself, so this pattern is not flagged.

## Interpreting a failure

Each script prints a line per failing item (a missing route, a broken
link, a banned term with file and line number) before exiting non-zero.
Fix the underlying content or code — do not silence the check by loosening
the pattern unless the match was a genuine false positive on legitimate
prose (e.g. rewording copy that happens to use a banned word in a
non-stub sense, as was done for "No fake publish confirmations" →
"Publish status is always accurate").
