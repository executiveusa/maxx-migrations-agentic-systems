# Crown & Core — connect to existing Paperclip, do not install a second instance

This is a real, idempotent bootstrap for an **existing, owner-authorized** Paperclip company and an **existing** Instinct agent. Paperclip stores tasks and run history; MAXX stores business truth, audit drafts, approval receipts, and data.

## Preview without credentials or network
node ops/paperclip/bootstrap.mjs

## Authorized operator activation
Use an existing Paperclip board API key scoped to the MACS company; never commit secrets, share an agent key with the owner, or create a second company merely to make this script work.

PAPERCLIP_API_URL=https://your-paperclip-host
PAPERCLIP_BOARD_API_KEY=(secret, via environment)
PAPERCLIP_COMPANY_ID=(verified existing company id)
PAPERCLIP_INSTINCT_AGENT_ID=(verified existing agent id)
node ops/paperclip/bootstrap.mjs --apply

The script:
- authenticates as a board operator and verifies company/Instinct identities;
- locates or creates only the Crown & Core project under the existing MACS company;
- creates a single root issue and 12 bounded work packages, or reuses them;
- never creates agents, scheduler jobs, credentials, payments, deployments, or customer actions;
- requires operator-run serialized execution to avoid races with other bootstrap processes.

It does NOT activate an Instinct model, prove a heartbeat, or turn ChatGPT into a ten-minute model controller. After activation, set and verify the existing Instinct agent heartbeat policy at 600 seconds through Paperclip's native supported configuration, using a proven adapter and a zero-paid-increment budget. Verify three real timed runs with run IDs, actual code/test evidence and restart/pause recovery. Existing 10-minute read-only GitHub watcher and hourly ChatGPT controller remain as-is.

## Fallback
If Paperclip is unavailable, preserve the Crown & Core work exclusively in draft PR #39. PR #37 is the separate MACS Client Zero mailbox and explicitly did not accept this additional client scope. Do not create or assign a duplicate controller. Keep the MAXX portal as the human access point. Do not execute client-facing actions from a script or from an unverified Instinct account. Re-running preview is always safe; re-running --apply checks the stable project/task markers before each insertion.
