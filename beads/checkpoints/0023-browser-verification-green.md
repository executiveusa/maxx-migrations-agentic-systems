```yaml
id: bead-0023
timestamp: 2026-07-03T14:00:00Z
actor: claude-build-agent
phase: stage-2
repo: executiveusa/maxx-migrations-agentic-systems
branch: claude/maxx-migrations-full-build-5jh55a
files_changed:
  - apps/maxx-web/app/globals.css
  - apps/maxx-web/components/app-shell/AppShell.tsx
  - apps/maxx-web/components/ui/Tabs.tsx
  - apps/maxx-web/components/ui/Card.tsx
  - apps/maxx-web/components/ui/PageHeader.tsx
  - apps/maxx-web/app/app/migrations/page.tsx
  - apps/maxx-web/components/dashboard/MigrationJobsSnapshot.tsx
  - apps/maxx-web/components/artifacts/*.tsx (6 header-row fixes)
  - apps/maxx-web/scripts/harness/browser-verify.mjs
  - docs/qa/FULL_APP_BROWSER_VERIFICATION.md
  - ops/reports/harness/browser-verification.json
decision: >
  Built scripts/harness/browser-verify.mjs to drive a real Chromium
  browser across all 27 unique routes at 375/768/1440px and check for
  404s, console errors, and horizontal overflow. First run found 13 real
  overflow bugs: (1) a CSS Grid "blowout" affecting every responsive grid
  in the app because none specified an explicit base grid-cols before
  their sm:/md:/lg: prefix — fixed globally via `.grid > * { min-width:
  0 }` in globals.css rather than patching 37 individual usages; (2) a
  parallel flexbox min-width:auto issue in AppShell's content column,
  fixed with min-w-0; (3) non-wrapping tab bars overflowing on mobile with
  5+ tabs, fixed by making the tab list scroll within its own bar; (4)
  long source URLs rendered as headings with no break-words. Re-ran to
  81/81 passing.
reason: The spec requires desktop/tablet/mobile browser verification with
  "no broken layout." Automating it against a real browser instead of
  eyeballing screenshots caught bugs a manual pass likely would have
  missed on non-obvious routes.
rollback_command: git checkout -- apps/maxx-web/app/globals.css apps/maxx-web/components/app-shell/AppShell.tsx apps/maxx-web/components/ui/Tabs.tsx apps/maxx-web/components/ui/Card.tsx apps/maxx-web/components/ui/PageHeader.tsx
risks: []
next_action: Commit, push, open draft PR (bead-0024).
human_needed: false
```
