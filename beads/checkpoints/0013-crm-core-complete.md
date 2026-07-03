```yaml
id: bead-0013
timestamp: 2026-07-03T08:00:00Z
actor: claude-build-agent
phase: stage-2
repo: executiveusa/maxx-migrations-agentic-systems
branch: claude/maxx-migrations-full-build-5jh55a
files_changed:
  - apps/maxx-web/components/contacts/ContactsView.tsx
  - apps/maxx-web/components/pipeline/PipelineView.tsx
  - apps/maxx-web/components/forms/FormBuilder.tsx
  - apps/maxx-web/components/forms/FormDetailView.tsx
  - apps/maxx-web/lib/data/store.ts
  - apps/maxx-web/app/api/contacts/route.ts
  - apps/maxx-web/app/api/pipeline/route.ts
  - apps/maxx-web/app/api/forms/**/*.ts
decision: >
  Implemented Contacts (search/filter/create/detail with notes+timeline),
  Pipeline (kanban stages, create/move opportunities, totals), and Forms
  (builder, field editor, public preview, submissions, embed code) as real
  client-driven CRM features backed by a process-lifetime in-memory store
  (lib/data/store.ts) seeded from lib/mock-data, so create/edit flows
  actually persist for the session instead of resetting on navigation.
reason: Matches spec 8.2–8.4; the in-memory store is the documented
  seed-mode substitute for Supabase until NEXT_PUBLIC_SUPABASE_URL is set.
rollback_command: git checkout -- apps/maxx-web/components/contacts apps/maxx-web/components/pipeline apps/maxx-web/components/forms apps/maxx-web/lib/data/store.ts
risks:
  - In-memory store does not survive a serverless cold start in production;
    documented in docs/openspec/03_ARCHITECTURE.md and .env.example.
next_action: Build Workflow Builder (bead-0014... continues as 0015 per
  numbering below).
human_needed: false
```
