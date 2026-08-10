---
type: governance
status: active
access_tier: internal
---

# Authority Contract

## AI may do without consequential approval
- inspect authorized sources;
- summarize;
- classify;
- map entities/relationships/events;
- draft;
- propose actions;
- run reversible read-only checks.

## Human approval required
- external sends or publishing;
- database/CRM writes with business effect;
- deletion or revocation;
- money movement or price/refund commitments;
- credential/security changes;
- production deployment/rollback;
- canonical policy changes.

## Abstain / escalate
Do not act when tenant identity is uncertain, authority is missing, sources conflict materially, evidence is stale, rollback is absent, or the requested action exceeds the approved slice.

## Builder separation
An agent or human recorded as `proposed_by` cannot approve the same proposal. Agent proposals use `proposed_actor=maxx-agent` and a human membership must review them.
