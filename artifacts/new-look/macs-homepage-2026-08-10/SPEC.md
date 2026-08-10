# MACS New Look — Homepage Funnel Spec

Status: prototype specification only. No production landing-page components changed.
Date: 2026-08-10
Branch: `design/macs-new-look-funnel`

## Outcome

Turn the current multi-section marketing site into a single commercial funnel:

`recognize business pain → see proof → understand the system → start paid Vibe Audit → conversational intake → audit recommendation → choose next commercial path`

The homepage sells one thing: **the Vibe Audit**.

## Brownfield truth

The current homepage composes 15 marketing sections before the footer. The current nav asks visitors to choose between How It Works, Features, Pricing, App, and the Migration Audit CTA. The current pricing surface offers three separate tiers before diagnosis. The current “proof” panel lists representative organization types rather than evidence-backed case studies.

Do not rebuild those sections with nicer colors. Reduce them.

## Source design rules

### New Look
- Human states outcome → system gathers missing context → system selects tools → human sees proof and consequential decisions.
- One dominant next action.
- 3–5 starter choices maximum.
- Progressive disclosure.
- Preserve capability; hide complexity rather than deleting it.

### ADHD gate
- Lead with the next action.
- Do not make the visitor remember hidden state.
- One bounded question at a time.
- Make progress and completed wins visible.
- Remove unnecessary navigation and choice.

### Emil / Apple gate
- Immediate input feedback.
- Calm hierarchy.
- Precise typography and spacing.
- Motion only for hierarchy, orientation, or feedback.
- UI motion under 300ms and interruptible where relevant.
- Respect reduced motion.

### Gauntlet bar
The named, fetchable, comparable bar is the current COLLINS website (`wearecollins.com`) and its case-study presentation. The goal is not to imitate its visual identity. The comparison is on hierarchy, restraint, editorial confidence, whitespace, program clarity, and proof presentation.

Gauntlet status: bar selected; independent blind critic pass is NOT claimed in this environment.

## ABAC current → target

The uploaded New Look package defines ABAC as Attention, Burden, Agency, Clarity.

| Dimension | Current | Target | Change |
|---|---:|---:|---|
| Attention | 5 | 9 | one dominant paid entry point |
| Burden | 8 | 2 | 15 marketing sections → 7 bounded sections |
| Agency | 6 | 9 | explicit ownership, approvals, no-lock-in next steps |
| Clarity | 5 | 9 | outcome → audit → recommendation → optional build |

Target composite: `(9 + (10-2) + 9 + 9) / 4 = 8.75`.

No authoritative “AVH speed scale” was found in the uploaded New Look package or referenced public source repos. Do not invent one. If AVH is a separate owner rubric, add it when its source is supplied.

## Visual direction

Use existing MACS type foundations where possible rather than creating another design system.

- 70% warm white / generous negative space.
- 20% ink / charcoal typography and occasional dark proof section.
- 10% existing forest-green brand accent.
- No gradients as identity.
- No glassmorphism.
- No feature-card wall.
- No pill-shaped everything.
- No fake logo wall, fake testimonials, or decorative dashboard screenshots as proof.
- Large editorial serif headlines; restrained sans-serif utility text.
- Desktop section spacing roughly 120–160px; mobile 72–96px.
- Full-width or large-format project imagery when real assets exist.

## Navigation

Public navigation maximum:

- Work
- System
- About
- **Start the $497 Audit**

Remove Features and Pricing as primary navigation choices. Detailed capabilities and pricing become progressive disclosure after the visitor understands the commercial path.

## Recommended homepage wireframe

### 01 — Hero / one action

Eyebrow:
`BUSINESS SYSTEMS, NOT MORE SOFTWARE`

Headline:
`Find what’s costing you money. Fix the system behind it.`

Body:
`We inspect how your website, tools, leads, data and daily work actually fit together. Then we show you the highest-value fix before we recommend another build.`

Primary CTA:
`Start the $497 Vibe Audit`

Secondary text link:
`See Client Zero`

Optional conversational command field:
`What is the biggest thing slowing your business down?`

Starter choices (maximum three):
- Leads fall through
- Too many tools
- Manual follow-up

The command field begins the conversational pre-intake. It must not expose the full 116-question intake at once.

### 02 — Programs / offer ladder

Headline:
`Diagnose first. Build only what earns its place.`

