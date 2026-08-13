# MAXX Core Consolidation Plan

## Locked topology

```text
MACS DIGITAL MEDIA
public storefront / content / acquisition
executiveusa/macsdigitalmedia
        │
        │ bounded server-side intake + webhook/API
        ▼
MAXX MIGRATIONS
canonical ICM / data / workflows / tools / approvals / evidence
executiveusa/maxx-migrations-agentic-systems
        ▲
        │ authenticated tenant-scoped API + events
        │
AGENT MAXX
chat / voice / avatar / approvals / progress / evidence UI
executiveusa/macs-agent-portal
```

No fourth control plane.

## Phase A — Inventory, do not migrate yet

### MACS Digital Media
- Identify public routes, content, forms and direct persistence.
- Mark anything that is actually business process state for backend extraction.
- Reconcile public offer/pricing contract before GTM automation.

### MAXX Migrations
- Inventory existing Client Zero, intake, workflow, approval, evidence, auth, model and migration modules.
- Identify inherited ERPNext capabilities that should remain hidden behind MAXX APIs.
- Define the target multi-tenant/organization boundary before database work.

### Agent MAXX Portal
- Inventory the existing tested control plane and `packages/client-sdk`.
- Do not discard code because it lives in the wrong repo; classify it by behavior and proof.
- Audit the tracked `.env` through an approved secret process without putting values in documentation.

## Phase B — Capability matrix

For every overlapping module create one row:

| Capability | Portal implementation | Backend implementation | Tests/evidence | Canonical destination | Action |
|---|---|---|---|---|---|
| Auth/operator identity | inspect | inspect | inspect | MAXX backend contract | TBD |
| Approval engine | inspect | Client Zero approval RPC/flows | inspect | MAXX backend | MERGE/KEEP BEST |
| Memory/ICM search | local indexer | ICM structures | inspect | MAXX backend | MERGE |
| Hermes adapter | existing portal adapter | inspect | existing tests | MAXX backend | MOVE/WRAP |
| Browser worker | Playwright read-only | inspect | existing tests | capability service | MOVE/WRAP |
| Scheduler | fixed interval | inspect | existing tests | MAXX backend | MOVE if needed |
| Owner strategy | existing | inspect | existing tests | MAXX backend | MOVE |
| Client SDK | typed `/v1/*` package | none/inspect | existing tests | shared interface package | KEEP/ADAPT |
| Backup/restore | local verified scripts | inspect | existing evidence | backend ops | MERGE |

Do not select winners from file age or preference. Select by current behavior, security, tests, fit and simplicity.

## Phase C — Contract first

Before moving implementations, freeze versioned contracts for:

- identity + tenant resolution;
- context search/read;
- tool registry;
- plan/action proposal;
- approval/rejection;
- execution status/event stream;
- evidence/artifacts;
- rollback;
- public intake receipt;
- product/job invocation (research, video, social, migration).

The portal/client SDK and public-site adapter integrate against contracts, not database tables.

## Phase D — Move with strangler pattern

Do not perform a big-bang rewrite.

1. Route one capability from portal to MAXX backend.
2. Run old/new contract tests against the same fixtures.
3. Prove auth, failure, rollback and evidence behavior.
4. Switch portal to backend implementation.
5. Observe.
6. Retire duplicate implementation only after proof.

Repeat capability by capability.

## Phase E — Suite adapters

After core consolidation, attach product capabilities behind the backend tool/job layer:

- MAXX Research → research jobs/evidence packs;
- MAXX Clipz → clip jobs/artifacts;
- ViMax/MAXX Video Agent → advanced media jobs;
- Postiz → approved social publishing + analytics;
- MAXX Craft → migration primitives;
- future local/open models → model router/evaluation board.

Agent MAXX calls a business capability (`research this`, `turn this into clips`, `schedule approved posts`), not a repo name.

## Definition of done

- A memoryless agent can name the source of truth for every core responsibility.
- MACS storefront contains no unrestricted agent/database credentials.
- Agent MAXX contains no independent durable business source of truth.
- MAXX Migrations exposes authenticated, tenant-scoped, versioned contracts.
- One end-to-end customer flow proves:
  `public/Agent intent → backend context → plan → approval if required → execution → evidence → status visible in Agent MAXX`.
- Duplicate control-plane implementations are retired only after equivalent proof exists.
