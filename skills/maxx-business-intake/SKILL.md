---
name: maxx-business-intake
description: Onboard a company into a portable ICM client brain, map its ontology and workflows, define AI authority, and produce a bounded proof plan before implementation.
disable-model-invocation: false
---

# MAXX Business Intake Skill

## Invocation
Use when onboarding a new organization, auditing an existing client, creating a company brain, or preparing an AI/automation implementation.

## Required behavior

1. Start in `00_engagement_lock`.
2. Build a design tree and maintain a current frontier.
3. Use `DISCOVER` for facts obtainable from the environment; inspect them yourself.
4. Use `ASK` only for decisions, priorities, exceptions, authority, sensitive context or ambiguity that cannot be resolved from evidence.
5. Never silently fill material unknowns.
6. Normalize accepted information into the client's ICM workspace.
7. Keep operational records in their authoritative systems; ICM stores routing/context/policies/provenance and pointers.
8. Build the ontology seed: entities, relationships, states, events, policies, evidence and governed metrics.
9. Score candidate workflows and select one bounded first workflow.
10. Define read/draft/write/send/publish/spend/delete/approve/abstain authority before tool execution.
11. Define proof and rollback before build.
12. Do not begin implementation until the human confirms the design tree has no material open frontier.
13. Agents may propose learning candidates but may not self-approve canonical knowledge or policy changes.

## Stage order

00_engagement_lock
01_business_model
02_customer_journey
03_people_tribal_knowledge
04_systems_data
05_company_brain_ontology
06_workflow_discovery
07_ai_authority_risk
08_brand_communications
09_security_sovereignty
10_proof_operations

## Required final package

- CONTEXT.md
- identity/
- people/
- customers/
- offer/
- operations/
- data-ownership/
- workflows/
- decisions/
- evidence/
- proof/
- working-state/
- intake.json
- unresolved.md
- release-readiness.md

## Stop conditions

Stop and escalate when:
- tenant/client identity is uncertain;
- source-of-truth conflicts are unresolved;
- sensitive data policy is unknown;
- consequential action lacks authority;
- rollback is absent;
- proof cannot be observed;
- owner control is unclear;
- implementation is replacing sales/diagnosis without a verified economic outcome.
