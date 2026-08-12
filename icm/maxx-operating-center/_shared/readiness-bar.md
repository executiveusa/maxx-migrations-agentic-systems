---
type: factory-reference
status: release-gate
---

# MAXX readiness bar

MAXX is not ready because a page renders or an agent replies. The release bar is observable outcome + safety + portability.

## ICM walk test
A memoryless LLM must be able to:
1. open `AGENTS.md` and know where it is;
2. find the current task with at most two additional routing reads;
3. load only the named stage inputs/references;
4. identify the authoritative home for company truth, authority, runtime, data, and current status;
5. avoid loading secrets or unrelated client context.

## Product proof
Client Zero must complete one real narrow job from a plain-language request:
ASK → ORIENT → PLAN → AUTHORITY CHECK → EXECUTE → VERIFY → REPORT.

Initial job: identify and recover eligible forgotten leads for MACS, with consequential external communication held to the Human ↔ Machine Contract.

## Technical proof
- repository verification gates pass for touched production paths;
- tenant isolation is tested with two tenant identities/scopes;
- rejection produces zero consequential side effects;
- approval binds to the exact action and execution is exactly once;
- evidence receipts record what happened;
- rollback/recovery is demonstrated;
- current Vercel deployment is healthy;
- database security advisors are reviewed;
- computer-use actions are policy-gated and isolated;
- export/handoff produces a portable Company Pack without secrets.

## Reduction critic
For every customer-facing element ask: can MAXX safely make this decision instead of showing it to the owner? If yes, remove or hide it.

The normal home surface should answer only:
- What can MAXX handle?
- What needs me?
- What got done?

## Gauntlet rule
Use a separate builder and critic. The critic inspects actual output and names the single largest remaining gap. Do not promote readiness until the gap list is empty or explicitly accepted by the owner.
