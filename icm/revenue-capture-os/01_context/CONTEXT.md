# Revenue Capture OS — Durable Context

## Customer job
A nontechnical owner wants MAXX to stop good leads/customers from falling through the cracks, follow up safely, and prove what happened economically.

## Canonical workflow
`provider event → tenant resolution → contact/opportunity correlation → workflow/action → outcome evidence → Value Ledger → Popebot/cockpit → Recovery Receipt`

## Authoritative boundaries
- Human identity/tenant membership: Supabase Auth + `maxx_organization_members`.
- External webhook tenant: provider-targeted resource binding (phone number/account/domain), never demo-org fallback.
- Provider evidence: `maxx_provider_events`.
- Economic evidence: `maxx_value_ledger_entries`.
- External identity map: `maxx_external_objects`.
- Weekly proof artifact: `maxx_recovery_receipts`.
- Cross-client visibility: authorized `maxx_platform_operators` only.
- Consequential agent actions: exact persisted approval, revalidated immediately before execution.

## Integration contract
Adapters may ingest Twilio, WhatsApp Business, email, Stripe, Google Business Profile, Google Ads, Search Console, analytics, Meta Ads, accounting, CRM, and ERPNext. Code presence is not live proof. A connection is live only when its provider-native evidence/verification timestamp exists.

## Sovereignty
Secrets are environment/secret-manager material, never ICM. Customers retain practical control of domain, source, data, credentials, workflows, exports, and infrastructure.

## Failure posture
Fail closed on unknown tenant, invalid signature, missing authorization, ambiguous attribution, or consequential action without matching approval.
