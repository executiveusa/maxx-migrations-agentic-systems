import type { Metadata } from "next";
import Link from "next/link";
import { MainNav } from "@/components/landing/MainNav";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "MACS Client Zero — Case Study",
  description: "How MACS reduced its own offer and intake complexity into a governed, reusable company-brain onboarding system.",
};

const proof = [
  ["116", "structured intake questions", "The reusable Stage 00 question bank covers business model, customer journey, people, systems, ontology, workflow, authority, brand, sovereignty and proof."],
  ["83", "required decisions", "Required items create the minimum decision context needed before implementation expands."],
  ["11", "intake rounds", "The intake progresses by frontier instead of exposing the entire audit as one form."],
  ["1", "portable ICM brain", "Stable context, working state, evidence and authority are organized so another capable agent can cold-walk the business without relying on chat history."],
];

const stages = [
  ["01", "Reduce the offer", "The public front door became one paid diagnosis instead of asking visitors to choose their own implementation package."],
  ["02", "Turn intake into infrastructure", "Discovery was converted from ad-hoc consulting questions into a reusable Stage 00 protocol with DISCOVER vs ASK behavior."],
  ["03", "Organize context", "Accepted knowledge is routed into ICM so models and agents consume a portable company context rather than a collection of prompts."],
  ["04", "Gate consequential action", "The Client Zero runtime includes an approval proposal, evidence ledger and exactly-once benign-action contract."],
  ["05", "Refuse fake completion", "Live Supabase tenant isolation, approval receipts and rollback proof remain separate gates until runtime evidence exists."],
];

export default function MacsClientZeroPage() {
  return (
    <div className="marketing-shell min-h-screen bg-bg text-text">
      <MainNav />
      <main id="main-content">
        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-32">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">Case study · Client Zero</p>
          <h1 className="mt-7 max-w-6xl font-display text-[clamp(3.8rem,8vw,7.8rem)] font-semibold leading-[0.91] tracking-[-0.055em]">
            We used the MACS method on MACS first.
          </h1>
          <p className="mt-9 max-w-3xl text-xl leading-9 text-muted md:text-2xl md:leading-10">
            The problem was familiar: too much interface, too much offer language, and no durable operating context behind the sales process. We reduced the system before expanding it.
          </p>
        </section>

        <section className="bg-[#0f3428] py-24 text-[#f6f3ec] md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a9d7c4]">Verified structure</p>
            <div className="mt-10 grid border-y border-white/25 md:grid-cols-4">
              {proof.map(([value, title, body]) => (
                <article key={title} className="border-b border-white/20 py-8 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0">
                  <strong className="font-display text-6xl font-semibold tracking-[-0.05em]">{value}</strong>
                  <h2 className="mt-4 text-sm font-bold text-[#a9d7c4]">{title}</h2>
                  <p className="mt-4 text-sm leading-6 text-[#c8d8d2]">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 md:py-36">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">What changed</p>
              <h2 className="mt-6 font-display text-5xl font-semibold leading-[0.98] tracking-[-0.045em] md:text-7xl">
                Diagnose. Organize. Gate. Prove.
              </h2>
            </div>
            <div className="border-b border-border">
              {stages.map(([number, title, body]) => (
                <div key={number} className="grid gap-4 border-t border-border py-8 md:grid-cols-[55px_190px_1fr] md:gap-7">
                  <span className="text-sm text-muted">{number}</span>
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.03em]">{title}</h3>
                  <p className="text-base leading-7 text-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface py-24 md:py-36">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">What the build proves</p>
                <h2 className="mt-6 font-display text-5xl font-semibold leading-[0.98] tracking-[-0.045em] md:text-6xl">
                  The structure exists. The release proof is still gated.
                </h2>
              </div>
              <div className="space-y-8 text-base leading-7 text-muted">
                <div className="border-t border-text pt-5">
                  <strong className="text-text">Proven in source/build</strong>
                  <p className="mt-2">The intake schema exists, ICM contracts are organized, the application build passed before merge, and the approval/evidence architecture is implemented.</p>
                </div>
                <div className="border-t border-text pt-5">
                  <strong className="text-text">Not marketed as complete</strong>
                  <p className="mt-2">Live Supabase durable readback, two-tenant RLS denial, rejection with zero side effects, repeated approval with exactly one effect, export and rollback still require runtime receipts in the correct MACS Supabase organization.</p>
                </div>
                <div className="border-t border-text pt-5">
                  <strong className="text-text">Why that matters</strong>
                  <p className="mt-2">The method treats evidence as part of the product. A feature is not called production-ready merely because code for it exists.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-[60vh] items-center py-24 text-center md:py-36">
          <div className="mx-auto max-w-5xl px-5 md:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">Your business next</p>
            <h2 className="mt-7 font-display text-5xl font-semibold leading-[0.97] tracking-[-0.05em] md:text-7xl">
              Start with the same thing we started with: find the real bottleneck.
            </h2>
            <Link href="/audit" className="mt-10 inline-flex rounded-full bg-accent px-7 py-4 text-sm font-bold text-white transition-transform duration-150 active:scale-[0.98]">
              Start the $497 Vibe Audit
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
