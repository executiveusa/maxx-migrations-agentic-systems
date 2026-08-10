---
type: working-state
status: in-progress
last_updated: 2026-08-10
---

# Client Zero Status

| Gate | Status | Required evidence |
|---|---|---|
| Stage 00 questionnaire | PASS (static) | 116 questions / 83 required / Grill frontier |
| Durable intake | NOT YET PROVEN LIVE | Supabase insert + restart/readback |
| ICM normalization | IMPLEMENTED IN CONTRACT | persisted `icm` + `ontology` JSON |
| Tenant isolation | NOT YET PROVEN LIVE | two authenticated tenants + denied cross-read |
| Zero side effect before approval | IMPLEMENTED IN CONTRACT | proposal receipt + note count = 0 |
| Rejection safety | NOT YET PROVEN LIVE | rejected proposal + note count = 0 |
| Approval exactly once | IMPLEMENTED IN DB FUNCTION | repeated approve call + one note row |
| Authorized export | IMPLEMENTED IN DB FUNCTION | downloaded export bundle |
| Rollback rehearsal | NOT YET PROVEN | restore/delete test record + evidence |
| Independent release review | NOT YET DONE | reviewer sign-off |

## Current blocker
The connected Supabase account does not expose the organization previously named for MACS. Do not deploy Client Zero data into a different organization merely to make the test pass.

## Next
Connect/select the correct Supabase organization, apply the migration, add the real operator membership, set the app environment, then run the live proof sequence.
