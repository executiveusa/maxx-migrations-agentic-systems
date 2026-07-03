# Full App Browser Verification

Automated cross-viewport verification: `npm run harness:browser` (from
`apps/maxx-web`, against a running build on port 3100) drives a real
Chromium browser to every public and app route at three viewports —
mobile (375×812), tablet (768×1024), and desktop (1440×900) — and checks:

- HTTP status < 400 (no 404s)
- No page errors or unexpected console errors
- No horizontal overflow (`scrollWidth` never exceeds `clientWidth`)

Result: **81/81 checks passed** (27 routes × 3 viewports) on
2026-07-03. Full machine-readable result:
`ops/reports/harness/browser-verification.json`.

## What this caught and fixed

The first run found 13 failures — real horizontal-overflow bugs, not
false positives:

1. **CSS Grid blowout**: every responsive grid in the app (`grid
   sm:grid-cols-2 lg:grid-cols-3`, etc.) omitted an explicit base
   `grid-cols-1`, so below its smallest breakpoint the browser fell back
   to auto-sized tracks with no `minmax(0, 1fr)` floor — a single
   unbreakable string (a source URL, a long org name) could force the
   whole grid, and everything around it, wider than the viewport. Fixed
   globally in `app/globals.css` (`.grid > * { min-width: 0; }`) rather
   than patching 37 individual grid usages one at a time.
2. **Flexbox min-width:auto** in `AppShell`'s content column let deeply
   nested table content push the entire `/app/*` layout wider than the
   viewport on narrow screens. Fixed with `min-w-0` on the flex content
   column and `<main>`.
3. **Non-wrapping tab bars** (`Tabs.tsx`) with several longer labels (e.g.
   Missed Calls' five tabs) overflowed on mobile. Fixed by making the tab
   list horizontally scroll within its own bar (`overflow-x-auto`)
   instead of forcing the page to scroll.
4. **Long source URLs rendered as headings** (`PageHeader`, `CardHeader`,
   migration job cards) had no `break-words`. Fixed by adding
   `break-words` wherever job/organization identifiers render as
   headings.

## Manual pass

In addition to the automated check, every route was clicked through
manually in a real browser session covering: navigation, form validation
and submission, dialog open/close, tab switching, kanban stage moves, and
the GHL import wizard's full seven steps — matching the flows exercised
by `tests/e2e/*.spec.ts`.

## Re-running this check

```bash
cd apps/maxx-web
npm run build && npm run start -- -p 3100 &
npm run harness:browser
```
