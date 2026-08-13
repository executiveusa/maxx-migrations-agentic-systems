# MAXX Suite — Inspection Queue

Agents: do not work this entire list at once. Take the highest-priority unblocked item, load only its context folder, run the Forward Product Gate where applicable, produce evidence, update the registry, then stop or take the next bounded item.

## P0 — Core architecture

### 1. MACS public site release truth
Repo: `executiveusa/macsdigitalmedia`
Outcome: restore a green build and establish the canonical public offer before new design/GTM work.
Inspect:
- current `lib/managed-content.ts` type failure;
- current routes/content/forms;
- $7,500 Washington Founding Launch vs. recent $497 diagnosis/front-door direction;
- approved founder/Snoqualmie design salvage from closed backend PR #19;
- direct Supabase dependencies that should become a thin backend adapter.
Decision: one public product contract + one deployment candidate.

### 2. Agent MAXX ↔ MAXX Migrations capability matrix
Repos: `macs-agent-portal`, `maxx-migrations-agentic-systems`
Outcome: consolidate tested backend behavior without a rewrite.
Inspect:
- approvals;
- auth/operator identity;
- memory/ICM search;
- Hermes adapters;
- browser worker;
- scheduler;
- owner strategy;
- backup/restore;
- client SDK;
- existing MAXX backend equivalents.
Decision per capability: `KEEP_PORTAL_UI | MOVE_TO_BACKEND | WRAP | MERGE_TESTS | RETIRE`.

### 3. Agent MAXX public-repo secret audit
Repo: `macs-agent-portal`
Outcome: determine whether tracked `.env` content is placeholder or exposed credential material without copying values into ICM/chat.
Decision: rotate/remove/history remediation if real secrets exist.

### 4. Reconcile the existing MAXX data boundary
System: Supabase / backend
Outcome: establish the real current source of truth before creating or migrating anything.
Current evidence:
- connected `botanic-creations` has many isolated schemas but no observed MAXX schema;
- backend migration `apps/maxx-web/supabase/migrations/20260101000000_maxx_crm_core.sql` records the `maxx_` CRM schema as deployed to project ref `nfhejlqgvghzafrnmpsl` on 2026-07-04;
- that project is not available through the currently connected Supabase session, so its current state is unverified.
Inspect:
- project ownership/access and whether it still exists;
- schema/migration drift;
- actual data and active runtime references;
- RLS/tenant semantics and credentials;
- export/backup path.
Decision: `REUSE | MIGRATE | RETIRE` the existing MAXX database. Only after that decision may an agent propose an isolated shared schema or dedicated replacement project. Never create a second source of truth by default.

## P1 — Revenue and distribution engine

### 5. MAXX Clipz production audit
Repo: `maxx-clipz`
Outcome: decide whether this can become the first repeatable media product + internal social worker.
Test: one real long-form asset → clips/captions/artifacts with measured cost/time/quality.

### 6. Postiz MAXX distribution audit
Repo: `postiz-maxx-clipz`
Outcome: wrap official publishing/scheduling/analytics APIs behind governed MAXX social jobs.
Inspect upstream agent CLI before custom fork work.

### 7. MAXX Research audit
Repo: `MAXX-Research`
Outcome: produce sourced research packs for content/product/local-market work with provider portability and evidence metadata.

### 8. Social flywheel proof
Capabilities: Research + editorial + Clipz/ViMax + Postiz
Outcome: one verified piece of source content → approved derivatives → scheduled distribution → metrics → learning record.
Do not automate brand publishing before this proof.

## P2 — Migration + media leverage

### 9. MAXX Craft extraction audit
Repo: `maxx-craft`
Outcome: identify migration primitives that outperform/complete MAXX Migrations; merge/wrap useful parts rather than maintain a second migration platform.

### 10. Spy Scape salvage audit
Repo: `spy-scape-mustang-maXx`
Outcome: extract Lead Desk, evidence, source-health and production-verification patterns; retire competing control-plane role.

### 11. Advanced video face-off
Repos: `Agentic-AIGC-MAXX-EDITS`, `MAXX-Video-Agent`
Outcome: compare against simpler Clipz/FFmpeg paths on actual MACS social jobs.
Decision: wrap only capabilities that justify GPU/provider/ops complexity.

## P3 — Internal builder / uncertain salvage

### 12. Coze Studio security + usefulness audit
Repo: `maxx-coze-studio`
Outcome: decide whether visual workflow authoring adds value without creating a second source of truth/control plane.

### 13. Maxxie Scraper archaeology
Repo: `maxxiescraper`
Outcome: reconstruct product intent and extract only unique ingestion/research adapters.

### 14. Archive review
Repos: `maxxclipz`, `maxx-casino-portal`
Outcome: preserve unique assets/domains/history, then archive or separate from the core brand.

## Definition of progress

Progress is not “repo inspected.” Each item must end with:
- evidence;
- a portfolio decision;
- an updated context/registry;
- one next bounded action or an explicit stop/archive decision.
