import type { Metadata } from "next";
import { MainNav } from "@/components/landing/MainNav";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Terms of Use — Maxx Migrations",
};

export default function TermsPage() {
  return (
    <>
      <MainNav />
      <main id="main-content">
        <section className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="font-display text-4xl font-semibold">Terms of Use</h1>
          <p className="mt-2 text-sm text-muted">Last updated July 3, 2026</p>

          <div className="mt-10 space-y-8 text-muted">
            <div>
              <h2 className="font-display text-xl font-semibold text-text">The install model</h2>
              <p className="mt-2">
                Maxx Migrations sells a one-time sovereign install: a
                migrated website, connected CRM, and configured automations
                delivered into infrastructure your organization owns. After
                delivery, you own the code and data outright. Ongoing
                maintenance and AI technology partnership are optional,
                separately billed services.
              </p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-text">Acceptable use</h2>
              <p className="mt-2">
                You agree not to use the missed-call text-back, SMS, or
                social publishing features to send unsolicited marketing to
                numbers or accounts that have not consented to contact, and
                to honor every STOP or opt-out request within the timeframe
                required by applicable law (typically immediately).
              </p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-text">Third-party services</h2>
              <p className="mt-2">
                Features that depend on Twilio, Meta, or GoHighLevel require
                your own accounts and credentials with those providers. Maxx
                Migrations is not affiliated with or endorsed by
                GoHighLevel, HubSpot, Twilio, Stripe, or Supabase, and is not
                responsible for changes those providers make to their APIs,
                pricing, or policies.
              </p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-text">Warranty and liability</h2>
              <p className="mt-2">
                Work delivered under a sovereign install agreement is covered
                by the warranty period stated in your signed statement of
                work. Outside of that period, the software is provided as
                owned code with no ongoing liability implied unless covered
                by an active maintenance agreement.
              </p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-text">Contact</h2>
              <p className="mt-2">
                Questions about these terms: legal@maxxmigrations.com.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
