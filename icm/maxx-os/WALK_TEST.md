# MAXX OS Walk Test

Status: TESTED on branch `codex/icm-max-simple-architecture-2026-09-29`
Date: 2026-09-29

Purpose: prove a cold human or agent can use the one MAXX ICM grammar before merge.

## Universal grammar

`01_orient -> 02_plan -> 03_work -> 04_verify -> 05_release -> 06_learn`

## Structural checks

PASS:
- root `CONTEXT.md` exists;
- all six stage contracts exist;
- all five shared policy files exist;
- federation, growth, site-transformation and MAXX-suite routers resolve;
- Agent MAXX local `AGENTS.md` and `CONTEXT.md` resolve;
- MACS local `AGENTS.md` and `CONTEXT.md` resolve;
- no runtime folders were renamed;
- no production code was changed by this architecture alignment.

## Scenario A — improve MACS homepage copy

Cold route:

1. `macsdigitalmedia/AGENTS.md`
2. `macsdigitalmedia/CONTEXT.md`
3. canonical MAXX `CONTEXT.md`
4. `icm/maxx-os/01_orient/CONTEXT.md`
5. because this is a site change, load `icm/site-transformation-protocol/00_router/CONTEXT.md`
6. continue through plan -> work -> verify -> release -> learn.

Expected owner:
- public copy/presentation: `macsdigitalmedia`
- canonical operating rules: MAXX Migrations.

Result: PASS.

## Scenario B — Stacy asks Agent MAXX to perform work

Cold route:

1. `macs-agent-portal/AGENTS.md`
2. `macs-agent-portal/CONTEXT.md`
3. canonical MAXX `CONTEXT.md`
4. `01_orient`
5. load only the needed Agent MAXX capability shelf and canonical context;
6. execute through the control plane; stop at real human authority gates; return proof.

Expected owner:
- Stacy conversation/auth/approvals: Agent MAXX portal/control plane;
- durable business truth/execution contracts: MAXX Migrations.

Result: PASS.

## Scenario C — new product or integration idea

Cold route:

1. canonical `AGENTS.md`
2. canonical `CONTEXT.md`
3. `01_orient`
4. route product decision through `icm/maxx-suite/00_router/CONTEXT.md`
5. plan only after the product gate;
6. verify before release.

Result: PASS.

## Scenario D — commercial/growth request

Cold route:

1. canonical `CONTEXT.md`
2. `01_orient`
3. load `icm/growth-engine/SKILL.md`
4. classify through existing commercial rules;
5. return to the universal plan/work/verify/release/learn sequence.

Result: PASS.

## Safety checks

PASS:
- human authority gates remain in force;
- secrets remain outside ICM;
- customer isolation remains in force;
- evidence states remain `PROPOSED -> BUILT -> TESTED -> VERIFIED -> ADOPTED -> VALUABLE`;
- rollback remains required;
- a specialized protocol cannot override the Human ↔ Machine Contract.

## Merge dependency

Merge order is mandatory:

1. `maxx-migrations-agentic-systems` PR #35 first.
2. Confirm `CONTEXT.md` and `icm/maxx-os/` exist on `develop`.
3. Then merge Agent MAXX PR #96.
4. Then merge MACS PR #50.

Do not merge #96 or #50 first because both point to the new canonical root map.

## CI / preview observation

At test time:
- canonical backend branch: Vercel checks PASS; CodeRabbit PASS.
- MACS branch: Vercel PASS; Netlify preview PASS; CodeRabbit PASS.
- Agent MAXX branch: CodeRabbit PASS, but Vercel preview reports failure/blocking. One status target explicitly points to Vercel's account-deployment-blocked guidance. The architecture change only modifies `AGENTS.md` and `CONTEXT.md`; no runtime code changed.

Therefore the universal ICM architecture is structurally TESTED, but Agent MAXX deployment health must remain a separate release concern.

## Current evidence state

**TESTED**

Not yet `VERIFIED` as an adopted default-branch architecture until the ordered merges complete and a post-merge cold walk is repeated.
