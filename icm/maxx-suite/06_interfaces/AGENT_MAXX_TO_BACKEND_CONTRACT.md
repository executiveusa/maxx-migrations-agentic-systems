# Agent MAXX Portal → MAXX Backend Contract

## Mental model

Agent MAXX goes to the backend like a trusted operator going to the company library and operations desk. The portal is the conversational/voice surface; it is not the library itself.

## Backend capabilities the portal should request

- resolve authenticated user + tenant;
- retrieve scoped ICM/company context;
- search authoritative records through adapters;
- list allowed tools/capabilities;
- create plans/action proposals;
- execute safe pre-authorized work;
- request persisted approval for consequential work;
- stream progress/status;
- retrieve evidence receipts, artifacts and rollback instructions;
- submit learning candidates for human/independent approval.

## Security

No service-role database key in the portal. Use tenant-scoped auth, least privilege, short-lived tokens where possible and server-side mediation.

## Interface direction

Chat/voice first. Persistent screens exist only for information that benefits from visual state: progress, approvals, evidence, assets, schedules and history.