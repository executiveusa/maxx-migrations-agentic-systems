# App Microcopy

Short strings that appear throughout `/app/*`. Kept centralized here so
tone stays consistent as new screens are added.

## Seed / local mode banner
> Local build mode: auth provider not configured. Demo organization loaded
> from seed data.

Shown in `AppShell.tsx` whenever `NEXT_PUBLIC_AUTH_CONFIGURED` is not
`"true"`.

## Setup-required states
- Integrations card: **"Setup required"** (never "coming soon" or "disabled")
- Social publish attempt without Meta configured: **"Meta connection
  required. Add META_ACCESS_TOKEN and META_PAGE_ID in Settings →
  Integrations to publish to Facebook and Instagram."**
- Missed call without Twilio configured: **"Twilio setup required. Add
  TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in
  Settings → Integrations to enable live text-back sending."**
- GHL API import option when unconfigured: **"Setup required — add
  GHL_API_KEY and GHL_LOCATION_ID in Settings → Integrations."**

## Successful mock actions
- Local social publish: **"Local mock publish completed for {channels}."**
- Local SMS send: **"Local mock SMS sent to {number}."**

## Empty states
- Contacts with no filter matches: **"No contacts match these filters" /
  "Try clearing your search or filters, or add a new contact."**
- Workflow with no runs: **"No runs yet" / "This workflow hasn't been
  triggered yet."**
- Community DM with nothing selected: **"No conversation selected" /
  "Choose a thread to view messages."**
- Courses with no enrollments: **"No enrollments yet" / "Progress will
  appear here once staff start a course."**

## Compliance notice (Missed Call Text Back)
> Compliance: Missed Call Text Back only sends when MCTB is enabled for
> this organization, a phone number is configured, and the recipient has
> not opted out. Every attempt — sent or blocked — is logged. Replying
> STOP immediately and permanently opts a number out.

## Legal disclosures
> AI assists with migration, content, support, and automation. Sensitive
> decisions, legal approvals, payment approvals, and final public
> messaging remain under human control.

> © {year} Maxx Migrations. Not affiliated with or endorsed by
> GoHighLevel, HubSpot, Twilio, Stripe, or Supabase.

## Buttons
Buttons are always verb-first and specific: "Add contact," "Save as
draft," "Publish now," "Run import," "Generate crawl plan." Never a bare
"Submit" or "OK."
