```yaml
id: bead-0022
timestamp: 2026-07-03T13:00:00Z
actor: claude-build-agent
phase: stage-2
repo: executiveusa/maxx-migrations-agentic-systems
branch: claude/maxx-migrations-full-build-5jh55a
files_changed:
  - apps/maxx-web/scripts/harness/*.mjs (9 files)
  - apps/maxx-web/vitest.config.ts
  - apps/maxx-web/playwright.config.ts
  - apps/maxx-web/tests/unit/*.test.ts (6 files, 27 tests)
  - apps/maxx-web/tests/e2e/*.spec.ts (5 files, 42 tests)
  - apps/maxx-web/components/ui/Input.tsx
  - apps/maxx-web/components/contacts/ContactsView.tsx
  - apps/maxx-web/components/pipeline/PipelineView.tsx
decision: >
  Built and ran the full harness (preflight, no-stubs, route-audit,
  link-check, api-smoke, copy-audit, env-audit, artifact-audit) plus 27
  unit tests and 42 Playwright e2e tests. During e2e testing, found and
  fixed a real correctness bug: components/ui/Input.tsx's Input/Textarea/
  Select were plain function components (not React.forwardRef), so
  react-hook-form's register() ref never reached the underlying DOM node —
  every form built on the shared Input/Select/Textarea (ContactsView,
  PipelineView's opportunity form) silently validated every field as
  "undefined" regardless of what the user typed. Fixed by wrapping all
  three in forwardRef. Also fixed a stale-server false negative during
  debugging (a killed-but-still-listening next-server process was serving
  an old build; the fix itself was correct on the first attempt).
reason: The prompt requires a harness that "proves it" — this bug is
  exactly the class of defect that harness had to catch before merge.
rollback_command: git checkout -- apps/maxx-web/scripts/harness apps/maxx-web/tests apps/maxx-web/components/ui/Input.tsx
risks: []
next_action: Full browser verification pass (bead-0023).
human_needed: false
```
