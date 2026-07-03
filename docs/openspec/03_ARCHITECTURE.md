# 03 — Architecture

## Stack

Next.js 14 App Router, TypeScript (strict), Tailwind CSS, Zod,
react-hook-form, Supabase JS client (`@supabase/ssr`,
`@supabase/supabase-js` — wired for use once a project is configured, not
yet connected to a live project in this build).

## Layering

```
app/                      routes (public, /app/*, /api/*) — thin, compose lib+components
components/
  ui/                      design-system primitives (Button, Card, Input, Dialog, Toast, ...)
  app-shell/               AppShell, AppNav, AppHeader
  landing/, features/      public marketing sections
  <feature>/               client views (ContactsView, PipelineView, WorkflowBuilder, ...)
  artifacts/               13 interactive artifacts
lib/
  types/                   canonical TypeScript domain types
  validation/              Zod schemas (client + server share these)
  mock-data/                seed data, read-only
  data/                    mode.ts (seed-mode flags), store.ts (mutable in-memory store)
  integrations/            social + telephony provider adapters (mock/real)
  import/ghl/              CSV parsing, mapping, validation, import runner
  migration/               crawler, extractor, asset inventory, design auditor, report generator
  agents/                  model policy/router, tool policy, agent runner, usage logger
  design/                  tokens.ts (JS mirror of CSS custom properties)
  nav.ts                   shared nav item lists
```

## Data flow in seed mode

Every list/detail page reads from `lib/data/store.ts`, a module-level
object seeded once per server process from `lib/mock-data/*`. API routes
mutate this store directly (push/splice on its arrays), so create/edit
flows persist for the life of the process — this is intentional and
documented, not an oversight: it lets every "new X" flow (contact,
opportunity, form, workflow, social post, migration job, import job)
behave like a real backend without requiring a live database in this
environment. See `.env.example` and `lib/data/mode.ts`.

**Production note**: this store does not survive a serverless cold start.
The Supabase migration in `supabase/migrations/` defines the real schema
this store is designed to be replaced by — swapping `lib/data/store.ts`'s
in-memory arrays for Supabase queries is a contained, mechanical change
because every consumer already goes through `getStore()`.

## Client/server boundary

Pages that read `getStore()` are marked `export const dynamic =
"force-dynamic"` so Next.js doesn't statically cache seed data at build
time. Feature views are client components (`"use client"`) that receive
server-fetched initial data as props, then manage their own local/optimistic
state plus API calls for persistence.
