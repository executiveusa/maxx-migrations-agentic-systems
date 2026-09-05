# MAXX ICM Federation Contract

Status: Architectural authority

## One system, three repositories

The MAXX/MACS system is one operating system split across three repositories because each repository has one job:

1. `executiveusa/macsdigitalmedia` — public storefront: story, proof, four commercial buckets, intake.
2. `executiveusa/macs-agent-portal` — Agent MAXX operator surface: Stacy conversation, approvals, status, CLI/MCP gateway, Hermes runtime.
3. `executiveusa/maxx-migrations-agentic-systems` — canonical backend: ICM, money models, client/process truth, experiments, migration/growth capabilities, evidence and release contracts.

Do not create a fourth control plane or a second canonical copy of business truth.

## ICM meaning

ICM means **Interpretable Context Methodology**: folder structure is the agent architecture, routing files are small catalogs, stage contracts name exact inputs/process/outputs/human checks, and plain-text artifacts carry inspectable state.

Within MAXX, the durable business context graph is the content carried by that methodology. Models, portals, MCP clients and CLIs are replaceable readers/operators of the same context.

## Cold-start rule for every agent

Before meaningful cross-repo work:

1. Read the local `AGENTS.md` or `CLAUDE.md` entry file.
2. Follow its pointer to this contract and `docs/icm/HUMAN_MACHINE_CONTRACT.md`.
3. Load only the smallest relevant ICM stage/context.
4. State MODE, OUTCOME, TARGET, CONSTRAINTS, PROOF, COMMERCIAL VALUE, AUTHORITY and ROLLBACK.
5. Inspect runtime/current code before changing it.
6. Produce motion evidence before claiming the walk test passes.

## Motion gate

A walk test cannot pass from documentation alone.

**Motion** means at least one intended product path has actually moved:

`surface -> handler -> transport -> canonical owner -> observable result -> evidence`

Minimum motion evidence:

- the transport is reachable in the supported runtime;
- the result is truthful, including truthful degraded/failure states;
- proof is recorded at the exact revision/deployment tested.

A green build is `TESTED`, not automatically `VERIFIED`.

## Walk test

An agent with no prior conversation memory must be able to:

- identify which repository owns the current task within the entry file plus at most two reads;
- find the exact ICM stage/context it needs;
- identify canonical state ownership;
- identify API/CLI/MCP path when machine execution is required;
- identify the human authority gate and rollback;
- state current evidence stage without guessing;
- point to motion evidence before declaring the system wired.

The executable checklist lives at `icm/federation/WALK_TEST.md`.

## Machine call graph

```text
Public visitor
  -> macsdigitalmedia
  -> narrow public intake / proof surface

Stacy
  -> macs-agent-portal
  -> MAXX control plane
  -> Hermes + governed tools
  -> MAXX Migrations federation adapter
  -> maxx-migrations-agentic-systems
  -> canonical ICM/capability
  -> evidence back to control plane
  -> Stacy

External machine client
  -> Agent MAXX API / CLI / MCP
  -> control plane
  -> same governed backend path
```

Hermes does not receive the backend machine secret directly. It calls the scoped control-plane MCP bridge; the control plane owns the backend credential and policy.

## Canonical ownership

| Truth | Boss |
|---|---|
| public MACS story/copy/proof presentation | `macsdigitalmedia` |
| Stacy session, operator auth, approvals and conversational runtime | `macs-agent-portal` control plane |
| ICM method/contracts, money models, commercial bucket logic | `maxx-migrations-agentic-systems` |
| durable backend client/process/evidence state | `maxx-migrations-agentic-systems` / its configured canonical database |
| Hermes working/session memory | isolated Agent MAXX Hermes runtime; never canonical business authority |
| browser UI state | projection only |

## Public commercial taxonomy

Exactly four public buckets:

- Reset
- Momentum
- Scale
- Launch

Named products, Client Zero, Built Here, labs and experiments are proof/capability labels, not fifth buckets.

## Evidence states

`PROPOSED -> BUILT -> TESTED -> VERIFIED -> ADOPTED -> VALUABLE`

Never promote evidence by wording alone.

## Human authority

Human approval remains mandatory for money, contracts, credentials, sensitive/public claims, destructive production actions, consequential sends/publishing and any action with uncertain authority.

Approval is bound to the exact action payload and must be revalidated immediately before execution.
