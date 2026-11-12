import type { Metadata } from "next";
import Link from "next/link";
import { MainNav } from "@/components/landing/MainNav";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Restaurant Revenue Proof | MACS Digital Media",
  description: "Find the restaurant growth bottleneck. Test one offer. Reconcile cash and card receipts. See what can actually be proven before scaling spend.",
};
const steps = [
  ["01", "Find what is leaking", "We inspect menus, ordering, search visibility, guest experience and existing software before proposing another build."],
  ["02", "Choose one profitable test", "Together, we choose an approved service period, customer group and offer based on actual capacity and unit economics."],
  ["03", "Run only what you approve", "Campaigns, content and spending remain in your accounts. Nothing is published or purchased without authorization."],
  ["04", "Show the receipts", "We reconcile recorded cash, card and online payments and explain what is attributable, estimated or unknown."],
];
const faqs = [
  ["Do cash payments count?", "Yes, when they are recorded in the POS or a reconciled register. We never turn clicks or unverified manual notes into paid sales."],
  ["What if we already use Toast, Square, Clover or Owner?", "Keep the platform that works. We start with read-only, owner-approved exports or integrations and do not replace your POS, ordering or loyalty without a business case."],
  ["Can you prove a campaign caused the extra revenue?", "Campaign-matched receipts prove association, not causation. We also use comparable dayparts and, when practical, holdout groups to estimate incremental lift. Uncertainty is reported."],
  ["Will an AI agent control our accounts?", "Popebot can help analyze results and draft a plan; consequential changes, spend and customer outreach require authorized human approval."],
  ["Will you guarantee orders?", "No. We define a measurement baseline and acceptance tests before promotion. If a campaign does not work, the report says so."],
];
export default function RestaurantGrowthPage() {
  return (
    <div className="marketing-shell min-h-screen bg-bg text-text">
      <MainNav />
      <main id="main-content">
        <section className="mx-auto max-w-7xl px-5 pb-24 pt-20 md:px-8 md:pb-32 md:pt-32">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-accent">MACS · Restaurant Revenue Proof</p>
          <h1 className="mt-7 max-w-5xl font-display text-[clamp(3.7rem,8.5vw,8.5rem)] font-semibold leading-[.91] tracking-[-.055em]">
            Stop buying marketing you can&apos;t measure.
          </h1>
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <p className="max-w-3xl text-lg leading-8 text-muted md:text-2xl md:leading-10">
              One restaurant. One profitable opportunity. One accountable test.
              We connect the story behind your campaigns to real recorded transactions—including cash—and show where the evidence ends.
            </p>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/audit" className="inline-flex min-h-12 items-center rounded-full bg-accent px-7 text-sm font-semibold text-white">Start with a Vibe Audit</Link>
              <Link href="#process" className="inline-flex min-h-12 items-center rounded-full border border-border px-7 text-sm font-semibold">See the method</Link>
            </div>
          </div>
          <div className="mt-20 grid gap-3 border-t border-border pt-6 md:grid-cols-3">
            {[
              ["CASH + CARD", "Real recorded payments, not click counts"],
              ["ONE TEST", "No endless bundles or speculative ad spend"],
              ["YOUR ACCOUNTS", "You retain your POS, ads, customer and creative assets"],
            ].map(([headline, sub]) => (
              <div key={headline} className="py-3 md:border-r md:border-border md:px-6 md:first:pl-0 md:last:border-r-0">
                <p className="font-display text-3xl font-semibold">{headline}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{sub}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="process" className="bg-surface py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-accent">The operating loop</p>
            <h2 className="mt-5 max-w-4xl font-display text-5xl leading-[.95] tracking-[-.04em] md:text-7xl">Test. Reconcile. Improve.</h2>
            <div className="mt-14 border-b border-border">
              {steps.map(([number,title,body]) => (
                <div key={number} className="grid gap-4 border-t border-border py-7 md:grid-cols-[70px_.8fr_1.2fr] md:gap-10">
                  <span className="text-sm text-muted">{number}</span>
                  <h3 className="font-display text-3xl font-semibold">{title}</h3>
                  <p className="max-w-2xl leading-7 text-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-accent">Your weekly report</p>
            <h2 className="mt-5 font-display text-5xl leading-[.98] md:text-7xl">What can we actually prove?</h2>
          </div>
          <div className="space-y-4">
            {[
              ["VERIFIED", "Recorded paid transactions, with refunds and cash included when reconciled."],
              ["ATTRIBUTED", "Purchases linked to a campaign code or source; not automatically new sales."],
              ["ESTIMATED", "Incremental lift compared with normal performance; assumptions visible."],
              ["UNKNOWN", "Missing data or insufficient sample size shown plainly—not replaced with a marketing claim."],
            ].map(([status,body]) => (
              <div key={status} className="grid gap-3 border-t border-border pt-5 sm:grid-cols-[135px_1fr]">
                <strong className="text-sm tracking-[.1em] text-accent">{status}</strong><p className="leading-7 text-muted">{body}</p>
              </div>
            ))}
            <p className="pt-5 text-xs leading-5 text-muted">Bunna is the private Client Zero pilot. No real POS transaction totals or incremental revenue claims are published here.</p>
          </div>
        </section>
        <section className="bg-[#0f3428] py-24 text-[#f6f3ec] md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#a9d7c4]">Frequently asked</p>
            <h2 className="mt-5 font-display text-5xl leading-[.95] tracking-[-.04em] md:text-7xl">The questions a restaurant owner should ask.</h2>
            <div className="mt-12 divide-y divide-white/20 border-t border-white/20">
              {faqs.map(([question,answer]) => (
                <details key={question} className="group py-6">
                  <summary className="cursor-pointer text-lg font-semibold marker:text-[#a9d7c4]">{question}</summary>
                  <p className="mt-4 max-w-3xl text-base leading-7 text-[#ccdcd4]">{answer}</p>
                </details>
              ))}
            </div>
            <Link href="/audit" className="mt-12 inline-flex min-h-12 items-center rounded-full bg-[#a9d7c4] px-7 text-sm font-semibold text-[#0f3428]">Find the revenue bottleneck</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
