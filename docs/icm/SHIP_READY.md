# MACS Four-Bucket Commercial Engine — Ship Contract

## Canonical repository

This repository is the source of truth for the MACS commercial operating system behind Agent MAXX.

Public commercial work routes into exactly four buckets:

1. Reset
2. Momentum
3. Scale
4. Launch

No fifth public bucket may be introduced without an explicit architecture decision.

## Canonical files

- `docs/icm/MONEY_MODELS.md` — commercial operating contract
- `icm/growth-engine/SKILL.md` — four-bucket router and three-pass operating skill
- `icm/growth-engine/01_reset/SKILL.md`
- `icm/growth-engine/02_momentum/SKILL.md`
- `icm/growth-engine/03_scale/SKILL.md`
- `icm/growth-engine/04_launch/SKILL.md`
- `icm/growth-engine/boring-revenue/SKILL.md` — existing-value-first revenue systems
- `icm/growth-engine/experiments/` — evidence, tests, and decisions

## Runtime boundary

`macsdigitalmedia` is the public story, proof, and conversion surface.

`macs-agent-portal` is Stacy/team's command surface for intent, recommendations, approvals, and results.

`maxx-migrations-agentic-systems` is the canonical backend and commercial brain. The portal must call into this backend rather than duplicate money models, routing logic, or experiment history.

## Ship definition

The architecture is considered shippable when all of the following are true:

- four-bucket contract is merged into the canonical backend branch
- portal retains the same four-bucket vocabulary and does not create a competing strategy model
- website presents only Reset, Momentum, Scale, and Launch as public commercial buckets
- Agent MAXX routes growth work through `icm/growth-engine/SKILL.md`
- all public claims are evidence-backed
- pricing, guarantees, spend, public claims, contracts, publishing customer assets, and consequential outbound remain human-gated
- experiment records use real data and end in `kill / keep / improve / scale`
- existing cash, leads, inbound demand, and conversion leaks are checked before new acquisition spend

## First Client Zero sequence

Use MACS itself before broad selling:

1. Baseline one measurable commercial constraint.
2. Route it to Reset, Momentum, Scale, or Launch.
3. Choose the smallest money-facing intervention.
4. Demo it internally.
5. Run a controlled pilot.
6. Record owner time, leads, qualified opportunities, sales, revenue/profit when available, and time to first useful result.
7. Decide: kill, keep, improve, or scale.
8. Only then convert the intervention into a public offer or proof story.

Default priority for boring revenue experiments:

1. overdue invoice recovery
2. lead reactivation
3. missed-call / receptionist recovery
4. speed-to-lead
5. website lead qualification
6. personalized outbound
7. content repurposing
8. inbox triage
9. integrated lead engine

## Copy doctrine

Technology is not the headline. Business outcome is.

Default Scale line:

`The idea is working. Grow without complexity.`

Default primary CTA:

`Tell us what's important.`

Use concrete business consequences before mechanism language. Hide AI, agentic, orchestration, model, automation-stack, MCP, RAG, API, vector, and workflow-engine terminology unless the mechanism itself is necessary to the buyer's decision.

## Release blockers vs repository noise

A release blocker is a failure caused by this architecture or by its runtime integration.

A repository-wide formatting or workflow failure that is reproducible on the unchanged base branch must be tracked separately and must not be misrepresented as a failure of the four-bucket architecture. It still needs remediation before enforcing a fully-green repository release gate.

The `Documentation Required` workflow currently reports `Pull Request Not Found` from its own helper. The repository-wide linter also modifies pre-existing harness files and `app.py` when run with `pre-commit --all-files`. These are repository CI hygiene issues, not failures in the commercial architecture files. Do not call the backend release fully green until those checks are repaired or explicitly waived by the repository owner.

## Ownership rule

The operating model belongs here. Public presentation belongs in `macsdigitalmedia`. Stacy's working interface belongs in `macs-agent-portal`.

Do not copy the commercial brain into either frontend repository.
