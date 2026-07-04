# AGENTS.md — The Pauli Effect

## Purpose

The Pauli Effect is the hub agency in the 6-agency Maxx flywheel collective.
Owner (Bambu) manages all 6 agencies from one Mission Control dashboard —
this is the only agency with visibility into every other agency's projects,
agents, and spend.

## Architecture

- `maxx_organizations` row: slug `pauli-effect`, plan
  `sovereign_install_plus_partner` (the elevated plan — grants hub visibility)
- Owns projects across multiple existing products in the shared Supabase
  project `nfhejlqgvghzafrnmpsl` (Yappy, Comics, MOL, Pauli learning app) —
  these are NOT Maxx CRM data and must never be modified by Maxx agents
  without explicit instruction
- Maxx CRM + flywheel tables are `maxx_`-prefixed to coexist safely alongside
  these other products

## Agent Rules

- Agents operating under this org may read/aggregate data from all 6
  agencies' `maxx_projects`/`maxx_beads`/`maxx_flywheel_sessions` rows (hub
  privilege) — this cross-org read is intentional and enforced at the
  application layer, not by RLS (RLS is per-org by design; the hub dashboard
  uses a service-role aggregation query, never a client-side bypass)
- Never modify another agency's `maxx_organizations` row without Bambu's
  explicit approval
- Never touch non-`maxx_` prefixed tables in this Supabase project — they
  belong to unrelated products sharing the same database

## Setup

No agency-specific setup beyond the standard Maxx CRM Supabase connection.
This org's `maxx_organizations.id` is the one used for hub-level dashboard
queries.

## Verification

- Mission Control dashboard (`/app/command-center`) must show all 6 agencies
  when logged in as this org
- `npm run verify:full` in `apps/maxx-web` — standard gate, no agency-specific
  overrides

## Common Tasks

- Launch a new project for any of the 6 agencies via the Project Launcher
- Review PRs/agent sessions across all agencies before they merge
- Monitor aggregate spend across all 6 agencies' agent sessions

## Risk Zones

- Cross-org data aggregation: any bug here leaks one agency's client data to
  another. Treat the hub aggregation query as security-critical code.
- Shared Supabase project: a migration mistake here can affect Yappy/Comics/
  MOL/Pauli-app data. Always scope migrations to `maxx_`-prefixed tables.

## Deployment

Same Vercel/Supabase pipeline as the rest of Maxx. No agency-specific
deployment target.

## Handoff

Brand voice, specific project history, and current client roster for The
Pauli Effect were not provided at the time this file was generated — update
this section with real specifics as they become available. Do not fabricate
case studies or client names.
