# MAXX Suite Working State

Last updated: 2026-08-12

## Canonical architecture locked

- Public site: `executiveusa/macsdigitalmedia`
- Backend/data/process brain: `executiveusa/maxx-migrations-agentic-systems`
- Agent MAXX interface: `executiveusa/macs-agent-portal`

## Infrastructure observed

- Vercel `macsdigitalmedia` project exists and is separate from MAXX Migrations. A docs-only routing PR triggered the existing build and exposed a TypeScript failure in `lib/managed-content.ts` (`GenericStringError` → `ManagedContentRow` cast). The changed PR file was only `AGENTS.md`, so treat this as pre-existing/public-site build debt to fix in the public repo, not a suite-router regression.
- Vercel `macs-agent-portal` project exists. During this audit one portal Vercel project check was green while another check reported an account/platform deployment block; do not call the portal production live from that evidence.
- Vercel MAXX Migrations docs branch built green on both existing MAXX Migrations Vercel projects.
- Connected Supabase currently exposes only `botanic-creations` in this session. Schemas include multiple isolated product schemas, but no MAXX-specific schema was observed. No database mutation was made during this portfolio pass.

## Important codebase discovery

`macs-agent-portal` already contains substantial tested backend/control-plane work: approvals, feature flags, browser worker, memory, scheduler, Hermes adapter, voice gateway, owner strategy, backup/restore, security hardening, CI and a typed client SDK. Repository history also states that this existing control plane is single-organization, not a proven multi-tenant SaaS backend.

Therefore the core backend phase is **consolidation, not greenfield duplication**. Preserve proof and tests, compare with MAXX Migrations capability-by-capability, then move/wrap the winning implementation behind the canonical backend contract.

## Immediate risks / decisions

1. Do not merge public-site design work into MAXX Migrations. PR #19 was closed unmerged after the boundary correction.
2. Port approved founder/Snoqualmie concepts into `macsdigitalmedia` later.
3. Fix the public site's current TypeScript build blocker in its own bounded release slice.
4. Reconcile public offer/pricing contract before GTM automation: current repo truth includes a $7,500 Washington Founding Launch while recent direction also uses a $497 diagnosis/front door.
5. Audit the committed `.env` file in public `macs-agent-portal` without exposing contents; rotate any real credentials.
6. Decide whether MAXX gets its own isolated Supabase schema inside Botanic Creations or a separate project before implementing data contracts.
7. Build the Agent MAXX Portal ↔ MAXX Migrations capability matrix before moving code.
8. Audit `maxx-craft` and spy-scape against MAXX Migrations for code extraction, not parallel control planes.
9. Benchmark the social stack end to end: Research → editorial → video → Postiz → metrics.

## Next bounded phase

Inspect the three core repos deeply and produce one connection spec with exact API routes, auth, source-of-truth ownership, migration/consolidation choices and deployment boundaries. No broad implementation until that spec passes review.
