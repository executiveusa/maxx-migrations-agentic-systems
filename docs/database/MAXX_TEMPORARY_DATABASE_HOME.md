# MAXX Temporary Database Home

Decision date: 2026-08-12

## Current authoritative build/test database

- Supabase project: `botanic-creations`
- Project ref: `cyxdevcjycmffhmwxojh`
- Region: `us-west-1`
- MAXX business schema: `maxx`
- MAXX server-only schema: `maxx_private`

This is a temporary shared Postgres home for development, integration tests and ChatGPT-operated inspection. It is **not** the final sovereignty destination.

## Ownership boundary

MAXX may own data only in:
- `maxx.*`
- `maxx_private.*`
- its row in `platform.app_registry`

Do not treat unrelated Botanic Creations schemas as MAXX data. Cross-product joins or foreign keys require an explicit architecture decision.

## Current schema surface

`maxx`:
- organizations
- memberships
- projects
- context_snapshots
- workflow_runs
- run_steps
- action_proposals
- approvals
- artifacts
- evidence_receipts
- events
- external_refs
- audit_log

`maxx_private`:
- integration_bindings
- ingress_events
- execution_ledger

## Secrets rule

Never store provider secrets, service-role keys, OAuth refresh tokens or private signing keys as ordinary MAXX rows.

`maxx_private.integration_bindings.secret_ref` stores only a pointer/name for an approved secret manager. Redacted configuration may be stored; raw credentials may not.

## Access architecture

```text
MACS public site
       |
       | bounded server-side API/webhook
       v
MAXX Migrations backend
       |
       | privileged server-side database adapter
       v
maxx + maxx_private
       ^
       |
       | JWT-protected MAXX API
       |
Agent MAXX portal
```

Neither the public site nor Agent MAXX receives the Supabase `service_role` key.

## Migration history applied in Botanic Creations

- `create_maxx_portable_core_v1`
- `index_maxx_portable_core_v1`
- `harden_maxx_private_rls_v1`
- `maxx_agent_authenticated_api_v1`
- `maxx_agent_service_support_v1`
- `maxx_release_proof_cleanup_v1`
- `maxx_execution_ledger_fk_indexes_v1`

The source-controlled migration filenames preserve the actual applied Supabase versions.

## Private-schema security

`maxx_private.integration_bindings`, `maxx_private.ingress_events` and `maxx_private.execution_ledger` have RLS enabled.

Current direct-access boundary:
- `public`: no direct client access;
- `anon`: no direct client access;
- `authenticated`: no direct client access;
- `service_role`: server-side access retained.

No anon/authenticated RLS policies are defined on the MAXX private tables. Supabase therefore reports `rls_enabled_no_policy` at INFO. That is intentional for server-only tables and is not an RLS-disabled condition.

## Authenticated tenant-isolation proof

A rollback-only live test was executed against Botanic Creations using two synthetic authenticated identities, two synthetic organizations and one project per organization.

Verified:
1. tenant A saw only tenant A;
2. tenant A could not read or update tenant B's project;
3. tenant B saw only tenant B;
4. tenant B could not read or update tenant A's project;
5. the transaction rolled back and follow-up checks confirmed no synthetic users, organizations or projects remained.

Regression test:
`apps/maxx-web/supabase/tests/maxx_tenant_isolation.sql`.

## Agent MAXX authenticated API proof

Deployed Edge Function: `maxx-agent-api` with JWT verification enabled.

The caller's JWT is validated. Normal reads/proposals/decisions execute through a caller-scoped Supabase client so RLS remains authoritative. The service role is used only inside the server function for the controlled execution primitive and is never returned to the client.

A disposable real Supabase Auth identity exercised this path end to end. The proof harness was disabled immediately afterward and its synthetic identity/records were removed.

Verified:
- unauthenticated API request denied;
- authenticated snapshot succeeded;
- rejected proposal produced zero execution rows and zero evidence receipts;
- approved proposal was bound to the exact persisted action hash;
- the executor recomputed/revalidated that hash immediately before execution;
- first approved execution produced one controlled execution;
- repeated execution returned the same execution id idempotently;
- approved final counts: one execution row, one evidence receipt, one executed event;
- proof cleanup left zero synthetic release-proof users, memberships or proposals.

`execute_test_action` is a controlled internal governance proof. It does not prove arbitrary third-party side effects.

## Advisor status

After `maxx_execution_ledger_fk_indexes_v1`, Supabase no longer reports an unindexed foreign key for MAXX `execution_ledger`. New MAXX indexes may appear as `unused_index` INFO while this test database is lightly used; retain them until real workload evidence says otherwise.

Unrelated advisor findings in other Botanic Creations schemas are not MAXX-owned and are not modified by this runbook.

## Remaining release gates

1. wire the actual `macs-agent-portal` business/Hermes lane to `maxx-agent-api`;
2. prove public/webhook ingress with validation, rate limits and idempotency;
3. prove real external consequential adapters under the same approval/hash/exactly-once contract;
4. rehearse export/restore to an owner-controlled server.

## Later move to MAXX's own server

Preferred low-friction destination: owner-controlled self-hosted Supabase/Postgres, because the current test schema uses Supabase Auth (`auth.users`, `auth.uid()`) and RLS.

Migration procedure should eventually be automated and rehearsed:
1. quiesce writes or establish a cutoff;
2. export `maxx` + `maxx_private` schema and data;
3. export required auth identities through an approved identity migration process if moving Supabase Auth;
4. restore into owner-controlled Postgres/self-hosted Supabase;
5. apply secrets separately from the database export;
6. verify row counts, hashes, foreign keys and RLS;
7. run the MAXX acceptance suite against the new server;
8. switch backend connection only after proof;
9. keep the old database read-only for a bounded rollback window;
10. destroy or archive the temporary copy according to the owner's retention decision.

For vanilla Postgres without Supabase Auth, replace `auth.users` references and `auth.uid()` membership resolution with a MAXX-owned identity adapter before cutover.

## Sovereignty definition

Migration is complete only when the owner controls the server/database, credentials, backups, exports and recovery process and MAXX runs without dependence on this temporary Botanic Creations database.
