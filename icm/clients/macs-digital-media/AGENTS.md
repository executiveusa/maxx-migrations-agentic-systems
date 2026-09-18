# AGENTS.md — MACS Digital Media Client Zero

You are inside the MACS Client Zero ICM workspace.

## Route by task
- Understand the client/business → `_shared/company.md`
- Understand authority and safety → `_shared/authority.md`
- See current proof status → `working-state/STATUS.md`
- Run intake → `01_intake/CONTEXT.md`
- Normalize to portable context → `02_normalize/CONTEXT.md`
- Prove tenant isolation → `03_isolate/CONTEXT.md`
- Review/execute proposed action → `04_approve/CONTEXT.md`
- Verify/export/rollback → `05_prove/CONTEXT.md`
- Audit/reposition/redesign/rebuild the public site → `06_transform/CONTEXT.md`, then load the canonical `../../site-transformation-protocol/00_router/CONTEXT.md`

## Rules
1. Load only the current stage contract, its named inputs, and required shared references.
2. Do not load secrets into this workspace.
3. One home per fact; link instead of copying.
4. Human review is a stage boundary.
5. Do not call Client Zero complete until `working-state/STATUS.md` contains production evidence for every gate.
6. A write-capable site-transformation agent must pass `../../site-transformation-protocol/WALK_TEST.md` before design/build work.
7. Do not use chat history as a substitute for ICM routing or evidence.
