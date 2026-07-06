# Final Polish Audit — Maxx Migrations

Scope: `apps/maxx-web`. Written as Deliverable 1 of the 9/10 client-ready polish pass. Findings below are verified against the actual repo, not assumed.

## 1. Current routes (marketing + app)

Public marketing routes: `/`, `/how-it-works`, `/pricing`, `/migration-audit`, `/privacy`, `/terms`, `/features` (+ 7 feature sub-pages: community, courses, ghl-import, missed-call-text-back, social-planner, website-migration, workflows).

App/dashboard routes (all under `/app`): `agents`, `command-center`, `community`, `contacts`, `forms`, `import`, `migrations`, `missed-calls`, `pipeline`, `projects`, `settings`, `social-planner`, `workflows`.

API routes: `agents`, `community/{comments,dm,posts}`, `contacts`, `courses`, `flywheel/{launch,status,stop}`, `forms[/[formId]]`, `health`, `migrations/{extract,jobs}`, `missed-calls/text-back`, `pipeline`, `social/{posts,publish,schedule}`, `twilio/{sms,status,voice}`, `workflows[/[workflowId]]`.

## 2. Public-facing routes

Everything under item 1 not prefixed `/app` or `/api`. These are safe to treat as marketing/lead-gen surfaces.

## 3. App/demo routes

All `/app/*` routes render against `getStore()` (in-memory, process-lifetime, seeded from `lib/mock-data/*`). **No route currently distinguishes "demo" from "live" in the UI** — the app looks and behaves identically whether or not real integrations are configured.

## 4. Copy issues

- Hero (`components/landing/HeroSection.tsx`) is actually close to client-ready already: "Sovereign AI migrations for mission-driven teams," ownership framing, "One-time install. Owned code. Owned data." present. Needs the GHL-comparison tertiary link and stronger pain-point framing per spec, but it is not "AI slop."
- `MainNav.tsx` labels the dashboard entry point **"Open App"** — reads as a live production workspace. No demo-mode signal anywhere in nav.
- No GHL/Wix/Squarespace/CRM comparison section exists anywhere in the marketing routes (grep confirms — only GHL *import* tooling references, which are a different feature: importing a client's existing GHL data, not a competitive comparison).
- No onboarding-path / stepper section on the homepage or `/how-it-works` confirmed absent as a distinct "audit → map → install → 30 days → optional partner" flow (needs verification pass on `/how-it-works` copy in next phase — not fully read yet).
- No fake testimonials found. `NonprofitUseCases.tsx` explicitly disclaims: "Migrations — not client testimonials." Good — nothing to fix here, preserve this honesty.

## 5. UX issues

- No visible distinction between demo data and a real client workspace inside `/app/*`. A prospect clicking "Open App" from the homepage lands in what looks like a live CRM with seeded fake contacts/pipeline/forms, no banner explaining it's sample data.
- No logo/brand mark anywhere — `public/` has no logo or favicon assets. Nav is text-only ("Maxx Migrations" wordmark, unverified font treatment).

## 6. Backend truth issues (highest priority)

- **`/api/migrations/extract` (backing `MigrationAuditForm`) does not persist anything.** It validates the payload with Zod and returns `{ received: true, message: "..." }` — no `getStore()` append, no Supabase insert, no email/webhook. Every audit-request lead is silently discarded on submit. This is the single biggest revenue-risk bug in the repo: paid traffic to `/migration-audit` today generates zero real leads regardless of form-fill volume.
- Root `package.json` (repo root, not `apps/maxx-web/package.json`) still has ERPNext/Frappe metadata (`"name": "erpnext"`, Frappe repository/homepage/bugs URLs, GPL-3.0 license, `banking` postinstall script). This is stale leftover from the legacy ERPNext base the app was built on top of — needs full replacement per spec Deliverable 10. `apps/maxx-web/package.json` itself is already correctly named (`maxx-web`).

## 7. Auth status

**Not implemented.** No `middleware.ts` exists anywhere in `apps/maxx-web`. `/app/*` routes and their backing API routes are unauthenticated and unguarded — anyone with the URL can reach them. `lib/data/mode.ts` exposes `isSeedMode()` gated on `NEXT_PUBLIC_AUTH_CONFIGURED !== "true"`, but nothing currently reads that flag to redirect unauthenticated users or gate mutation routes. The flag exists as a stub for future wiring, not a working gate today.

## 8. Supabase/persistence status

**Not connected.** No Supabase client instantiation found anywhere in `apps/maxx-web/lib`. Migrations exist under `supabase/migrations/` (per repo CLAUDE.md, a live 45-table schema in the `nfhejlqgvghzafrnmpsl` project), but the app code never queries it — `getStore()` is a `globalThis`-scoped in-memory object seeded from `lib/mock-data/*`, explicitly documented in its own header comment as "used while no Supabase project is configured."

## 9. Lead capture status

**Broken — confirmed data loss.** See item 6. This is the top fix priority: it's a one-line-of-intent, high-blast-radius bug (marketing spend flowing into a form that drops every submission).

## 10. Vercel deployment status

**Configured correctly already.** Root `vercel.json` has the correct `installCommand` (`npm install --prefix apps/maxx-web && npm install --ignore-scripts`), `buildCommand`, and `outputDirectory` — this matches the "Phase 6 — Vercel fix" already marked done in the repo's own CLAUDE.md. No changes needed here unless build/test fails after other changes land.

## 11. Exact files to change (this pass)

Priority order, most impactful first:

1. `apps/maxx-web/app/api/migrations/extract/route.ts` — add persistence (store append + demo/live status in response), never silently discard.
2. `apps/maxx-web/components/forms/MigrationAuditForm.tsx` — surface demo-mode vs. persisted-mode messaging from the API response.
3. `package.json` (repo root) — replace ERPNext/Frappe metadata.
4. `apps/maxx-web/components/landing/MainNav.tsx` — "Open App" → "View Demo App" (until real auth lands) + demo banner treatment.
5. `apps/maxx-web/app/app/layout.tsx` (or equivalent) — add a persistent demo-mode banner if auth remains unconfigured.
6. New: GHL/CRM comparison section component + homepage placement.
7. New: onboarding-path stepper section.
8. New: brand/logo component (`components/brand/MaxxLogo.tsx`) + favicon.
9. Feature pages under `app/features/*` — claim-safety pass (soften absolute automation/compliance language), scoped after auditing each page's current copy.

## Not yet started

Auth wiring, Supabase live connection, full copy/design pass on every feature page, logo design, micro-interaction pass, and the browser QA / test / deploy steps are queued for subsequent commits — each will get its own reviewable diff rather than one monolithic change, given the blast radius (auth and persistence changes are exactly the kind of thing this repo's CLAUDE.md flags as needing care).
