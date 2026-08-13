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
- `harden_maxx_private_rls_v1`

A ChatGPT smoke workflow was successfully written and read back after the core/index migrations.

## Private-schema security decision — resolved

`maxx_private.integration_bindings` and `maxx_private.ingress_events` now have RLS enabled.

Current direct-access boundary:
- `public`: no schema usage / no table access;
- `anon`: no schema usage / no table access;
- `authenticated`: no schema usage / no table access;
- `service_role`: server-side table access retained.

No anon/authenticated RLS policies are defined on `maxx_private`. Supabase therefore reports `rls_enabled_no_policy` at INFO. That is intentional for these server-only tables and is not the former critical RLS-disabled condition.

The applied hardening migration is source-controlled at:
`apps/maxx-web/supabase/migrations/20260813024716_harden_maxx_private_rls_v1.sql`.

## Authenticated tenant-isolation proof

A rollback-only live test was executed against Botanic Creations using two synthetic `auth.users`, two synthetic organizations and one project per organization.

Verified:
1. tenant A saw exactly one organization: tenant A;
2. tenant A could not read tenant B's project;
3. tenant A's attempted update against tenant B's project affected zero rows;
4. tenant B saw exactly one organization: tenant B;
5. tenant B could not read tenant A's project;
6. tenant B's attempted update against tenant A's project affected zero rows;
7. the transaction rolled back and follow-up checks confirmed zero synthetic users, organizations or projects remained.

The regression test is source-controlled at:
`apps/maxx-web/supabase/tests/maxx_tenant_isolation.sql`.

## Proof boundary

The following are now proven in the temporary database:
- privileged ChatGPT database round trip;
- business-table RLS enabled;
- private-table RLS and grant boundary;
- two-tenant authenticated read/write isolation for organizations/projects.

Release gates still required:

1. public/webhook ingress is validated, rate-bounded and idempotent;
2. Agent MAXX authenticates through a versioned backend API rather than receiving a service-role key;
3. proposal has no side effect before approval;
4. rejection causes zero side effects;
5. every consequential action revalidates the exact persisted approval/action hash immediately before execution;
6. repeated approval/execution requests produce one side effect only;
7. evidence and audit records survive restart;
8. export/restore to an owner-controlled server is rehearsed.

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
