# MACS Restaurant Revenue Proof — Client Zero: Bunna
Status: **DRAFT — NOT DEPLOYED / NOT CONNECTED / NO VERIFIED RESTAURANT REVENUE**.
Owner: MACS Digital Media. Existing source of truth for MACS is `agencies/macs-digital/AGENTS.md`; this page is a bounded extension of Revenue Capture OS, not another platform or ICM database.

## Goal and boundaries
**Sell before broadening:** prove one profitable acquisition experiment with paid receipts and a comparison baseline. Do not sell a promise of a specific ROI. **Reuse:** `apps/maxx-web` provides the public marketing shell, authenticated operator console, revenue-capture concepts and the existing Popebot chat. `executiveusa/bunna-marketing-workspace` already owns the Bunna audit/offer evidence. `executiveusa/bunna-smart-site` owns Bunna's restaurant website and protected production release. Do not merge their databases, create a new CRM or replace the POS.

Mode: brownfield, one reversible feature branch; no schema, DNS, production or customer-data writes. No restaurant contact or spending. All provider capabilities default off.

**Primary buyer:** independent restaurant owner with usable transaction records (including cash) and a profitable offer. Product is for MACS operators first. Bunna is a pilot, not a completed revenue case study.

## Product surfaces in this draft
- Public landing: `/restaurant-growth` — uses the existing MACS design system, CTA to existing `/audit`, honest proof and FAQ.
- Operator: `/app/revenue/restaurant` — inside existing authenticated `/app` shell; reports **NOT_CONNECTED** without live credentials; zero fake sales.
- API: `GET /api/restaurant-growth/metrics?days=7|14|30`; one configured organization only. Read-only, no customer identities. `NO_CONNECTION` is not zero actual restaurant revenue.
- Square connector: `GET /v2/payments`, fixed Square hosts, read-only `PAYMENTS_READ`, actual configured location, bounded pagination and error refusal. Records completed payments with source type CASH/CARD/OTHER and refunds. Volume excludes tips but can include sales taxes; it is **not** merchant net sales or causal lift. No customer fields or order-item data are returned. Square documentation: https://developer.squareup.com/reference/square/payments/ListPayments
- Agent plugin: `node mcp/macs-restaurant.mjs`, stdio MCP tool `macs_restaurant_read_receipts`, scoped to server-side credential for ONE org and **read-only**. This is a registration-ready tool, not evidence that an agent has called it.
- Existing Popebot remains at `/app`. Do not clone or replace Popebot. An authorized agent can consume the MCP tool when separately configured and tested.

## Agent / tenant safety
- Both the operator route and API are non-operational in seed-mode, regardless of any API key.
- Authenticated operator requests use `resolveAuthorizedOrgId()`, which checks the real `maxx_organization_members` table. Only exact `MAXX_RESTAURANT_CLIENT_ORG_ID` is permitted.
- API-key requests require a strong server-side `MAXX_RESTAURANT_AGENT_KEY`, which maps to that same single configured org; callers **cannot** choose a tenant from query/body/header.
- The configured Square org must match the authorized restaurant org before an API call. **IMPORTANT:** This is not a general multi-tenant token vault or OAuth implementation. Do not extend to a second restaurant by adding unverified environment fallbacks.
- No public provider keys, service-role credentials, guest PII, ad spend, outreach, published content, payment refunds or payment writes.
- New `/app` components must remain behind hardened session security; a live two-tenant proof and a separately approved deployment are still required by the MACS Client Zero contract.

## Provider capability matrix — verified vs unverified
| Capability | State | Required next proof |
| --- | --- | --- |
| Square completed payments / cash | READ-ONLY CODED, NOT AUTHENTICATED | Owner OAuth/connection, exact location, controlled sandbox tests, then isolated production read |
| Square order-item attribution | NOT BUILT | `ORDERS_READ`, match payment `order_id` to completed order, reconcile taxes/tips and split tenders |
| Toast | NOT CONNECTED | Obtain appropriate documented `orders:read` integration level and owner authorization. https://doc.toasttab.com/doc/devguide/apiOverview.html |
| Clover | NOT CONNECTED | Owner-authorized developer app and read-only scope; review official endpoints and costs before adapter |
| Owner.com/Ordersave | NO AUTHORIZED API | Owner account owner to verify export/collaborator access and agreement; do not scrape login/dashboard or emulate private APIs |
| Creator/Remy equivalent | PLANNED, NOT OPERATING | Creator opt-in, briefs, rates/meal budget, content license/release, owner approvals, real deliverable receipts |
| Google/Meta ads | NOT CONNECTED FOR RESTAURANT | Restaurant-controlled ad account, owner-approved budget, spend receipts and manual stop switch |
| SMS/loyalty/win-back | NOT CONNECTED FOR RESTAURANT | Consent/opt-out proof, staff approval, suppression and provider-native delivery receipts |
| Local listing/search audit | EXISTS IN BUNNA WORKSPACE; NOT THIS API | Owner-approved facts and dated platform evidence |
| Catering/group orders | PLANNED | Owner-approved price, capacity, approved intake provider and completed paid receipt |
| Incremental lift/profit | NOT PROVEN | Baseline/control, POS totals and variable-margin assumptions independently reviewed |

