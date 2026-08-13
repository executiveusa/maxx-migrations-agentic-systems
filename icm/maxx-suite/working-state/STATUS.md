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
- `harden_maxx_private_rls_v1`

Seeded durable test state:
- organization: `macs-digital-media`
- project: `client-zero`
- completed workflow: `bootstrap.chatgpt_smoke_test`
- verified step, evidence receipt, event and audit round trip.

Migration destination: owner-controlled server. Self-hosted Supabase/Postgres is the easiest direct move because current test auth/RLS uses Supabase primitives. Vanilla Postgres remains possible with an auth adapter migration.

The older repository reference to Supabase project `nfhejlqgvghzafrnmpsl` is legacy evidence, not the active build/test target. Do not silently synchronize or merge its data into Botanic Creations.

## Current database release truth

Verified from ChatGPT against Botanic Creations:
- schema creation and migrations;
- privileged read/write round trip;
- RLS enabled on all business-facing `maxx` tables;
- RLS enabled on both `maxx_private` tables;
- `public`, `anon` and `authenticated` have no `maxx_private` schema usage or table SELECT privilege;
- `service_role` retains server-side table access;
- no remaining unindexed foreign keys in `maxx` / `maxx_private` after the index migration;
- two authenticated synthetic users were mapped to two synthetic tenants inside a rollback-only transaction;
- tenant A saw only tenant A and could not read or update tenant B's project;
- tenant B saw only tenant B and could not read or update tenant A's project;
- all synthetic auth users, organizations and projects were confirmed absent after rollback.

The Supabase security advisor no longer reports the prior critical RLS-disabled finding for MAXX. It now reports `rls_enabled_no_policy` at INFO for the two `maxx_private` tables; that is intentional because they are server-only and have no client grants or client policies.

Not yet release-proven:
- public/webhook ingress contract;
- Agent MAXX authenticated API access;
- exact persisted approval revalidation immediately before consequential execution;
- rejection => zero side effects;
- repeated approval/execution => exactly one side effect;
- owner-server export/restore rehearsal.

## Other infrastructure observed

- Vercel `macsdigitalmedia` project exists and is separate from MAXX Migrations. A docs-only routing PR exposed an existing TypeScript failure in `lib/managed-content.ts`; this is public-site debt, not a suite-router regression.
- Vercel `macs-agent-portal` exists. One portal project check was green while another reported an account/platform deployment block; do not call the portal production live from that evidence.
- `macs-agent-portal` contains substantial tested control-plane work that should be consolidated capability-by-capability into the canonical backend rather than rebuilt.

## Immediate priorities

1. Wire MAXX Migrations to the new `maxx` schemas through versioned backend contracts; never give the public site or Agent MAXX a service-role database key.
2. Implement and prove public/webhook ingress with bounded server-side validation and idempotency.
3. Prove proposal → persisted approval → exact hash revalidation → exactly-once consequential execution → evidence, including rejection with zero side effects.
4. Build the Agent MAXX Portal ↔ MAXX Migrations capability matrix before moving code.
5. Fix the public MACS website build in its own repo and keep it as a thin storefront/webhook client.
6. Rehearse exporting/restoring only MAXX-owned schemas/data to an owner-controlled server before declaring sovereignty complete.