1. **Vibe Audit — $497**
   - Map business, current stack, customer flow and operating friction.
   - Rank lost revenue, wasted time and risk.
   - Deliver the recommended next move and proof contract.
   - This is the only homepage purchase decision.

2. **Vibe Rescue Sprint — after audit**
   - Fix the single highest-value bounded bottleneck.
   - Fixed scope and measurable proof.

3. **Sovereign Launch — scoped proposal**
   - Build the deeper owner-controlled system only when the audit proves it is justified.
   - Website, CRM, context, automation and integrations are implementation ingredients, not the product promise.

4. **MAXX Operations — optional**
   - Ongoing optimization, agents, automations, monitoring and operating support.
   - Never required for the client to retain their system or export their context.

### 03 — Case Study / Client Zero

Use one real case study rather than a fake client wall.

Title:
`MACS had the same problem we sell against.`

Story:
`Too much interface, too much offer language, and no durable company-intake operating layer. We reduced the problem into one verified onboarding system before expanding the product.`

Evidence currently safe to show:
- 116 structured intake questions.
- 83 required decision points.
- ICM company-brain structure.
- approval-gated action implementation.
- Vercel and CodeRabbit build checks green.

Required caveat:
`Live Supabase tenant-isolation and approval receipts remain a separate release gate.`

Do not convert unproven runtime behavior into marketing proof.

### 04 — What we actually build

Headline:
`Systems your business can use and own.`

Four outcome groups:

**Get customers**
Capture, qualify, route and follow up with leads without losing them between tools.

**Run the work**
Intake, CRM, workflows, approvals and operating context that reflect how the company actually works.

**Use AI safely**
Agents inspect, summarize and act only inside explicit authority instead of operating as an unbounded black box.

**Keep control**
Code, data, domains, credentials, context and export paths remain under owner control wherever technically and contractually practical.

### 05 — Fit / disqualify

Headline:
`For owners with a real operating problem. Not people shopping for an AI toy.`

Good fit:
- leads, time or visibility are being lost between tools;
- the team repeats manual work every week;
- AI is desired but requires human control and evidence;
- the owner wants control of the delivered system.

Not a fit:
- generic chatbot with no measurable business outcome;
- replacement of working systems without diagnosis;
- automation designed to bypass approvals or ownership;
- refusal to let the audit inspect the real workflow.

### 06 — What happens after the click

Headline:
`You tell us the outcome. We do the investigation.`

1. Tell us what is wrong — one question at a time.
2. We inspect — facts are discovered from evidence when possible.
3. You get the audit — score, bottleneck, recommended fix, proof, ownership and rollback map.
4. You choose — Rescue Sprint, Sovereign Launch, Operations, or take the audit and execute elsewhere.

### 07 — Final CTA

Headline:
`Before we build you anything, let’s find out what is actually worth fixing.`

CTA:
`Start the $497 Vibe Audit`

## User journey

### New visitor

`traffic/referral → hero understands problem → proof establishes credibility → offer path explains relationship → visitor starts $497 audit → conversational pre-intake → checkout / scheduling → Stage 00 intake continues → audit delivered → next recommendation`

### Returning client

`login → approvals / current work / proof first → chat for new outcomes → agent plans → human approves consequential action → receipt / result`

The returning-client interface is a different product surface from the marketing homepage. Do not force the public site to look like the operator dashboard.

## Five New Look directions

1. **Conversation OS — recommended**: editorial marketing page + single conversational outcome field + proof funnel.
2. **Outcome Command**: near-minimal page where the outcome command is the hero and the rest is progressive disclosure.
3. **Guided Grill**: homepage starts immediately with one high-leverage audit question and moves one question at a time.
4. **Approval First**: best for the authenticated returning-client portal, not public acquisition.
5. **Ambient Voice**: experimental mobile intake where voice/type is almost the entire interface until results exist.

## Conversion events to instrument

- `audit_cta_view`
- `audit_cta_click`
- `preintake_started`
- `preintake_completed`
- `audit_checkout_started`
- `audit_purchased`
- `audit_delivered`
- `next_offer_selected`

Do not optimize vanity traffic before measuring the paid-audit conversion path.

## Implementation boundary

Do not modify the production homepage until the owner chooses the winning prototype direction.

After approval:
1. remove obsolete landing sections rather than leaving hidden duplicates;
2. rebuild homepage as the seven-section funnel;
3. connect CTA to conversational pre-intake / Stage 00 persistence;
4. add real Client Zero case-study page;
5. run responsive, accessibility, copy, animation and Gauntlet review before merge.
