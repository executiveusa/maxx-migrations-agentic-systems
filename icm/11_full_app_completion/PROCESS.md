# Process

1. **Foundation first**: shared UI primitives (`components/ui`), types
   (`lib/types`), Zod schemas (`lib/validation`), and mock/seed data
   (`lib/mock-data`) before any route, so every screen built afterward
   drew from one consistent, typed source.
2. **Integration adapters before UI**: built the mock/real provider pairs
   for social, telephony, GHL import, migration crawling, and the agent
   runtime (`lib/integrations/*`, `lib/import/ghl/*`, `lib/migration/*`,
   `lib/agents/*`) so every screen could call a real interface instead of
   inlining fetch logic per-page.
3. **Routes in dependency order**: public marketing → app shell/dashboard
   → CRM core → workflow builder → community/courses → social planner →
   GHL import → missed-call text back → migration engine/agents →
   settings → API routes.
4. **In-memory store for seed mode**: `lib/data/store.ts` seeds from
   `lib/mock-data` and lets API routes mutate real state for the life of
   the process, so create/edit flows in Contacts, Pipeline, Forms,
   Workflows, Community, Social Planner, and GHL Import actually persist
   within a session instead of silently discarding writes — the documented
   substitute for a live Supabase project.
5. **Artifacts and copy after core functionality**: the 13 interactive
   artifacts and the copy decks were written once the underlying data and
   routes existed, so every artifact could bind to real state rather than
   invented placeholder numbers.
6. **Harness, then fix what it finds**: built `scripts/harness/*` and ran
   it (and the full test suite) against the finished app rather than
   trusting it was correct. This caught two real defects — literal
   placeholder testimonial copy, and a `React.forwardRef` gap in the
   shared `Input`/`Select`/`Textarea` components that silently broke every
   react-hook-form field built on top of them — both fixed before this
   stage was called complete.