## Feast public FAQ benchmark / clean-room scope
Source: https://feastalytics.com/services/restaurant-marketing-agency-no-contract
Feast publicly describes Revenue Analyzer → local creator recruitment (Remy) → owner-approved campaigns/ads/pages/guest messages → POS-linked tracked visits/sales → iterate/scale, with Toast, Square and Clover. It explicitly differentiates matched sales from changes against normal patterns and publishes $750/month plus ad spend. Those are **their published claims**, not verified MACS features. See https://github.com/Jakeschincariol/replica-skill for the clean-room recon/architect/test approach. `morluto/rea` is meant for authorized binary/runtime research; unnecessary and inappropriate for inspecting a marketing-services page. No Feast code, brand assets, private APIs, logs, or protected content used.

The product's competitive increment is proof quality: a cash-compatible, owner-reconcilable receipt trail, clear cost/profit boundaries, an easily understandable status and no lock-in to a new POS. Do not copy Feast or Remy's branding/copy.

## 30-day experiment (proposed, owner approval required)
1. **Before spending:** owner confirms existing POS, recorded cash, true hours/menu, group-order price/food margin, payment/ordering channel, and permission for account access. Export 4–8 weeks of aggregate daily/daypart sales. No PII required.
2. **One campaign:** propose `BUNNA-SHARE-TABLE` (owner may reject/replace). Genuine approved photos; one buyer segment (workplace group lunch); one channel; uniquely identifiable code; no automatic discounts.
3. **Cash/card reconciliation:** cashier records paid receipts and source code; reconcile to daily POS totals (do not count QR scans as purchases). Dedupe/refunds/tips and record untagged receipts.
4. **Measure:** report attributed transactions separately from comparable daypart sales lift, variable costs, approved campaign spend and MACS fee. Use a holdout if volume supports it; otherwise mark lift directional.
5. **Scale gate:** three decision states `STOP / REVISE / REQUEST_APPROVAL_TO_SCALE`; no algorithm authorizes spend. Store approval evidence outside public code.

## First acceptance checks
- Offline ledger tests: deduped payment IDs, refunds, cash, refusal of impossible amounts, unknown incrementality.
- Square stub tests: uses only GET, fixed origin, correct location, completed payments, pagination, fail-closed on errors/mismatch.
- Anonymous requests: 503 in seed mode; 401 when agent key wrong; cross-tenant session 403.
- With approved sandbox credentials, real read against one authorized location; compare totals to Square Dashboard and ensure no personal fields leak.
- UI at 390/1440 with no overflow; no real-data fixture masquerades as live.
- Independent code review, exact-head lint/typecheck/unit/build, secure deployment, disabled-by-default switches.
- No changes to Bunna public website, Supabase botanic-creations, WordPress, DNS or third-party accounts.

## Required permissions
Human restaurant owner: establish POS brand and active account, authorize OAuth/exports, approve food facts/assets/campaign, provide aggregate baseline and variable-cost ranges, approve any ad budget or creator meal, and define who reviews weekly reports.
MACS operator: provision tenant-scoped secret through hosting secret store (never paste it into a repo); request review before connection.
Independent reviewer: verify tenant isolation and all boundary tests; a self-review is insufficient.

## Rollback
Revert the PR; remove/rotate `MAXX_RESTAURANT_AGENT_KEY`, unset Square scoped credentials and disconnect OAuth. No migrations or customer records to reverse in this draft. It never modifies the restaurant's POS.

## Next bounded implementation
Once Bunna identifies the actual POS and approves its access, add **one** provider-specific proof. Do not simultaneously add Toast, Clover, Owner and social pipelines; each demands a reviewed scope and separate contract. After one true POS receipt, link a genuine campaign code and begin the first owner-approved offer test.
