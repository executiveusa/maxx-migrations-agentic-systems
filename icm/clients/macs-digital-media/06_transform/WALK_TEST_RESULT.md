# MACS Transformation Walk Test Result

Date: 2026-09-01
Mode: cold repository-only traversal; no prior chat state used by the test contract
Result: PASS — corrected structural portability gate

## Correction verified before rerun

The first review identified that the router originally named sibling phase folders as if they were children of `00_router/`. That was a legitimate failure for a literal memoryless traversal. The router now declares paths relative to itself and every phase resolves through `../<phase>/CONTEXT.md`. The rerun treats route resolution itself as a required assertion: an agent may not guess or search for a similar folder when a declared path fails.

## Cold-walk answers

1. Eight phases: `TRUTH → POSITION → ARCHITECT → PROVE → DESIGN → BUILD → GAUNTLET → LEARN`.
2. Immediate visual design or coding is refused. The router requires phases 1–4 complete/evidenced before Design and explicitly blocks Build until the Design exit condition and human/authority check are satisfied.
3. POSITION owns the business/customer/offer frame, desired position, trust promise, what is sold, and what remains invisible internal leverage.
4. ARCHITECT owns sitemap, journeys, hierarchy, wireframes, CTA hierarchy, and page-template contracts.
5. PROVE maps claims to real assets/evidence, records provenance/permission, and classifies material as `PROVEN / NEEDS VERIFICATION / DO NOT CLAIM` so placeholder or invented proof cannot become a design input.
6. DESIGN establishes the visual and interaction system: palette, typography, grid, spacing, imagery/media rules, navigation, responsive rules, motion and reduced-motion behavior.
7. BUILD preserves validated forms, SEO, analytics, APIs, accessibility, auth, webhooks, localization, and other working brownfield capabilities unless an explicit approved decision replaces them.
8. GAUNTLET requires a named, fetchable, comparable quality bar and judges real rendered output against the real reference at equivalent viewports; memory or a verbal description is insufficient.
9. No. The builder cannot approve its own release; owner/architect acceptance is required.
10. If a route fails to resolve or repository evidence does not reveal the current phase/missing output, return `ROUTING INCOMPLETE` and stop rather than guess or use chat history.
11. Production completion requires build/deployment/runtime and critical-journey evidence, accessibility/route/form/API verification as applicable, a rollback reference, and the appropriate owner approval.
12. The reusable protocol remains under `icm/site-transformation-protocol/`; client-specific truth, decisions, evidence, state and approvals live under `icm/clients/<client>/`.

## Literal evidence paths traversed

Entrypoint and test:
- `AGENTS.md`
- `icm/site-transformation-protocol/00_router/CONTEXT.md`
- `icm/site-transformation-protocol/WALK_TEST.md`

Phase contracts reached only through the router's declared relative paths:
- `icm/site-transformation-protocol/01_truth/CONTEXT.md`
- `icm/site-transformation-protocol/02_position/CONTEXT.md`
- `icm/site-transformation-protocol/03_architect/CONTEXT.md`
- `icm/site-transformation-protocol/04_prove/CONTEXT.md`
- `icm/site-transformation-protocol/05_design/CONTEXT.md`
- `icm/site-transformation-protocol/06_build/CONTEXT.md`
- `icm/site-transformation-protocol/07_gauntlet/CONTEXT.md`
- `icm/site-transformation-protocol/08_learn/CONTEXT.md`

Client state check:
- `icm/clients/macs-digital-media/06_transform/CONTEXT.md`
- `icm/clients/macs-digital-media/06_transform/ASSET_MANIFEST.md`
- `icm/clients/macs-digital-media/06_transform/DESIGN_GATE.md`

## What this proves

A competent repository-reading agent can cold-route the transformation workflow from committed instructions without hidden conversation state, can identify mandatory stage boundaries, and is forced to stop on missing routing evidence rather than improvise a workflow.

## What this does not prove

It does not prove that literally every possible language model is competent or compliant. The enforceable rule is therefore: **every agent, regardless of vendor/model, must independently pass this same cold walk before receiving transformation write authority.** A failed agent loses write authority; the protocol is not weakened for the agent.

## MACS current consequence

The corrected walk-test gate is PASS. Phase 04 minimum proof is separately recorded. Owner approval in the 2026-09-01 design directive authorizes entry into Phase 05 Design and creation of the next prototype. Phase 06 broad implementation remains gated on explicit selection/approval of a Phase 05 visual territory.