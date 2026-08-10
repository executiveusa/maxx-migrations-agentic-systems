# MAXX Stage 00 — Business Intake → ICM Client Brain SOP

**Version:** 1.0  
**Date:** 2026-08-10  
**Purpose:** Give any capable human or AI agent a deterministic way to onboard a company, create portable operating context, identify a high-value workflow, define authority, and produce evidence before implementation expands.

## North Star

Do not sell disconnected agents. Build a client-owned operating context first, then connect supervised AI workflows to that context.

The intake is not paperwork before the project. **The intake creates the first version of the product.**

## Governing laws

1. Verify before claiming.
2. Diagnose before prescribing.
3. Inspect before asking the client for discoverable facts.
4. Reuse before adding.
5. One authoritative home per consequential fact.
6. Stable context is separate from changing operational state.
7. Client-private knowledge never crosses tenants.
8. Secrets are referenced securely; never copied into context.
9. AI acts only with delegated authority.
10. Consequential writes require an explicit gate unless a narrower authority has been proven and approved.
11. Builders and agents cannot approve their own production work.
12. Ship one bounded workflow with rollback and proof before expanding.
13. The client retains control of delivered code, data, domains, hosting, credentials, exports and customer-specific context.

## Grill behavior

The interviewer maintains a **design tree**.

- A question is on the **frontier** only when its prerequisites are settled.
- Ask the complete current frontier in one round.
- Give a recommended answer when a decision benefits from a default.
- Do not ask the client to provide facts that can be found in public sources, connected systems, files, analytics or the repository.
- Facts found by the auditor are marked `DISCOVER`.
- Decisions, exceptions, authority and priorities that require the client are marked `ASK`.
- New answers may create new branches; add those questions before moving downstream.
- The intake is complete only when there are no silent assumptions in a material branch.

## ICM storage model

```text
CLIENT/
├── AGENTS.md
├── CONTEXT.md
├── _config/
│   ├── source-precedence.yaml
│   ├── approval-policy.yaml
│   ├── data-policy.yaml
│   └── retention-policy.yaml
├── shared/
│   ├── domain-objects.md
│   ├── evidence-contract.md
│   ├── workflow-contract.md
│   └── handoff-contract.md
├── identity/
├── people/
├── customers/
├── offer/
├── proof/
├── sales/
├── delivery/
├── follow-up/
├── marketing/
├── opportunities/
├── operations/
├── data-ownership/
├── workflows/
├── decisions/
├── evidence/
└── working-state/
```

Operational records remain in the authoritative CRM/database/file system. ICM stores routing, definitions, decisions, provenance, policies, workflow contracts and pointers to authoritative records.

## Canonical knowledge object

Every consequential knowledge item should be representable as:

```yaml
id: stable-id
tenant_id: client-namespace
type: entity|relationship|event|state|policy|decision|metric|evidence|workflow
title: human-readable title
value: structured or markdown content
source:
  system: crm|email|drive|website|interview|repo|other
  locator: durable pointer
  observed_at: ISO-8601
provenance:
  generated_by: human-or-agent
  verified_by: human-or-test
  confidence: 0.0-1.0
freshness:
  status: draft|stable|deprecated
  review_by: ISO-8601-or-null
permissions:
  classification: public|internal|confidential|restricted
  roles: []
relations: []
```

## Stage protocol

### 00 — Engagement Lock
Exit only when outcome, target, constraints, proof and economic value are explicit.

### 01 — Business Model
Record offers, customer, revenue/funding, unit economics, bottleneck and baseline.

### 02 — Customer Journey
Map acquisition → capture → qualification → conversion → onboarding → fulfillment → support → retention. Identify failure points and moments of truth.

### 03 — People & Tribal Knowledge
Map process owners, decision authority, subject-matter experts, unwritten rules, exceptions, key-person risk and human-only work.

### 04 — Systems & Data
Inventory systems and discover sources of truth. Record owner control, APIs/webhooks/exports, data duplication, credentials custody, backup and exit path.

### 05 — Company Brain / Ontology
Create the machine-readable business map:
- **entities** — nouns;
- **relationships** — edges;
- **states** — lifecycle positions;
- **events** — changes that trigger work;
- **policies** — allowed/required/prohibited behavior;
- **decisions** — durable judgment;
- **evidence** — records supporting facts/outcomes;
- **metrics** — canonical measurements.

Write relationships as `Subject → Verb → Object`.

### 06 — Workflow Discovery
Score candidate workflows on:
- economic value;
- frequency;
- repeatability;
- data readiness;
- reversibility;
- risk;
- proofability.

Choose **one** first workflow. Specify trigger, required context, current steps, branches, exceptions, tools, outputs, failure modes and rollback.

### 07 — AI Authority & Risk
Create a deterministic authority matrix:
- READ
- DRAFT
- WRITE
- SEND
- PUBLISH
- SPEND
- DELETE/DESTRUCTIVE
- APPROVE
- ABSTAIN/ESCALATE

### 08 — Brand & Communications
Capture promise, voice, evidence examples, forbidden claims, languages, tone by context and publishing approval.

### 09 — Security & Sovereignty
Prove tenant isolation, role boundaries, secret handling, backup/recovery, data/model policy, retention, incident authority and export.

### 10 — Proof & Operations
Define golden cases, negative cases, acceptance criteria, independent reviewer, pilot boundary, monitoring, kill switch, rollback, handoff, learning approval and expansion rule.

## Mandatory outputs

A completed Stage 00 engagement produces:

1. `START-HERE.md` / `CONTEXT.md`
2. company identity + offer summary
3. customer journey
4. people/authority map
5. systems/source-of-truth inventory
6. ontology seed: entities/relationships/states/events
7. policy + AI authority matrix
8. workflow candidate scorecard
9. Workflow #1 contract
10. proof/acceptance plan
11. risk + rollback plan
12. sovereign handoff checklist
13. unresolved questions list
14. machine-readable JSON export
15. evidence ledger with provenance/freshness

## Workflow execution contract

Every automated action should receive:

```text
EVENT
+ TENANT
+ RELEVANT CONTEXT
+ CURRENT STATE
+ POLICY
+ DELEGATED PERMISSIONS
+ SUCCESS CRITERIA
```

and produce:

```text
DECISION
+ PROPOSED ACTION
+ CONFIDENCE
+ EVIDENCE
+ APPROVAL STATE
+ TOOL RECEIPTS
+ RESULT
+ VERIFICATION
+ WRITEBACK
+ ROLLBACK REFERENCE
```

Valid terminal choices include `ACT`, `REQUEST_APPROVAL`, `ABSTAIN`, `ESCALATE`, and `NO_ACTION`.

## Client Zero acceptance

For MACS itself, the first proof slice is:

1. submit a real intake;
2. persist it durably;
3. compile it to a MACS ICM tenant context;
4. cold-walk it with a memoryless agent;
5. prove tenant isolation;
6. propose a benign CRM write;
7. show zero side effect before approval;
8. reject one action and prove no side effect;
9. approve one action and prove exactly-once execution;
10. log the evidence;
11. export the resulting client context;
12. rehearse rollback.

Do not expand to grant submission, browser autonomy, new personas, broad social automation or additional workflows until this slice is evidenced.

## Human handoff test

Give the exported client folder to a capable human/agent with no chat history. They must be able to answer:

- Where am I?
- What is this business?
- What is it trying to achieve?
- What is authoritative?
- What is unknown?
- What may I read?
- What may I change?
- What requires approval?
- What workflow is currently active?
- What evidence proves current status?
- What is the next action?
- How do I roll it back?

If they cannot, the context is incomplete.
