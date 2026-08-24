# Revenue Capture OS — Product + Offer Contract

**Status:** canonical convergence spec
**Engine:** MAXX Migrations / `apps/maxx-web`
**Client interface:** Popebot + five-screen client cockpit
**Operator layer:** MAXX Operations / existing command-center and advanced routes

## One-sentence offer

> We connect to the business, stop good leads and customers from falling through the cracks, follow up automatically where it is safe, and show the owner what is happening and what the system actually recovered.

The client gets **one simple place to look and one AI assistant to ask**. The ERP, CRM, workflows, integrations, agents, approvals, attribution, and infrastructure stay underneath.

## What the client buys

1. **Capture** — every useful inquiry, call, message, booking, quote, and opportunity gets a durable next action.
2. **Recover** — MAXX follows up on missed calls, dormant leads, aging quotes, no-shows, reviews, referrals, and other approved leak points.
3. **Prove** — the client sees verified revenue, recovered revenue, open opportunity value, evidence, and what needs human attention.

Do not lead with websites, AI employees, CRM, ERP, automations, dashboards, agents, or models. Those are implementation details.

## Commercial path

### 1. Revenue Leak Map — $750
Find the highest-value leak, quantify the opportunity where evidence allows, and specify the first bounded repair. Credit it toward implementation when the client proceeds within 30 days.

### 2. Revenue Capture OS Launch — starting at $7,500
Connect the relevant customer journey, install the smallest production system that closes the priority leak, configure the client cockpit and Popebot, and prove the closed loop.

### 3. MAXX Operations — starting at $3,000/month
Operate, monitor, repair, tune, issue weekly recovery proof, and surface the next-largest leak. Third-party usage, telecom, and ad spend remain separate unless explicitly included.

Do not offer unlimited custom development inside the retainer.

## Client experience

The default client navigation has five destinations only:

1. **Home** — Money, Needs Attention, Ask Popebot.
2. **Money** — Value Ledger and revenue evidence.
3. **Pipeline** — only the customer journey state the owner needs to inspect.
4. **Inbox** — connected customer conversations and exceptions.
5. **Settings** — identity, team, integrations, exports, and ownership controls.

Advanced routes remain available to operators/admins and through authorized Popebot actions. Never force the client to learn system internals.

## Popebot contract

Popebot is not a generic chatbot. It is the conversational interface to tenant-scoped MAXX tools.

Popebot should answer questions such as:

- What needs me today?
- Which opportunities are going cold?
- What changed since yesterday?
- What did MAXX recover?
- Who should I call first?
- What can you handle without me?

Popebot may inspect and prepare safe work. Consequential actions require the existing persisted exact-action approval path. It must never invent business data, claim an integration is live when it is not, or convert estimated opportunity value into verified revenue.

## Value Ledger

Every material revenue claim must be one of:

- **VERIFIED** — payment, invoice, or authoritative closed-won evidence.
- **ATTRIBUTED** — strong system linkage, but not direct payment evidence.
- **ESTIMATED** — modeled opportunity value; always labeled.
- **UNKNOWN** — insufficient evidence.

Desired event path:

`attention → inquiry → response → qualified → booked → quoted → won → paid → repeat/referral`

Recovery actions should be linked to the event they repaired: missed-call text-back, reactivation, quote chase, no-show recovery, review/referral, or another approved vertical workflow.

## Architecture decision

Do **not** create a separate Revenue Capture backend or control plane.

- `executiveusa/maxx-migrations-agentic-systems` remains the customer-data, ICM, workflow, approval, evidence, and agent-tool brain.
- Existing tenant-scoped Supabase `maxx_` tables remain the source of operational CRM truth.
- Existing Agent MAXX/Popebot chat and voice surfaces become the client conversational interface.
- Existing command-center and advanced routes remain operator surfaces.
- Public acquisition/site experiences call MAXX through narrow authenticated contracts.

## ADHD/simple interaction contract

Every client-facing screen and Popebot response should follow these rules:

- put the answer or next action first;
- one dominant action per screen/state;
- use numbered bounded steps for multi-step work;
- show visible progress and completed wins;
- keep choices to five or fewer when possible;
- hide implementation detail until requested;
- use plain-language errors;
- do not add tangents, bonus tasks, or configuration work to a client flow;
- ask only for material information the system cannot safely discover itself.

This is an interaction constraint, not a claim about a user's medical state.

## First production proof

A Revenue Capture OS launch is not proven until one real tenant completes this loop:

1. a real lead enters through an approved source;
2. MAXX creates/updates the correct tenant-scoped record;
3. a response/recovery workflow runs or is safely queued;
4. the opportunity state changes;
5. the client cockpit reflects the current tenant data;
6. Popebot can explain the opportunity from authorized records;
7. a consequential action is blocked until exact approval, when applicable;
8. outcome evidence can be attached and classified correctly;
9. failure is observable and reversible;
10. the owner can export/handoff their data and configuration.

## Build priority

Do not expand the feature set until the first production proof is complete.

Priority order:

1. client cockpit reads live tenant data;
2. Popebot reads the same tenant data;
3. exact approval execution path is available to Popebot tools;
4. Value Ledger persistence and evidence references;
5. one real recovery workflow;
6. weekly recovery receipt;
7. channel adapters needed by the first paying vertical;
8. additional vertical recipes only after proof.

## Success test

The client should be able to open MAXX and answer, in under 30 seconds:

> What money is moving, what is at risk, what needs me, what did MAXX do, and what should happen next?

If the client has to understand the underlying ERP, agent stack, model routing, workflow builder, database schema, or integration plumbing to answer that question, the product has failed the simplicity test.
