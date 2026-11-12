# MACS Restaurant Growth — Public Feast/Remy Recon
Date: 2026-11-12 | Method: `replica-recon` public-state walkthrough, clean room.
This is a **functional reference map**, not an instruction to copy Feast content, visual expression, proprietary data, customer relationships, copyrighted images, code or private APIs.
Source pages and captured screenshot manifest: `../../../docs/restaurant-growth/FEAST-PUBLIC-VISUAL-EVIDENCE-2026-11-12.md`.
Canonical MACS workflow already exists at `../../../icm/growth-engine/restaurant-growth/SKILL.md`; reuse before adding.

## Scope
Original target: MACS Restaurant Revenue Proof and Creator Operations, for MACS's internal nontechnical operators, with Bunna as first gated client. App type: Next.js web, existing `apps/maxx-web` Revenue Capture OS. **Core paid user job:** plan one evidence-backed restaurant promotion, coordinate approved real creator visits and content, connect the promotion to verified payments, and present a plain-language owner result.

## Reference source ledger
| Source | URL | Kind | What it actually supports |
|---|---|---|---|
| Feast public home | https://feastalytics.com/ | Public marketing | Revenue-goal-to-campaign story, one primary action, text-message approvals |
| Remy public walkthrough | https://feastalytics.com/hire-remy | Public marketing with curated UI screenshots | Creator workflow examples and product features |
| Remy variants | https://feastalytics.com/hire-remy/influencers | Public marketing | Audience-specific language; likely same core template |
| Revenue Analyzer | https://feastalytics.com/revenue-analyzer | Public sales page | Sales analysis positioning, workflow and guarantees |
| Pricing | https://feastalytics.com/pricing | Public sales page | Segmentation between analysis, creators and managed service |
| Full service | https://feastalytics.com/full-feast-system | Public sales page | Campaign tests, revenue reporting, case study sequence |
| Data connector | https://feastalytics.com/restaurant-data-connector | Public sales page | POS-to-AI connection as standalone entry point |
| Data example | https://feastalytics.com/restaurant-data-connector/example | Public example | Illustration of a data question; not evidence MACS has source data |
| Product guide | https://feastalytics.com/product-guide | Public guidance | Help restaurant select only the needed service |
| Restaurant marketing | https://feastalytics.com/services/restaurant-marketing-agency-no-contract | Public sales | No-contract offer, case studies, objections |
| Creator UGC | https://feastalytics.com/services/ugc-for-restaurants | Public sales with product images | Multi-stage creator operations |
| MACS existing app | https://github.com/executiveusa/maxx-migrations-agentic-systems | Owned code | Revenue Capture, Popebot chat, tenant API, app styles |
| Existing MACS Restaurant Growth skill | `icm/growth-engine/restaurant-growth/SKILL.md` | Owned plan | Campaign approval, Show and Tell 3x/week, actual evidence gates |

No third-party application login or Remy private routes verified. Published screenshots can be curated or outdated; treat as **public product illustrations, not reproducible live execution**.

