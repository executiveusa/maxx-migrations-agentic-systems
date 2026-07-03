# 02 — Full App Requirements

This is the executable checklist for "done." Every item below maps to a
real file and is enforced by the harness or tests where noted.

1. Public marketing site — `app/page.tsx` + `app/features/*` — enforced by
   `harness:routes`, `harness:copy`.
2. Migration audit intake — `app/migration-audit/page.tsx`,
   `app/api/migrations/extract/route.ts` — e2e tested.
3. Auth-ready app shell — `components/app-shell/AppShell.tsx`, seed-mode
   banner via `lib/data/mode.ts`.
4. CRM dashboard — `app/app/page.tsx`.
5. Contacts — `app/app/contacts/page.tsx` — e2e tested.
6. Pipelines — `app/app/pipeline/page.tsx`.
7. Forms — `app/app/forms/*`.
8. Workflow Builder — `app/app/workflows/*` — e2e tested.
9. Community — `app/app/community/page.tsx`.
10. Courses — `app/app/community/courses/*`.
11. Social Media Planner — `app/app/social-planner/page.tsx` — e2e tested.
12. GHL Import Wizard — `app/app/import/ghl/page.tsx` — unit + e2e tested.
13. Missed Call Text Back — `app/app/missed-calls/page.tsx` — unit tested
    (opt-out blocking).
14. Website Migration Engine — `app/app/migrations/*`.
15. AI agent runtime — `app/app/agents/page.tsx`, `lib/agents/*` — unit
    tested.
16. Supabase schema and RLS plan —
    `apps/maxx-web/supabase/migrations/20260101000000_maxx_crm_core.sql`.
17. Integration adapters — `lib/integrations/*`, `lib/import/ghl/*`.
18. Interactive product artifacts — `components/artifacts/*` +
    `ops/reports/artifacts/*.json` — enforced by `harness:artifacts`.
19. Real final copy — `docs/copy/*.md` — enforced by `harness:copy`.
20. Vercel monorepo deployment fix — `vercel.json` +
    `docs/deployment/VERCEL_MONOREPO_FIX.md`.
21. Full test/build/link/404/no-stub harness —
    `apps/maxx-web/scripts/harness/*` — this is the enforcement mechanism
    for every item above.
22. Beads ledger — `beads/checkpoints/0011`–`0024`.
23. ICM organization — `icm/11_full_app_completion/`.
24. OpenSpec documentation — this directory.
25. PR handoff — `beads/checkpoints/0024-pr-summary.md`.
