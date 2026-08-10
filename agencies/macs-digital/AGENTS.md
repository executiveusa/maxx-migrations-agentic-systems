# AGENTS.md — Macs Digital Media

## Purpose

Macs Digital Media is the commercial front door for the MAXX sovereign business-system offer. It serves nontechnical organizations by diagnosing the operating bottleneck first, then installing only the digital systems and supervised AI workflows that earn their place.

The customer is **not buying AI**. The customer is buying a better-running, owner-controlled business.

## Owner

- Stacy McSwain

## Offer 01 — The Sovereign Business System

Current commercial promise:

> MACS spends 90 days learning the business, fixing digital bottlenecks that cost time or money, installing an owner-controlled business system, and handing over the keys.

Delivery path:

1. audit / diagnosis;
2. 90-day adaptive implementation partnership;
3. sovereign key handoff;
4. optional ongoing MAXX Operations.

Do not prescribe a CRM replacement, website rebuild, AI agent, automation bundle, grant system, social stack, or migration until diagnosis shows it creates value.

## Initial target market

Commercial starting niche:

- sports and basketball programs;
- coaches, mentors, youth programs, and community organizations;
- minority-owned small businesses;
- adjacent nontechnical small businesses that need stronger lead, customer, marketing, funding, or operating systems.

The underlying system is not limited to those segments.

## Canonical ICM route

Start with:

- `icm/clients/macs-digital-media/CONTEXT.md`
- `docs/MACS_BUSINESS_INTAKE_SOP.md`
- `skills/maxx-business-intake/SKILL.md`

ICM is the orientation/context layer. Structured operational records remain in their authoritative CRM/database/file systems. Do not turn Markdown into a shadow CRM.

## Client Zero outcome

The current bounded objective is to prove:

`durable intake → ICM normalization → isolated tenant context → approval-gated action → evidence → export/rollback`

The first workflow is a MACS business intake submission that becomes durable tenant-scoped context, then proposes one benign CRM write. One proposal must be rejectable with zero side effect; one must execute exactly once after explicit approval; both must create evidence.

## Sovereignty rules

- The client retains owner control of delivered code, data, domains, hosting, credentials, exports, and client-specific context wherever technically and contractually practical.
- Reusable templates, policies, adapters, verification patterns, and generic logic may be shared.
- Private client records, credentials, conversations, customer lists, and proprietary content may never cross tenants.
- Company context must remain portable and usable with another capable model/agent later.
- Secrets are referenced through approved secret-management mechanisms; never copy them into prompts, ICM files, client-side code, or repository documentation.

## AI authority

Agents may inspect, retrieve, classify, summarize, compare, draft, and propose within their authorized read scope.

Until narrower authority is independently proven and explicitly approved, human approval is required before consequential:

- writes;
- external sends;
- public publishing;
- deletion or destructive changes;
- spending, refunds, invoices, or other financial commitments;
- credential or permission changes;
- production/deployment changes;
- legal commitments;
- canonical policy changes.

An agent may not approve its own proposal or release.

## Abstention / escalation

Do not act when:

- tenant identity is uncertain;
- relevant context is missing or contradictory;
- the source of truth is unresolved;
- evidence is stale for the decision being made;
- requested authority is absent;
- a consequential action lacks approval;
- rollback is unavailable;
- the result cannot be verified.

## Architecture truth

- `maxx_organizations` includes slug `macs-digital-media`, plan `sovereign_install`.
- The intended architecture is tenant-isolated access across `maxx_` data.
- **Do not claim production tenant isolation is proven yet.** The current Client Zero proof requires a two-tenant authenticated RLS test and removal of critical-route dependence on service-role/demo-org selection.
- **Do not claim approval gates are enforced yet** until a test proves zero side effect before approval, no side effect after rejection, and exactly-once execution after approval.
- **Do not claim public audit intake is durable yet** until the submitted record survives restart/cold start and can be retrieved/exported from the owner-controlled database.

## Current product truth / sales guardrails

Allowed now:

- human-led diagnosis before prescription;
- owner-control / sovereignty as the design requirement;
- business-context organization and cold-walk documentation;
- bounded implementation work whose result is verified before stronger claims are made.

Not yet proven as a production guarantee:

- autonomous grant application submission;
- browser/computer-use operations;
- live Postiz-based social operations;
- enforced approval-gated agent writes;
- proven production tenant isolation;
- durable public audit persistence;
- white-label provisioning/export until the Client Zero export path is demonstrated.

## Verification

Repository gate: `npm run verify:full` plus Client Zero evidence.

Client Zero release requires:

1. intake survives restart/cold start;
2. two-tenant RLS test rejects cross-tenant reads and writes;
3. write proposal creates zero side effect before approval;
4. rejection creates zero side effect;
5. approval executes exactly once and creates an audit record;
6. customer context/data can be exported without continued MACS subscription;
7. rollback is documented and rehearsed;
8. a memoryless agent can cold-walk this business and identify the next action.

## Handoff

A handoff passes only when another capable human or agent with no chat history can answer:

- Where am I?
- What is MACS selling?
- Who is it for?
- What is verified vs. planned?
- What requires human approval?
- What is authoritative?
- What is unknown?
- What is the current bounded workflow?
- What evidence proves status?
- What is the next action?
- How do I roll back?
