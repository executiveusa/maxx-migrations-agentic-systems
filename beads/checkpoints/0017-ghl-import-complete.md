```yaml
id: bead-0017
timestamp: 2026-07-03T10:00:00Z
actor: claude-build-agent
phase: stage-2
repo: executiveusa/maxx-migrations-agentic-systems
branch: claude/maxx-migrations-full-build-5jh55a
files_changed:
  - apps/maxx-web/components/import/GhlImportWizard.tsx
  - apps/maxx-web/lib/import/ghl/*.ts
  - apps/maxx-web/app/api/import/ghl/**/*.ts
decision: >
  Built the real 7-step wizard (source, upload, objects, map fields,
  validate, run, summary) backed by a real CSV parser (RFC4180-ish, quoted
  fields), a header-alias field mapper with confidence scoring, a
  validator that flags missing required fields and malformed emails per
  row, and an import runner that produces total/imported/error counts plus
  a downloadable error CSV. GhlApiProvider is implemented for the live API
  path and throws a clear setup-required error when GHL_API_KEY/
  GHL_LOCATION_ID are unset; CSV import works with zero configuration.
reason: Matches spec 8.9. Covered by tests/unit/ghl-import.test.ts.
rollback_command: git checkout -- apps/maxx-web/components/import apps/maxx-web/lib/import
risks: []
next_action: Build Missed Call Text Back (bead-0018).
human_needed: false
```
