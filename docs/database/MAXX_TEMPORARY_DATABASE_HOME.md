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
       | authenticated versioned MAXX API
       |
Agent MAXX portal
```

Neither the public site nor Agent MAXX receives the Supabase `service_role` key.

## Migration history applied in Botanic Creations

- `create_maxx_portable_core_v1`
- `index_maxx_portable_core_v1`

A ChatGPT smoke workflow was successfully written and read back after these migrations.

## Proof boundary

The connector smoke test proves privileged database round-trip only. It does not prove end-user RLS or consequential-action execution safety.

Release gates still required:

1. authenticated user A belongs to tenant A;
2. authenticated user B belongs to tenant B;
3. A cannot read/write B and B cannot read/write A;
4. proposal has no side effect before approval;
5. rejection causes zero side effects;
6. every consequential action revalidates the exact persisted approval/action hash immediately before execution;
7. a repeated approval/execution request produces one side effect only;
8. evidence and audit records survive restart;
9. export/restore to an owner-controlled server is rehearsed.

## Open `maxx_private` RLS decision

Supabase's table inspector flags RLS disabled on:

- `maxx_private.integration_bindings`
- `maxx_private.ingress_events`

Direct access for `public`, `anon` and `authenticated` has already been revoked and these tables are intended to be service-role/server-only. However, Supabase still classifies disabled RLS as critical.

Pending explicit approval, the remediation proposed by the Supabase inspector is:

```sql
ALTER TABLE maxx_private.integration_bindings ENABLE ROW LEVEL SECURITY;
ALTER TABLE maxx_private.ingress_events ENABLE ROW LEVEL SECURITY;
```

If enabled with no client policies, direct anon/authenticated access remains blocked; server/service-role behavior must be tested before release. Do not add permissive browser policies to these tables.

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
