# 08 — LEARN

## Purpose
Prove release health, observe real behavior, and feed verified learning back into ICM.

## Inputs
- Gauntlet-passed preview
- production/release checklist
- analytics and runtime observability
- owner-approved production plan

## Process
Verify build/runtime/route/form/API/accessibility/performance behavior, preserve rollback, promote only with approval, then observe real use. Record hypotheses and measurements separately from facts. Change one meaningful hypothesis at a time when possible.

## Outputs
- `RELEASE_EVIDENCE.md`
- production deployment reference
- rollback reference
- learning ledger
- superseded decisions where evidence changes the strategy

## Evidence
Deployment IDs, commit SHA, runtime logs, route tests, form/API receipts, accessibility results, analytics measurements.

## Human/authority check
Production promotion, domain/DNS changes, material tracking changes, and consequential business claims require the appropriate owner approval.

## Exit condition
The site is live with a verified rollback path, critical journeys are proven, and new learnings are written back as FACT/EVIDENCE/HYPOTHESIS rather than disappearing into chat history.
