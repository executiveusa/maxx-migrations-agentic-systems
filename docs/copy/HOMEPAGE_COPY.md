# Homepage Copy

Source of truth for the live copy rendered by `apps/maxx-web/components/landing/*`
and `apps/maxx-web/app/page.tsx`. Update the component when you update this file
— this document describes what ships, it does not replace the component.

## Announcement bar
See `AnnouncementBar.tsx`.

## Hero
- **Headline:** Sovereign AI Migrations for Mission-Driven Teams
- **Subhead:** We clone, upgrade, and connect your website into an owned
  AI-powered CRM system, so your organization stops renting fragile tools
  and starts building on infrastructure it controls.
- **Primary CTA:** Start a Migration Audit
- **Secondary CTA:** See How It Works

## Ownership proof strip
See `ProofPanel.tsx` — concrete claims about what the org owns after
delivery (code, data, CRM), not vague "empowerment" language.

## Four-step migration process
See `HowItWorks.tsx` — intake, crawl, rebuild, connect.

## Recent updates shipped to your CRM
**Section headline:** Recent updates shipped to your CRM
**Section subhead:** Every update below is live in the app, not a roadmap slide.

| Card | Copy |
| --- | --- |
| Community & Courses | Community with a feed, classroom, direct messages, and leaderboards. |
| Workflow Builder | Visual, step-by-step automations without flowchart spaghetti. |
| Social Media Planner | Schedule and publish posts to Facebook and Instagram. |
| GHL Import Wizard | Transfer contacts, pipelines, opportunities, notes, and tasks from GHL. |
| Missed Call Text Back | Turn missed calls into conversations and recover leads automatically. |

Each card links to its `/features/*` page and its matching `/app/*` route —
see `RecentUpdates.tsx`.

## What you own
See `FeatureStack.tsx` — Owned CRM, Migration Engine, AI Agents, Forms &
Intake, Automations, Sovereign Hosting.

## Nonprofit & social-purpose use cases
See `NonprofitUseCases.tsx`.

## Pricing
See `PricingSection.tsx` and `docs/copy/FAQ.md` for the FAQ block that
follows it on `/pricing`.

## Final CTA
See `FinalCTA.tsx` — restates the migration audit offer with a two
business-day follow-up commitment, matching the copy in
`MigrationAuditForm.tsx`'s success state.

## Footer
See `Footer.tsx` — Product, Recent Updates, and Legal columns, plus the
AI-oversight disclosure and trademark disclaimer required by
`docs/copy/APP_MICROCOPY.md#legal-disclosures`.
