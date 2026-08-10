# CONTEXT.md — 04 Approve

## Inputs
- one `maxx_action_proposals` row
- `_shared/authority.md`
- authenticated reviewer membership

## Process
The database function locks the proposal, checks membership, blocks self-approval, and then either rejects with zero side effects or executes the one allowed benign action. `proposal_id` is unique on the side-effect row, making retries idempotent.

## Outputs
- rejected proposal + evidence, or
- exactly one client note + executed proposal + evidence

## Human check
Verify proposal content before approving. Approval is not delegated to the proposing agent.
