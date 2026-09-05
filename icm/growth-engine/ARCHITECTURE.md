# Four-Bucket Growth Architecture

## Canonical boundary

There is one commercial decision system and three surfaces:

1. **Public site — `executiveusa/macsdigitalmedia`**
   - explains MACS
   - routes every offer/case study into Reset, Momentum, Scale, or Launch
   - presents approved proof
   - converts interest into one clear next action
   - stores no private client strategy or experiment history

2. **Agent MAXX portal — `executiveusa/macs-agent-portal`**
   - Stacy/team command surface
   - captures intent, client context, approvals, experiment review, and evidence
   - calls the backend for durable commercial logic and records
   - does not fork or duplicate the canonical growth models

3. **MAXX Migrations backend — this repository**
   - canonical private ICM and commercial reasoning authority
   - owns four-bucket routing, money models, experiment protocol, durable client context, approvals, and reusable skills
   - exposes approved capabilities to the portal through existing backend/API boundaries

## Request flow

`Owner intent -> Portal -> Backend ICM/router -> Bucket skill -> Experiment/proposal -> Human gate when consequential -> Execution -> Evidence -> Decision -> Approved public proof/site update`

The owner should not have to translate between systems. The portal is the interaction layer; the backend preserves context and decision rules.

## Four-bucket router

Every commercial task gets exactly one primary bucket at a time:

| Condition | Bucket | First commercial question |
| --- | --- | --- |
| Existing value is leaking | Reset | What is closest to lost action, money, trust, or owner time? |
| Offer works but demand is inconsistent | Momentum | What existing path can create more qualified attention most economically? |
| Idea works but capacity/complexity is rising | Scale | What must become repeatable so output can grow without proportional owner effort? |
| New thing needs market proof | Launch | What is the smallest credible test of willingness to act or pay? |

Internal products, tools, labs, and `Client Zero` are evidence or capabilities, not public fifth buckets.

## Shared decision object

All future API/database representations should be able to carry this minimum shape:

```text
client_id
bucket
current_condition
desired_outcome
primary_metric
primary_cta
commercial_value
proof_state
experiment_id
approval_state
next_action
```

Do not introduce a new database schema merely to satisfy this document. Map this shape onto existing durable entities first, then migrate only when a real integration requires it.

## Experiment state machine

`PROPOSED -> APPROVED -> RUNNING -> COMPLETE -> KILL | KEEP | IMPROVE | SCALE`

Consequential execution can be prepared before approval but cannot cross the existing human authority gate without a matching persisted approval.

## Data rule

The experiment lab starts as durable ICM Markdown because it is inspectable, portable, versioned, and immediately usable by agents. When the portal needs live filtering, dashboards, or multi-user edits, move the same contract behind the backend's durable data/API layer without changing the four-bucket semantics.

## Public-language rule

The public site talks about the outcome. Technical mechanisms appear only when they materially help a buyer decide or when the page is explicitly a technical/product-detail surface.

Default vocabulary:

- result
- system
- process
- follow-through
- ownership
- less to manage
- faster useful result
- repeatable

Avoid leading with:

- AI
- agentic
- model
- orchestration
- automation stack
- MCP
- RAG
- architecture jargon

## Release gate

The architecture is ready for a public release only when:

- backend has the canonical four-bucket skills and money model
- portal points to the backend as authority rather than duplicating it
- public site has exactly four commercial buckets
- public proof is mapped to those buckets
- no unsupported claims are presented as proof
- experiment records have a repeatable template
- owner approval boundaries remain intact
- build/CI/deployment evidence is green for every changed runtime repo
