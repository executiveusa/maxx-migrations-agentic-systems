# FAQ

Rendered by `apps/maxx-web/components/landing/FAQSection.tsx` on `/pricing`.

**Do we actually own the code and data after the install?**
Yes. A sovereign install deploys into your own Supabase project and your
own hosting account. Maxx Migrations does not retain a production copy of
your CRM data, and there's no recurring license fee to keep your site or
CRM running.

**What happens to features that need Twilio, Meta, or GoHighLevel?**
Those adapters ship fully built. Until you add your own credentials in
Settings → Integrations, the relevant screens show "setup required" — they
never fake a successful send or publish.

**Can we migrate off GoHighLevel without losing data?**
Yes. The GHL Import Wizard maps contacts, pipelines, opportunities, notes,
tasks, appointments, conversations, tags, and custom fields from either a
CSV export or a live GHL API connection, with a validation report before
anything is imported.

**Is the missed-call text-back feature compliant with opt-out law?**
It only sends when MCTB is enabled for your organization, a phone number
is configured, and the recipient hasn't replied STOP. Every attempt —
sent or blocked — is logged, and STOP replies are honored immediately.

**Do we need a developer on staff to maintain this?**
No, but you can bring your own. The optional AI technology partner
retainer covers maintenance, agent monitoring, and design updates if you'd
rather not manage it in-house.

**What if we want to add a feature that isn't in the initial scope?**
Because you own the code, any developer — ours or yours — can extend it.
The codebase uses standard Next.js, TypeScript, Supabase, and Tailwind
patterns throughout.
