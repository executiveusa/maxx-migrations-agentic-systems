# Agent-First GHL Replacement — Master Spec
> Version 1.0 · July 2026 · Model: claude-sonnet-5

## The One-Sentence Vision
A sovereign CRM where users talk or type in plain English and an AI agent handles every menu, filter, form, and send — so easy a grandma can use it, so capable it replaces GoHighLevel.

---

## Current State (Honest Audit)

| Dimension | Score | Target |
|-----------|-------|--------|
| Design | 8/10 | 9.5 |
| Copy | 8.5/10 | 9 |
| Usability | 7/10 | 9.5 |
| GHL Feature Parity | 3/10 | 8 |
| Agent AI | 0/10 | 10 |
| Voice Control | 0/10 | 9 |

**Root problem:** Every module runs on mock data. No client can log in, save data, or send a real message.

---

## Strategic Position vs GoHighLevel

GHL's weakness: 300 features buried behind a UI that requires a certified consultant.  
Our advantage: the agent knows all 300 features. The user knows one thing — how to ask.

**The sale that closes:**
- GHL Pro: $297/mo × 24 months = **$7,128 spent. Data locked in GHL forever.**
- Maxx Sovereign Install: **$6,000 once. Own the code. Own the data. AI included.**

---

## Agent-First Architecture

The agent is NOT a chatbot bolted onto a CRM. The CRM is the agent's memory and tool library. The UI is a confirmation and dashboard surface, not the primary control plane.

### Agent Tool Suite

| Tool | Permission | Human Approval? |
|------|-----------|----------------|
| search_contacts(query) | read | No |
| get_pipeline_summary() | read | No |
| get_metrics(period) | read | No |
| create_contact(data) | write | Yes — preview card |
| move_opportunity(id, stage) | write | Yes |
| send_sms(to, body) | send | Yes — shows preview |
| send_email(to, subject, body) | send | Yes |
| schedule_post(platforms, content, time) | publish | Yes |
| create_workflow(definition) | write | Yes + dry-run |
| run_workflow(id) | execute | Always |
| delete_contact(id) | delete | Always + 30s undo |

**Non-negotiable:** Any write, send, publish, or delete shows a confirmation card before executing. The agent proposes. The human approves.

---

## Model Selection

| Task | Model | Rationale |
|------|-------|-----------|
| Voice real-time queries | claude-haiku-4-5-20251001 | < 500ms latency, ~$0.0003/query |
| Complex CRM operations | claude-sonnet-5 | Best tool use, reasoning |
| Background workers/batch | claude-haiku-4-5-20251001 | Cost-efficient at scale |
| Migration agent | claude-sonnet-5 | Quality matters, long context |

**Routing rule:** All model calls go through `/api/agent/chat`, which inspects intent and picks the model. Never hardcode model names in components.

**Cost sanity check:** 100 orgs × 50 queries/day = ~$0.63/org/month in API costs. Price AI into every tier at 10×.

---

## Voice Control Layer

Stack (latency ladder):
1. **STT:** Web Speech API (Phase 1–2) → Deepgram Nova-3 streaming (Phase 3+) — target < 200ms
2. **Agent:** claude-haiku-4-5 for simple / claude-sonnet-5 for complex — target < 800ms
3. **TTS:** Browser SpeechSynthesis (Phase 1–2) → Cartesia Sonic streaming (Phase 3+) — target < 300ms first word
4. **Total round trip target: < 1.5 seconds**

### Voice UX Rules (non-negotiable)
- Push-to-talk button: bottom-right corner, every page, always visible
- Visual waveform when listening — user must know mic is on
- Agent reads back what it understood before acting
- One-word cancel: "Stop" or "Cancel"
- Voice always falls through to text agent if speech fails
- Voice is additive — never remove a menu because voice exists

---

## Steve Krug "Don't Make Me Think" Principles

1. **One primary action per screen.** Dashboard → "Start a migration". Contacts → "Add contact". Never two equal-weight CTAs.
2. **Name things what they are.** "Pipeline" → "Active Deals". "Opportunity" → "Deal". "Workflow trigger" → "When this happens..."
3. **Agent = the universal escape hatch.** Lost? Confused? Talk to the agent. Always visible, always works.
4. **Errors teach, not apologize.** "Couldn't send SMS — Twilio isn't connected. → Open Integrations"
5. **5 nav items maximum visible.** Dashboard · Deals · Contacts · Messages · Automations · ··· More
6. **Progressive disclosure.** Simple by default. "Advanced options" behind a toggle.
7. **Grandma mode by default.** Text ≥ 14px. Touch targets ≥ 44×44px. Color is never the only indicator.
8. **Confirmation before consequence.** Show what will happen, not "are you sure?"

---

## 16-Week Roadmap

