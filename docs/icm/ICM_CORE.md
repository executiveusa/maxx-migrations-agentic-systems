# MAXX ICM Core

Status: Architectural authority
Canonical runtime: executiveusa/maxx-migrations-agentic-systems

## Purpose

ICM (Intelligent Context Management) is the model of the business that lets replaceable agents reason from shared, source-aware truth instead of starting from a blank chat.

Agents are workers. ICM is durable organizational memory. Models and vendors are replaceable components.

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

The MACS Digital Media storefront communicates with MAXX through narrow authenticated APIs/events, never direct database/service-role access.

Initial closed loop:

inquiry → durable client-scoped record → diagnosis → proposed action → human approval if consequential → execution → evidence → learning/export

This loop is the Client Zero proof target before broader autonomous capabilities.
