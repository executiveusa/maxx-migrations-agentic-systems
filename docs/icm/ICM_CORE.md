# MAXX ICM Core

Status: Architectural authority
Canonical runtime: executiveusa/maxx-migrations-agentic-systems

## Purpose

ICM means **Interpretable Context Methodology**: folder structure is agent architecture, routing files are small catalogs, stage contracts name exact inputs/process/outputs/human checks, and plain-text artifacts make working state inspectable.

Within MAXX, ICM also carries the durable business context graph that lets replaceable agents reason from shared, source-aware truth instead of starting from a blank chat. The method is the structure; the context graph is the business truth stored and routed through that structure.

Agents are workers. ICM is durable organizational memory and routing. Models, portals, vendors, CLIs and MCP clients are replaceable components.

Read `docs/icm/FEDERATION_CONTRACT.md` for the three-repository ownership and machine-call boundary.

## Structural invariants

- One folder, one job.
- Root entry files route; they do not carry the library.
- Numbering encodes order where sequence matters.
- Working folders carry explicit `CONTEXT.md` contracts.
- Stable factory/reference material is separated from per-run product/output.
- Intermediate outputs are inspectable edit surfaces.
- Load only what the current step needs.
- One home per fact; link instead of copy.
- Files/canonical records carry state; generated indexes are not hand-maintained truth.
- Reusable work is instantiated from templates rather than blank ad hoc structures.

## Minimum context graph

Organization
- Identity
- People + roles
- Customers + stakeholders
- Problems + desired outcomes
- Offers + economics
- Proof + approved claims
- Processes + owners
- Systems + integrations + ownership
- Decisions + rationale
- Policies + authority
- Opportunities + work
- Evidence + measurements
- Learning + review state

## Required metadata

Material ICM records should support stable ID, organization/tenant ID, type, canonical value, source/provenance, confidence/verification status, timestamps, responsible owner, sensitivity classification, supersession/conflict relationships, and review date where staleness matters.

## Truth classes

- FACT — supported by an authoritative source or explicit owner confirmation.
- INFERENCE — reasoned conclusion, clearly marked and revisable.
- HYPOTHESIS — something we intend to test.
- DECISION — approved choice with owner/date/rationale.
- EVIDENCE — artifact or measurement supporting a claim/outcome.

Never promote an inference or hypothesis to fact because it appears repeatedly in agent output.

## Context quality loop

Ingest → normalize → deduplicate → attach provenance → detect conflicts → request human truth only when necessary → use → measure → learn → review/supersede.

Context quality is more important than context quantity.

## Security boundary

Never store passwords, API keys, private keys, session cookies, recovery codes, or raw secrets in ICM.

ICM may store a non-secret credential reference, its owner, purpose, rotation state, and access policy. Secret material stays in the approved secret manager.

## Client isolation

Every query/action must resolve an authenticated actor and organization scope. Service-role access cannot substitute for user-scoped authorization at the application boundary.

No demo organization ID or in-memory fallback is permitted on a production client path.

## Action envelope

Every action records actor, organization_id, intent, specific action, risk class, ICM input references, approval state, evidence, and rollback.

Consequential actions cannot execute until a matching approval is persisted and revalidated immediately before execution.

## Frontend contract

The MACS Digital Media storefront and Agent MAXX communicate with MAXX Migrations through narrow authenticated contracts, never direct database/service-role access.

Initial closed loop:

inquiry → durable client-scoped record → diagnosis → proposed action → human approval if consequential → execution → evidence → learning/export

This loop is the Client Zero proof target before broader autonomous capabilities.

## Motion before walk-test pass

A structurally correct ICM is not enough to call the full product wired. Before a federation walk test can pass, at least one intended path must produce motion:

`surface -> handler -> transport -> canonical owner -> observable result -> evidence`

See `icm/federation/WALK_TEST.md`.