### Phase 1 (Weeks 1–4): The Real Backend
**Gate: A real person can sign up, add a contact, and create a deal. Two accounts cannot see each other's data. App is live on Vercel.**

- [ ] Supabase schema deploy: contacts, pipeline, workflows, orgs
- [ ] RLS on all tables + pgTAP isolation tests
- [ ] Supabase Auth (magic link)
- [ ] Real Contacts CRUD
- [ ] Real Pipeline CRUD
- [ ] Fix Vercel deployment (Root Directory → apps/maxx-web)
- [ ] Demo org seeded for sales calls

### Phase 2 (Weeks 5–8): The Agent Brain
**Gate: User types "show me all leads from last week" and gets real results. A workflow fires and sends a real email.**

- [ ] Agent chat panel (persistent, right side, every page)
- [ ] Streaming via Anthropic API (Haiku/Sonnet routing)
- [ ] Tool suite: search_contacts, get_pipeline, create_contact, move_deal
- [ ] Human-in-the-loop confirmation cards
- [ ] Conversation history (20 turns, Supabase)
- [ ] Real workflow triggers (pg_cron + Edge Functions)
- [ ] Transactional email via Resend

### Phase 3 (Weeks 9–12): Voice + Real Integrations
**Gate: User speaks a command and a real SMS lands on a real phone. A real social post goes live.**

- [ ] Voice input via Web Speech API (push-to-talk, waveform UI)
- [ ] Real Twilio SMS (two-way)
- [ ] Unified conversation inbox (SMS + email threads)
- [ ] Missed call → agent drafts text-back → human approves
- [ ] Real Postiz social publishing (OAuth + schedule)
- [ ] Email campaigns via Resend sequences

### Phase 4 (Weeks 13–16): Polish + Revenue-Ready
**Gate: First paying client successfully onboarded in under 10 minutes with zero training.**

- [ ] Deepgram Nova-3 + Cartesia Sonic voice upgrade
- [ ] Cal.com calendar/booking integration
- [ ] Stripe payments (invoices + subscriptions)
- [ ] Agency whitelabel (custom domain + logo per org)
- [ ] Mobile PWA (installable + push notifications)
- [ ] 5-step onboarding flow (grandma-tested)
- [ ] Full Krug usability test with 5 real outsiders

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Next.js 14 App Router | Keep what's built |
| Database | Supabase Postgres + RLS | Auth + realtime + schema |
| Auth | Supabase Auth magic link | No password = lower friction |
| AI Agent | Anthropic SDK (Haiku + Sonnet) | Best tool use + streaming |
| SMS | Twilio Conversations | Two-way + MMS + webhooks |
| Email | Resend + React Email | Modern API + templates |
| Voice STT | Web Speech API → Deepgram | Ship free, upgrade with revenue |
| Voice TTS | Browser SpeechSynthesis → Cartesia | Same pattern |
| Social | Postiz | Already wired, open source |
| Payments | Stripe | Subscriptions + invoices |
| Calendar | Cal.com API | Open source, no per-booking fees |
| Deployment | Vercel + Supabase | Already configured |
| Background jobs | Supabase pg_cron + Edge Functions | No extra infra |

---

## Revenue Model

| Tier | Price | Margin |
|------|-------|--------|
| Migration Audit | $497 one-time | ~90% |
| Sovereign Install | $4,800–$8,000 one-time | ~70% |
| AI Technology Partner | $12,000+ install + $1,500/mo | ~75% install, ~80% retainer |
| Agency License (future) | $500/mo per sub-account | ~85% |

---

## Risk Register

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Agent gives wrong CRM data | Critical | All reads return source (table + id). No summarized numbers without source query. |
| Agent sends SMS to wrong contact | Critical | Every send requires explicit approval. Show recipient + full message preview. 30s undo. |
| Voice mishear causes unintended action | Critical | Agent reads back what it understood. All writes require confirmation. Voice never executes directly. |
| AI cost spiral | High | Per-org monthly budget cap. Alert at 80%. Route simple queries to Haiku. Log every API call. |
| RLS misconfiguration leaks data | Critical | pgTAP tests prove isolation with 2+ org IDs before every deploy. |
| Client can't figure out voice | High | Voice is additive. Every voice command has identical text path. Never remove a menu. |
| Scope creep delays Phase 1 | High | Phase 1 = exactly 7 items. Nothing else. No exceptions. |

---

## First 7 Days

**Day 7 target: Live URL, real auth, one real contact saved to a real database.**

- Days 1–2: Supabase schema migrations + RLS tests
- Days 3–4: Magic link auth + session middleware on /app/* routes
- Days 5–6: Fix Vercel deployment + production env vars
- Day 7: Log in as demo user, add a contact, confirm it saves to Supabase

---

*The Phase 1 PR is the most important commit. Everything before it is a demo. Everything after it is a product.*
