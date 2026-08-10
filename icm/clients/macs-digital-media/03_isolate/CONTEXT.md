# CONTEXT.md — 03 Isolate

## Inputs
- normalized submission
- authenticated tenant membership
- database RLS policies

## Process
Bind every record to `tenant_id`. Test with two authenticated users/tenants. Attempt cross-tenant reads and writes.

## Outputs
- isolation test receipts in the evidence ledger
- PASS/FAIL update in `working-state/STATUS.md`

## Human check
A reviewer confirms denied cross-tenant access from actual runtime evidence. Service-role queries do not count as RLS proof.