## Screen inventory (stable IDs)
| ID | Screen or state | Route/source | Purpose | Main components | Evidence & state |
|---|---|---|---|---|---|
| S01 | Feast public sales home | / | Sell growth service | Goal prompt, single CTA, customer proof | Actual desktop screenshot, public |
| S02 | Remy public acquisition | /hire-remy | Sell creator operations | CTA, photo montage, steps, testimonials | Actual desktop + mobile screenshots |
| S03 | Creator application list | Remy public screenshot | Review applications | Applications/Texts/Content tabs; filter; profile metrics; Approve/Deny | Published image **only** |
| S04 | Recruitment campaign status | Remy public screenshot | Manage applicant acquisition | Campaign ads, status, spend/click/app metrics, pause/edit | Published image **only** |
| S05 | Creator availability | Remy public screenshot | Define visit windows | Recurring time blocks, add/edit/remove and calendar | Published image **only** |
| S06 | Creator communications | Remy public screenshot | Handle booking/rebooking/reminders | Time-ordered messages, scheduled visit, opt-out, links | Published image **only** |
| S07 | Creative brief/program | Remy public screenshot | Align content and budget | Restaurant brief, allowed dishes, food credit, payout, follower threshold | Published image **only** |
| S08 | Pass / check-in | Remy public screenshot | Verify physical visit | Digital pass, arrival reminder, booked event | Published image **only**; actual scanner unknown |
| S09 | Content review board | Remy public screenshot | Review submissions and advertising rights | Review/approved/running-as-ads lanes, revision and compensation states | Published image **only** |
| S10 | Revenue analyzer sales page | /revenue-analyzer | Explain data insight | Benefit list, connection illustration, CTA | Actual screenshots; private analyzer UI UNKNOWN |
| S11 | Pricing and segmentation | /pricing | Compare packages | 3 offer options, included/excluded capabilities, FAQs | Actual screenshots |
| S12 | Full service sales | /full-feast-system | Explain campaign loop | Offer test history, metrics, call to action | Actual screenshots |
| S13 | POS connector sales | /restaurant-data-connector | Explain connection | POS→AI conceptual diagram, example use cases | Actual screenshots |
| S14 | Connector example | /restaurant-data-connector/example | Demonstrate sample question | Time-series comparison, math, example assistant copy | Actual screenshot, simulated example |
| S15 | Product selection guide | /product-guide | Route to right solution | Decision table and product links | Actual screenshot |
| S16 | Remy private dashboard | /login (unverified) | Operating console | **UNKNOWN** | Not inspected; do not claim parity |
| S17 | MACS public restaurant landing | /restaurant-growth | Qualify owner for Vibe Audit | Hero, one CTA, methodology, FAQs | Built in PR #42; browser visual gate still pending |
| S18 | MACS operator restaurant revenue | /app/revenue/restaurant | Read POS evidence | 7/14/30-day filter, connection/error state, payment metrics | Built in PR #42; no live source connected |
| S19 | MACS existing Popebot chat | /app | Conversational operator support | Chat messages and approval gating | Existing code; scoped tool **not runtime-wired** |
| S20 | MACS creator program | proposed /app/restaurant/creators | Manage applicants to content | Work queue + approvals + evidence | **NOT BUILT** |

### Observed components and opportunities
- Clear 3-tab creator navigation reduces operator decision complexity (S03); original MACS should keep only the action the operator must take today and a progress timeline.
- Sort/filter by application time and social metrics (S03), but follower counts are contextual indicators, **not proof of marketing outcome**.
- Recurring slots, brief, reward parameters and creator thresholds (S05/S07) are editable and separate; create only after real approved owner policy.
- Asynchronous creator messages and opt-out (S06/S08) require sender and consent compliance. MACS should show proposed messages vs sent receipts and stop on exceptions.
- Verified pass check-in (S08) and content submission (S09) are independent events. Separate application, approval, booking, actual visit, delivered footage, approved assets, actual ad run and attributable sales.
- Confirm first-party rights and license before distributing assets as paid ads.

## Core user flows
**F01 — Setup one restaurant creator program**
S18 evidence status → [MACS proposed S20 onboarding] confirm owner-approved dishes, usage license, food budget, time slots and approval owner → prepare draft recruiting creative → human approval → public ad account via authorized provider → first application. **Not yet implemented**. Failure states: no provider, spend cap unavailable, restaurant closed, creative unsupported, approval withdrawn.

**F02 — Approve the right creator**
S20 application queue (candidate, source, video portfolio, audience) → detail and eligibility checks → approve/deny (two distinct outcomes) → reserve owner-authorized visit slot → create draft reminder. Guards: tenant membership, no self-approval by Popebot, duplicate application, creator blocklist, program capacity, cancellation.

