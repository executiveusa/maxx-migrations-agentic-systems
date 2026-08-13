# MAXX Suite Working State

Last updated: 2026-08-13

## Canonical architecture locked

- Public site: `executiveusa/macsdigitalmedia`
- Backend/data/process brain: `executiveusa/maxx-migrations-agentic-systems`
- Agent MAXX interface: `executiveusa/macs-agent-portal`

## Temporary database home — approved

Owner decision: use **Botanic Creations** Supabase (`cyxdevcjycmffhmwxojh`) for the MAXX build/test phase so the system can be exercised directly from ChatGPT and later moved to an owner-controlled server.

Current schemas:
- `maxx` — business/context/workflow/approval/evidence layer;
- `maxx_private` — server-only ingress/integration/execution metadata.

Applied MAXX migrations in Botanic Creations:
- `create_maxx_portable_core_v1`
- `index_maxx_portable_core_v1`
- `harden_maxx_private_rls_v1`
- `maxx_agent_authenticated_api_v1`
- `maxx_agent_service_support_v1`
- `maxx_release_proof_cleanup_v1`
- `maxx_execution_ledger_fk_indexes_v1`

Seeded durable test state:
- organization: `macs-digital-media`
- project: `client-zero`
- completed workflow: `bootstrap.chatgpt_smoke_test`
- verified step, evidence receipt, event and audit round trip.

Migration destination: owner-controlled server. Self-hosted Supabase/Postgres is the easiest direct move because current test auth/RLS uses Supabase primitives. Vanilla Postgres remains possible with an auth adapter migration.

The older repository reference to Supabase project `nfhejlqgvghzafrnmpsl` is legacy evidence, not the active build/test target. Do not silently synchronize or merge its data into Botanic Creations.

## Database and tenant release proof

Verified from ChatGPT against Botanic Creations:
- schema creation and migrations;
- privileged read/write round trip;
- RLS enabled on all business-facing `maxx` tables;
- RLS enabled on `maxx_private` server-only tables;
- `public`, `anon` and `authenticated` have no direct private-schema access;
- `service_role` retains server-only access;
- no MAXX unindexed-foreign-key finding remains after the execution-ledger index migration;
- rollback-only two-user/two-tenant test passed in both directions;
- tenant A could not read/update tenant B and tenant B could not read/update tenant A;
- all synthetic isolation-test users/organizations/projects were absent after rollback.

Supabase's `rls_enabled_no_policy` INFO notices on MAXX private tables are intentional: those tables have RLS enabled, no client grants and no client policies.

## Agent MAXX authenticated backend boundary — proved

Deployed Supabase Edge Function:
- `maxx-agent-api`
- JWT verification enabled;
- caller token is validated with Supabase Auth;
- normal reads/proposal creation/decisions execute through the caller-scoped client and underlying RLS;
- service-role authority is used only inside the server function for the controlled execution primitive;
- no service-role credential is returned to or required by Agent MAXX/browser clients.

Permanent API operations currently proved:
- authenticated organization/project/pending-approval snapshot;
- create action proposal with database-computed action hash and idempotency key;
- persist approve/reject decision against the exact action hash;
- controlled internal test execution through the service-only executor.

Important boundary: `execute_test_action` is an internal governance proof primitive. It does **not** prove an arbitrary external business side effect such as sending an email, spending money, publishing content or modifying a third-party system.

The existing Botanic Creations `agent_maxx_conversation_routing` migration is complementary: personal conversations route to Pi, business conversations route to Hermes. The authenticated MAXX API is the business-side authority that Hermes/Agent MAXX can call for governed MAXX data and execution.

## Approval / exactly-once release proof — PASS

A one-shot disposable proof harness exercised the real Supabase Auth + deployed `maxx-agent-api` path, then removed its synthetic account and records.

Verified results:
- unauthenticated API request denied;
- synthetic authenticated operator signed in normally and received a valid snapshot;
- rejected proposal persisted `rejected` and execution returned forbidden;
- rejected proposal produced **0 execution-ledger rows** and **0 evidence receipts**;
- approved proposal persisted an approval tied to the exact action hash;
- executor recomputed and revalidated the persisted action hash immediately before execution;
- first approved execution recorded the controlled side effect;
- second execution returned idempotently with the **same execution ID**;
- final counts for approved proposal: **1 execution**, **1 evidence receipt**, **1 executed event**;
- final proposal status: `executed`;
- final approval status: `approved`;
- cleanup verification found **0 synthetic auth users**, **0 synthetic release-proof proposals**, and **0 synthetic memberships**.

Temporary proof/bootstrap Edge Functions were immediately replaced with JWT-protected inert `410` versions after the proof. Their temporary credentials/nonces are not source-controlled.

## Advisor truth

After the latest DDL:
- no MAXX unindexed-FK performance finding remains;
- new MAXX execution-ledger indexes may appear as `unused_index` INFO because the test database is new; do not remove them based on that early signal;
- unrelated security/performance advisor findings remain in other Botanic Creations schemas and are outside this MAXX release slice.

## Not yet release-proven

- actual `macs-agent-portal` code wired to `maxx-agent-api`;
- bounded public/webhook ingress contract from `macsdigitalmedia`;
- real external consequential adapters under the approval/exactly-once contract;
- owner-server export/restore rehearsal.

## Other infrastructure observed

- Vercel `macsdigitalmedia` project exists and is separate from MAXX Migrations. A docs-only routing PR exposed an existing TypeScript failure in `lib/managed-content.ts`; this is public-site debt, not a MAXX backend regression.
- `macs-agent-portal` contains substantial tested control-plane work that should be consolidated capability-by-capability into the canonical backend rather than rebuilt.

## Immediate priorities

1. Wire the business/Hermes lane in `macs-agent-portal` to the JWT-protected `maxx-agent-api`; preserve Pi for personal conversations.
2. Implement and prove a bounded MACS public-site webhook/intake boundary with validation, rate limiting and idempotency.
3. Replace the controlled test executor only with narrowly scoped real adapters that preserve exact persisted approval revalidation and exactly-once evidence.
4. Build the Agent MAXX Portal ↔ MAXX Migrations capability matrix before moving overlapping control-plane code.
5. Fix the public MACS website build in its own repo and keep it as a thin storefront/webhook client.
6. Rehearse exporting/restoring only MAXX-owned schemas/data to an owner-controlled server before declaring sovereignty complete.
