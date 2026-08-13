# MAXX Suite Working State

Last updated: 2026-08-12

## Canonical architecture locked

- Public site: `executiveusa/macsdigitalmedia`
- Backend/data/process brain: `executiveusa/maxx-migrations-agentic-systems`
- Agent MAXX interface: `executiveusa/macs-agent-portal`

## Temporary database home — approved

Owner decision on 2026-08-12: use **Botanic Creations** Supabase (`cyxdevcjycmffhmwxojh`) for the MAXX build/test phase so the system can be exercised directly from ChatGPT and later moved to an owner-controlled server.

Current schemas:
- `maxx` — business/context/workflow/approval/evidence layer;
- `maxx_private` — server-only ingress/integration metadata.

Applied migrations in Botanic Creations:
- `create_maxx_portable_core_v1`
- `index_maxx_portable_core_v1`

Seeded test state:
- organization: `macs-digital-media`
- project: `client-zero`
- completed workflow: `bootstrap.chatgpt_smoke_test`
- verified step, evidence receipt, event and audit round trip.

Migration destination: owner-controlled server. Self-hosted Supabase/Postgres is the easiest direct move because current test auth/RLS uses Supabase primitives. Vanilla Postgres remains possible with an auth adapter migration.

The older repository reference to Supabase project `nfhejlqgvghzafrnmpsl` is now legacy evidence, not the active build/test target. Do not silently synchronize or merge its data into Botanic Creations.

## Current database release truth

Verified:
- schema creation and migrations;
- ChatGPT privileged read/write round trip;
- RLS enabled on all business-facing `maxx` tables;
- private schema grants revoked from `public`, `anon`, `authenticated`;
- no remaining unindexed foreign keys in `maxx` / `maxx_private` after the index migration;
- no MAXX-specific finding appeared in the security-advisor result for the business-facing tables.

Not yet release-proven:
- authenticated two-tenant RLS denial;
- public/webhook ingress contract;
- Agent MAXX authenticated API access;
- exact persisted approval revalidation immediately before consequential execution;
- owner-server export/restore rehearsal.

Critical open security decision:
- Supabase's table inspector flags RLS disabled on `maxx_private.integration_bindings` and `maxx_private.ingress_events`. These are intended service-role-only and direct anon/authenticated grants are already revoked, but the RLS warning must be explicitly resolved before production release.

## Other infrastructure observed

- Vercel `macsdigitalmedia` project exists and is separate from MAXX Migrations. A docs-only routing PR exposed an existing TypeScript failure in `lib/managed-content.ts`; this is public-site debt, not a suite-router regression.
- Vercel `macs-agent-portal` exists. One portal project check was green while another reported an account/platform deployment block; do not call the portal production live from that evidence.
- `macs-agent-portal` contains substantial tested control-plane work that should be consolidated capability-by-capability into the canonical backend rather than rebuilt.

## Immediate priorities

1. Resolve the `maxx_private` RLS decision.
2. Wire MAXX Migrations to the new `maxx` schemas through versioned backend contracts; never give the public site or Agent MAXX a service-role database key.
3. Prove two authenticated tenants and cross-tenant RLS denial.
4. Prove proposal → persisted approval → exact hash revalidation → exactly-once consequential execution → evidence.
5. Build the Agent MAXX Portal ↔ MAXX Migrations capability matrix before moving code.
6. Fix the public MACS website build in its own repo and keep it as a thin storefront/webhook client.
7. Maintain an export/restore runbook and rehearse moving only MAXX-owned schemas/data to an owner-controlled server before declaring sovereignty complete.
