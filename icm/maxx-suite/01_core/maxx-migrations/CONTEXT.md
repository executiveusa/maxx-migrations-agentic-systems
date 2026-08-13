# MAXX Migrations — Sovereign Backend

Repo: `https://github.com/executiveusa/maxx-migrations-agentic-systems`
Default branch: `develop`
Vercel project: `maxx-migrations-agentic-systems` (`prj_e7HVL1TZlUEI2010PbaEV3Drr2J7`)

## Job

Canonical data/process/ICM/approval/evidence/backend layer for the MAXX ecosystem.

Own here:
- tenant/company context and ICM;
- durable business records or authoritative pointers;
- workflow state;
- tool registry and policy;
- action proposals and approvals;
- evidence/receipts/rollback;
- migration/extraction jobs;
- model routing/evaluations;
- social/research/video job orchestration;
- APIs used by the public storefront and Agent MAXX.

## Current database home — explicit owner decision 2026-08-12

For the build/test phase, MAXX uses the connected Supabase project **Botanic Creations** (`cyxdevcjycmffhmwxojh`) as a temporary shared Postgres host, following the same isolated-schema pattern used by the other products in that project.

MAXX owns two schemas there:

- `maxx` — portable business context, projects, workflow state, action proposals, approvals, artifacts, evidence, events, external references and audit records;
- `maxx_private` — server-only integration bindings and ingress metadata. Store secret references only, never secret values.

The intended later destination is an **owner-controlled server**. Prefer self-hosted Supabase/Postgres for a low-friction move because the current testing schema uses Supabase Auth/RLS primitives. A move to vanilla Postgres is also possible but requires replacing the `auth.users` / `auth.uid()` adapter rather than copying those Supabase-specific references unchanged.

Do not create a second active MAXX database while this temporary home is authoritative. The older repository reference to project `nfhejlqgvghzafrnmpsl` is legacy evidence to reconcile later, not the current build/test target.

## Database proof completed from ChatGPT

On 2026-08-12 the connected Supabase tool successfully:

1. applied `create_maxx_portable_core_v1`;
2. applied `index_maxx_portable_core_v1`;
3. seeded `macs-digital-media` + `client-zero`;
4. created a real `bootstrap.chatgpt_smoke_test` workflow run;
5. wrote a run step, evidence receipt, event and audit record;
6. read the same records back successfully;
7. verified there are no remaining unindexed foreign keys in `maxx` / `maxx_private`.

This proves privileged ChatGPT ↔ database round-trip access. It does **not** yet prove authenticated tenant RLS, public ingress, Agent MAXX auth, or approval-gated execution.

## Security note

All `maxx` business tables have RLS enabled. Supabase's table inspector currently flags RLS as disabled on the two server-only `maxx_private` tables. Direct grants to `public`, `anon` and `authenticated` were revoked, and the schema is intended for service-role/server access only, but the critical RLS advisor must be explicitly resolved before calling the database production-ready. Do not silently add permissive policies.

## Architecture direction

Do not make the user learn ERPNext. Treat ERP/business modules as backend primitives. Agent MAXX and ICM should translate plain-language owner outcomes into governed operations.

The durable moat is customer-owned context + workflows + evaluations + approvals + evidence + distribution, not attachment to one model vendor.

## Next inspection

1. Resolve the `maxx_private` RLS decision explicitly.
2. Define stable `/v1` contracts for public intake and Agent MAXX.
3. Add authenticated test users/tenants through the real app auth flow, then prove cross-tenant RLS denial.
4. Implement and prove exact persisted approval revalidation immediately before consequential execution.
5. Map current MAXX-specific code away from inherited ERPNext surface area.
6. Keep migration/export instructions current so `maxx` + `maxx_private` can later move to the owner's server without redesigning the product.