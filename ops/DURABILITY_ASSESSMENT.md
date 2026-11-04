# MACS Client Zero — durable execution assessment
Reviewed 2026-11-04: `earendil-works/absurd` README, `docs/concepts.md`, `docs/agents.md`, `docs/patterns/living-with-code-changes.md` and `skills/absurd/SKILL.md`. This is a reference review, **not** installation or runtime qualification.

## Reuse and gaps
- Existing canonical code uses Postgres tables, unique proposal-to-note constraint, locked approval RPC and evidence ledger. These can provide exactly-once *database note effects* if verified under concurrent requests; they do not prove atomic intake or external side-effect exactly-once.
- GitHub draft PR #37 provides a durable public control conversation and source history. It is not a transactional task queue, worker lease store or native Agent2Agent transport. Stable message IDs and persisted cursors still need implementation/verification.
- ChatGPT controller automation `6aeb82f9ffa4819190d4e1429ee9a586` is configured hourly. An initial scheduled run was recorded completed on 2026-11-04; it inspected PR #37 and correctly found no Instinct acknowledgment. This is **controller invocation proof only**, not a proven ten-minute development loop.
- Instinct execution environment, scheduler ID, worker checkpoint store, lease, restart behavior and authenticated interface remain unverified.
- The existing MAXX portal remains the fallback; no extra orchestrator should be created without evidence.

## Absurd comparison
Absurd offers Postgres-native tasks, runs, checkpoints, worker claims, retries, event waits and task inspection. Its code-change guidance requires versioned steps or compatible checkpoint readers. Code outside checkpointed steps may repeat; checkpointing alone does not guarantee exactly-once external effects. For this pilot, do **not** add Absurd now: no verified gap analysis against an actual Instinct worker runtime and no authorization for new paid infrastructure. Revisit only if existing scheduler/checkpoint mechanism demonstrably fails requirements.

## Required qualification
Prove a genuine timed Instinct invocation, task claim, persisted checkpoint, duplicate suppression, crash/worker/scheduler restart, stale-lease recovery, safe pause/resume, and one independent review-correction-retest cycle. Record exact commands, expected/actual, UTC timestamps and reviewer. Until then state stays AWAITING_ACK or BLOCKED.
