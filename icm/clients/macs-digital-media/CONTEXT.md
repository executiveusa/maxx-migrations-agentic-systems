# CONTEXT.md — MACS Client Zero Pipeline

## Repeating unit
One business intake that becomes a portable ICM client brain and one bounded, approval-gated workflow proof.

## Pipeline
1. `01_intake/` — capture evidence-backed answers.
2. `02_normalize/` — compile answers into ICM + ontology objects.
3. `03_isolate/` — bind the record to one tenant and prove another tenant cannot read it.
4. `04_approve/` — propose one benign write; a human rejects or approves it.
5. `05_prove/` — verify zero-before-approval, exactly-once execution, export, and rollback.

## Factory references
- `_shared/company.md`
- `_shared/authority.md`
- `../../../docs/MACS_BUSINESS_INTAKE_SOP.md`
- `../../../skills/maxx-business-intake/SKILL.md`

## State
`working-state/STATUS.md` is the human-readable proof surface. Database records and evidence receipts remain authoritative.

## Done
A memoryless agent can cold-walk the exported client context; tenant isolation is evidenced; rejection has zero side effect; approval executes exactly once; export and rollback are demonstrated; an independent reviewer approves release.
