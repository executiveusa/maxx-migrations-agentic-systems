# MACS Restaurant Growth — Evidence-Led Design Lock
Date: 2026-11-12 | Version: 1 | Status: **DESIGN CANDIDATE, NOT APPROVED AND NOT RELEASED**.
Conforms to the user-supplied Landing Page Director workflow: `LOCK → INSPECT → EVIDENCE → RESEARCH → CONVERSION → TERRITORIES → DESIGN LOCK → SPEC → BUILD → GAUNTLET → REPAIR → PROOF → RELEASE → LEARN`.
Reference inventory: `FEAST-PUBLIC-VISUAL-EVIDENCE-2026-11-12.md`; clean-room S/F IDs: `apps/maxx-web/replica/recon.md`, `features.csv`.
Existing MACS approved brand and public copy retain priority; this does not rewrite the homepage.

## PROJECT LOCK
- **Mode:** BROWNFIELD (existing MACS `apps/maxx-web`, Revenue Capture OS, app shell, Popebot).
- **Product:** MACS Restaurant Revenue Proof + future owner-approval creator operations, not a fifth public service.
- **Audience 1:** Nontechnical independent restaurant owner evaluating accountability; awareness: skeptical of agencies and attribution.
- **Audience 2:** MACS internal operator delivering proof with minimal training; awareness: basic restaurant operations but not SQL/API.
- **Trigger:** Uncertain ad value, fragile ordering channels, inconsistent content supply, unknown profit.
- **Core problem:** Marketing assets/ads/clicks are not linked to reconciled paid transactions and clear decisions.
- **Desired outcome:** One owner-approved test with a result report distinguishing recorded receipts, attributed sales, estimated incremental lift and unknown.
- **Offer:** Existing $497 Vibe Audit entry; restaurant-specific assessment under same MACS ladder. Do NOT publish a new price or revenue guarantee without authorization.
- **Commercial value:** One paid audit first, conditional Vibe Rescue Sprint, optional ongoing MAXX Operations only when validated.
- **Primary public CTA:** `Start with a Vibe Audit` → existing `/audit` workflow. **Post-click must be independently tested, not inferred from source.**
- **Primary operator action:** `Review the next evidence-backed task` — an explanation plus one pending approved operation; no unbacked "Launch Campaign" button.
- **Proof today:** PR #42 code/tests (cash/card read model and UI), screenshot references, no actual Bunna sales.
- **Objections:** Cash payments; existing POS; owner time; ad spend; privacy; creator rights; provenance; false ROI.
- **Brand:** Existing editorial MACS cream/evergreen, Cormorant Garamond + DM Sans, responsive app shell. Keep intact.
- **Constraints:** Production auth/tenant RLS not independently proven; no Bunna staff/commerce approval; no live POS, ad, Remy or private product access. No new database/app/CRM.
- **KPI:** Paid verified, reconciled proof of an incremental *profitable* outcome; leading indicator completed owner-approved audit.
- **Success:** A new operator can explain source status and take one safe approved action, and a skeptical owner can independently reconcile results.

## BASELINE / KEEP-IMPROVE-UNKNOWN
| Existing MACS element | Decision | Reason |
|---|---|---|
| Editorial landing design and homepage copy | KEEP | User-approved MACS brand and four-bucket ladder; do not clone Feast orange/black hero |
| `/restaurant-growth` draft page | IMPROVE after visual review | Explains model, but no authenticated product screenshot or real proof yet |
| `/app/revenue/restaurant` | KEEP as a gated draft | Honest disconnected state; needs real POS proof to become useful |
| Popebot `/app` chat surface | KEEP | No duplicate Remy-branded chatbot; tool invocation still needs registration proof |
| Two-tenant auth proof / real data store | UNKNOWN/BLOCK | Shared platform Client Zero must independently pass first |
| Remy private desktop app UX | UNKNOWN | Only public curated Remy images reviewed |
| Existing post/approval control | KEEP shared pattern | No second campaign policy engine; use existing ICM / MAXX controls |

## Evidence & claims ledger
| Claim | Status | Public allowed? |
|---|---|---|
| MACS can describe an audit and measurement plan | VERIFIED in documentation | Yes, as offered process rather than measured outcome |
| MACS Square read-only completed-payments code exists | VERIFIED by PR diff/test | Public only with qualification; NOT connected |
| MACS has proven customer revenue for Bunna | MISSING PROOF | NO |
| MACS offers native Toast/Clover/Owner integration | NOT BUILT | NO |
| MACS has automatic creator management parity with Remy | NOT BUILT | NO |
| Popebot runs approved creator actions autonomously | NOT VERIFIED | NO |
| Public Remy shows application approvals, messages, scheduling, check-in and content board | VERIFIED as public marketing screenshot | Only as research evidence, not MACS feature |
| 135 Feast public URLs discovered; 21 viewport captures and 7 full-page captures | VERIFIED by this dated research | Internal only |
| Feast marketing revenue or performance numbers apply to MACS | FALSE | NO |

## Three genuinely different creative territories
**A — RECEIPT FIRST (RECOMMENDED for public)**
- Governing idea: from a vague marketing promise to an owner-readable accounting trail.
- Visual: restrained editorial ledger, large factual headline, one illustrative but clearly labeled input→transaction→decision line; quiet cream, evergreen; purposeful linework.
- Product proof: real disconnected state initially; later actual anonymized evidence with owner consent.
- Mobile: headline and action first, then simple source-proof graphic and objections. No oversized tables.
- Risk: without real Bunna evidence may appear abstract. Fix by showing *working proof flow*, not fake figures.

