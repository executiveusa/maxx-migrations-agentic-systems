import type { Metadata } from "next";
import { MainNav } from "@/components/landing/MainNav";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Maxx Migrations",
};

export default function PrivacyPage() {
  return (
    <>
      <MainNav />
      <main id="main-content">
        <section className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="font-display text-4xl font-semibold">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted">Last updated July 3, 2026</p>

          <div className="mt-10 space-y-8 text-muted">
            <div>
              <h2 className="font-display text-xl font-semibold text-text">What we collect</h2>
              <p className="mt-2">
                When you submit a migration audit, contact form, or create an
                account inside your organization&apos;s Maxx Migrations
                instance, we collect the information you provide directly:
                name, email, phone number, organization details, and the
                content of any message you send us. We do not buy or sell
                contact data, and we do not use your organization&apos;s CRM
                data to train models outside of your own agent runtime.
              </p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-text">Who owns your data</h2>
              <p className="mt-2">
                Every Maxx Migrations install is sovereign: your contacts,
                pipelines, community content, course content, and migration
                history live in a Supabase project your organization
                controls. Maxx Migrations does not retain a copy of your
                production CRM data once your instance is deployed.
              </p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-text">Third-party processors</h2>
              <p className="mt-2">
                Depending on which integrations you enable, your data may
                pass through Twilio (SMS and voice), Meta (Facebook and
                Instagram publishing), and your GoHighLevel account (during a
                one-time import). Each of these is optional and clearly
                labeled &quot;setup required&quot; until you connect it in
                Settings → Integrations.
              </p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-text">Your rights</h2>
              <p className="mt-2">
                You can request a copy of, correction to, or deletion of any
                personal data we hold about you as a visitor to this
                marketing site by emailing privacy@maxxmigrations.com. If
                you&apos;re a contact inside a customer&apos;s CRM instance,
                that organization controls your data directly.
              </p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-text">Contact</h2>
              <p className="mt-2">
                Questions about this policy: privacy@maxxmigrations.com.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