**F03 — Fulfill and verify content**
Approved booking → actual physical visit pass/check-in → content submitted via approved storage → rights/quality review → approve/revise/reject → optional owner-approved ad use. Distinguish no-show vs missing verification, rejected content, late submission, expired rights.

**F04 — Prove marketing sales lift**
Campaign costs → authorized Square/Toast/Clover/POS receipts (cash+card) → reconcile refunds/voids → match approved code/transaction identifiers → compare against suitable unexposed or time-based baseline → show attributed paid sales, estimated incrementality, variable costs, and profitable decisions separately. Source connection failure ≠ zero sales.

**F05 — Owner decision, human-controlled**
Popebot summarizes what changed and suggests STOP / REVISE / REQUEST APPROVAL TO SCALE → owner sees exact spend, evidence and pending actions → approves/rejects exact action → status/audit trail updates → send/advertise only after provider acceptance receipt. **Requires MACS Client Zero approval proof**.

## Inferred domain model — ALL UNVERIFIED FOR FEAST
MACS implementation proposal only:
- CreatorCampaign(org_id,id,offer_id,budget_cents,currency,status,approval_id,platform_campaign_id)
- CreatorApplication(org_id,id,campaign_id,creator_ref,profile_source,submitted_at,status)
- CreatorDecision(org_id,id,application_id,decision,decider_user_id,decided_at,policy_version)
- VisitSlot(org_id,id,start_utc,end_utc,capacity,time_zone,policy_version)
- VisitBooking(org_id,id,application_id,slot_id,status,idempotency_key)
- CreativeBrief(org_id,id,version,restaurant_facts,food_credit_cents,rights_policy,approved_at)
- Communication(org_id,id,booking_id,channel,consent_receipt_id,payload_hash,status,provider_event_id)
- VisitCheckin(org_id,id,booking_id,checked_at,operator_user_id,pass_id,status)
- ContentSubmission(org_id,id,booking_id,asset_ref,checksum,rights_receipt,status,submitted_at)
- ContentReview(org_id,id,submission_id,decision,reviewer_id,approved_at)
- AdActivation(org_id,id,submission_id,provider_id,budget_cents,approval_id,status)
- PaymentEvidence(org_id,provider,provider_id,paid_at,amount_cents,refunds_cents,currency,tender,source_receipt_id)
- CampaignAttribution(org_id,campaign_id,provider_payment_id,method,confidence,evidence_ref)
- AuditAction(org_id,id,actor_id,action,payload_hash,approval_id,provider_receipt,occurred_at)

These are proposed entities, not asserted Feast's actual schema. If built, durable storage must use the already-approved MACS tenant model and independent two-tenant RLS proof. Do not mix them into Bunna's shared botanic-creations tables or create a second database without approved migration.

## What's not cloneable / deliberately excluded
- Remy and Feast trademarks, screenshots, specific illustrations, copy, private source code and inaccessible endpoints.
- The existing creator network, verified creator identities, testimonials, data warehouse, POS agreements, advertising trust and proprietary attributed sales.
- Private app screens, login states, charts or APIs not observed.
- Automated texting, spending, content licensing, Meta ad management and approval bypass without authority and operational/legal proof.

## Effort and dependency boundary
Remy creator operations **L** (auth/tenant + creator workflow + messaging/consent + ads + content rights). Restaurant revenue proof **M** if Square access exists; multi-POS parity **L**, external sales incrementality **L**. No single prompt can make third-party access or historic orders appear.

## Present implementation truth
PR #42 currently implements original public landing, revenue-view read-only Square payment adapter, scoped API and stdio MCP tool, and tests. It does **NOT** implement creator recruitment, visits, texting, content review or ad integration. It does not independently verify a live MACS Popebot connection or Bunna payment evidence.

Next: `replica-architect` to specify only F02 small vertical slice, **after** screenshot-backed Design Lock and owner authorization. Preserve S17/S18 until independent mobile/visual review.