**B — SERVICE DESK (RECOMMENDED for internal operator)**
- Governing idea: one queue of real work and visible approvals, not an agency analytics cockpit.
- Visual: 3-column desktop only if screen space permits (Today / Record / Popebot); phone collapses to one needs-attention lane and contextual conversation.
- Components: clear status chips `NEEDS OWNER`, `WAITING FOR SOURCE`, `READY FOR REVIEW`, evidence details, approve/reject with audit receipt.
- Risk: a broad queue without actual backend becomes a decorative empty board. Build only after tenant-safe persisted records.

**C — CAMPAIGN LAB (EXPERIMENTAL / PARK)**
- Governing idea: a visually sequenced test bench comparing offers and outcomes.
- Visual: bold comparative charts, scenario and forecast controls, ad cards.
- Risk: easy to create false causal certainty. Would mislead owners absent real comparison data. Park.

Selected: **A for public page; B for future operator creator workflow.** Separate contexts; do not mash into one hero.

## DESIGN LOCK: PUBLIC
- Governing idea: `A receipt for the marketing claim`.
- Voice: specific, calm, local-operator friendly. No invented testimonials, ROI, 100+ clients, or fake provider logos.
- Hierarchy: one line who/problem/action → two-sentence mechanism → actual product/status/evidence → one objection/FAQ → existing audit CTA.
- Primary action: start existing Vibe Audit. Stop at one dominant CTA label.
- Visual: current `marketing-shell` evergreen, warm paper, restrained typography, editorial rule lines and one useful compact diagram; no generic cards/gradient or Feast image copied.
- Motion: only affordance/state transitions; reduced-motion supported. No invented movie/video prerequisite.
- CTA post-click: independently verify `/audit` and success state before public release.
- SEO: title/description, one H1, truthful page metadata, no unapproved case-study schema or fabricated reviews.
- Perf: no heavyweight carousel, animation framework or media for decoration.

## DESIGN LOCK: INTERNAL CREATOR WORKBENCH (S20 proposed)
- Governing idea: `One creator needs one clear decision`.
- Default screen: “Today” with genuine pending applications/actions, next visit and content awaiting approval; backed by real tenant data, never demo masquerading as production.
- Navigation: `Needs review` / `Visits` / `Content` / `Evidence`; **not a copy** of Remy's exact tab bar or visual arrangement.
- Candidate detail: identity/source, verified platform link, relationship, documented requirements, key metrics with source/time, proposed food-cost ceiling and visit capacity.
- Primary stateful action: `Approve visit` (disabled until staff authorization and approved restaurant settings); decline with reason; both audit.
- Confirmation: saved decision + event ID + next authorized step; never claim scheduled/notification sent before provider receipt.
- Content states: `Expected`, `Received`, `Revision requested`, `Approved for owned channels`, `Paid usage approved separately`.
- Popebot: contextual panel answers questions and prepares drafts; it does not impersonate approver or send messages without distinct authorization and delivery receipt.
- Provider-independent: any approved adapter produces canonical events; services cannot silently switch merchant locations.
- Error/empty: not connected / no applicant / no appointment / provider error / consent missing / approval expired / rights uncertain / duplicate decision.

## Mobile contract
- Test 320 / 375 / 390 / 430 / 768 / 1024 / 1440 plus intermediate sizes.
- 390px: display one main action and a single-column queue, no horizontal creator table, 44px+ tap height, sticky actions only if content remains readable.
- Candidate view collapses metrics to 2×2 fields and hides optional detail in an accessible disclosure, never hides decision evidence.
- Mobile header, form keyboard/zoom, safe-area inset, reduced-motion, long names and currency wrapping must be checked with actual rendered screenshots.

## Golden conversion slice
**Public:** HERO → HOW RECEIPTS WORK → KNOWN/UNKNOWN EVIDENCE → CASH/POS FAQ → ONE AUDIT CTA → actual confirmed intake response.

**Internal after backend:** SERVER-VERIFIED TENANT → APPLICATION QUEUE → CANDIDATE DETAIL → OWNER APPROVAL → DURABLE RECEIPT → NEXT TASK (booking) → eventually verified content/transaction outcome.

## P0/P1 anti-slop/gauntlet gate
- P0 if false revenue/creator counts, exposed key, cross-tenant read, form not working, unsupported provider status or fake approvals.
- P1 if generic agency headline, unclear CTA, 390 overflow, ambiguous unapproved button, fake content image, accessibility failures.
- Independent council roles: conversion, clarity, creative, anti-slop, mobile, accessibility, truth, production, security and rollback; builder cannot self-approve.
- Only mark approved after actual screenshot comparisons, owner approval where material, pass on real deployment, independent reviewer, proof receipt and rollback.
- This design lock is a *draft direction* and does not authorize new API writes, paid ads, public publishing or claim of Remy parity.

## Next bounded design implementation
Independent UI gauntlet of the existing `/restaurant-growth` and `/app/revenue/restaurant` preview at 390/1440, with screenshots of protected preview using authorized access. Repair P0/P1 only in PR #42. After backend tenant proof, build F02 single creator-application read/approval slice on a **separate reversible branch**, not as a fake demo. Preserve public website and existing MAXX revenue controls.
