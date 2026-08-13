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

## Current truth

The repo is a very large ERPNext-derived codebase with newer MAXX application layers. Client Zero intake/approval/evidence structures exist, but live Supabase tenant-isolation and approval-runtime proof remain release gates.

## Architecture direction

Do not make the user learn ERPNext. Treat ERP/business modules as backend primitives. Agent MAXX and ICM should translate plain-language owner outcomes into governed operations.

The durable moat is customer-owned context + workflows + evaluations + approvals + evidence + distribution, not attachment to one model vendor.

## Next inspection

1. Map current MAXX-specific code away from inherited ERPNext surface area.
2. Define stable `/v1` contracts for public intake and Agent MAXX.
3. Create an isolated MAXX schema in the approved Supabase project only after ownership/isolation is explicitly approved.
4. Prove the Client Zero runtime before expanding autonomous writes.