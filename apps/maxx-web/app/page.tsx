import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { MainNav } from "@/components/landing/MainNav";
import { Footer } from "@/components/landing/Footer";
import { Reveal } from "@/components/landing/MotionPrimitives";
import { AuditCommand } from "@/components/landing/new-look/AuditCommand";
import { MACS_FOUNDER_DATA_URI } from "@/lib/brand-assets";

export const metadata: Metadata = {
  title: "MACS Digital Media — Technology for Nontechnical Business Owners",
  description:
    "A Pacific Northwest father-and-son company helping nontechnical business owners simplify disconnected tools, repetitive work and subscription sprawl before buying more technology.",
};

const pains = [
  "Paying for software you barely use.",
  "The same customer information living in three different places.",
  "Leads still needing someone to manually chase them down.",
  "Automations so complicated nobody wants to touch them.",
  "Knowing AI could help without knowing where it actually belongs.",
];

const outcomes = [
  ["Fewer tools", "Keep the technology that earns its place. Remove, replace or consolidate what does not."],
  ["One organized business", "Put the knowledge your company depends on into a portable structure humans and AI can actually use."],
  ["Less manual work", "Automate repeatable work only after the underlying process makes sense."],
  ["Owner control", "Design around your business, your data and a documented handoff instead of permanent dependence."],
];

const offers = [
  {
    number: "01",
    title: "Vibe Audit",
    body: "We inspect what is already happening before recommending another platform, automation or build.",
    meta: "$497 · Start here",
  },
  {
    number: "02",
    title: "Vibe Rescue",
    body: "If one bounded blocker is the real problem, we fix that first instead of turning it into a giant project.",
    meta: "Fix the blocker",
  },
  {
    number: "03",
    title: "Sovereign Launch",
    body: "When a new system is justified, we build around owner-controlled code, data, context and a documented handoff.",
    meta: "Build what is needed",
  },
  {
    number: "04",
    title: "MAXX Migrations",
    body: "For businesses trapped inside expensive platforms or fragmented stacks: extract, understand, rebuild, migrate, train and hand over the keys.",
    meta: "Flagship transformation",
  },
];

function Label({ children }: { children: ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">{children}</p>;
}

export default function HomePage() {
  return (
    <div className="marketing-shell min-h-screen bg-bg text-text">
      <MainNav />
      <main id="main-content">
        <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:gap-16">
            <Reveal>
              <Label>Pacific Northwest · Father + Son · Built for nontechnical owners</Label>
              <h1 className="mt-7 max-w-5xl font-display text-[clamp(3.4rem,7vw,7rem)] font-semibold leading-[0.92] tracking-[-0.055em]">
                Technology should make running your business easier.
                <span className="mt-3 block text-accent">Not give you another job.</span>
              </h1>
              <p className="mt-8 max-w-3xl text-lg leading-8 text-muted md:text-2xl md:leading-10">
                We built MACS after dealing with the same mess we now help other owners solve: too many subscriptions, disconnected systems, repetitive work and technology that expected us to become technical just to use it.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <Link href="/audit" data-event="audit_cta_click" className="rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-white transition-transform duration-150 active:scale-[0.98]">
                  Start the $497 Vibe Audit
                </Link>
                <Link href="#work" className="border-b border-text pb-1 text-sm font-bold">
                  See how we solved it →
                </Link>
              </div>
              <p className="mt-7 text-sm font-semibold text-text">Local people. Practical technology. Systems you can own.</p>
            </Reveal>

            <Reveal delay={0.08}>
              <figure className="relative overflow-hidden rounded-[2rem] border border-border bg-[#173f35] text-[#f7f3ea] shadow-[0_24px_70px_rgba(20,35,29,0.16)]">
                <img
                  src={MACS_FOUNDER_DATA_URI}
                  alt="Stacy and Stavari, the father-and-son team behind MACS Digital Media"
                  className="aspect-[4/5] h-full w-full object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-[#102f28]/95 px-6 py-5 backdrop-blur-sm md:px-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a9d7c4]">Father + son · Pacific Northwest</p>
                  <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em]">Stacy + Stavari</p>
                </figcaption>
              </figure>
            </Reveal>
          </div>
          <AuditCommand />
        </section>

        <section id="about" className="border-y border-border bg-surface py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid gap-14 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
              <Reveal>
                <Label>This was us</Label>
                <h2 className="mt-6 font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] md:text-7xl">
                  We got tired of managing the technology that was supposed to help us.
                </h2>
                <p className="mt-7 max-w-xl text-lg leading-8 text-muted">
                  Stacy is a nontechnical founder. That became the design constraint: the system had to adapt to the owner instead of forcing the owner to become an IT department.
                </p>
              </Reveal>
              <Reveal delay={0.06} className="border-b border-border">
                {pains.map((pain, index) => (
                  <div key={pain} className="grid grid-cols-[42px_1fr] gap-4 border-t border-border py-6 md:grid-cols-[58px_1fr] md:py-7">
                    <span className="text-xs font-bold text-accent">0{index + 1}</span>
                    <p className="font-display text-2xl font-semibold leading-tight tracking-[-0.025em] md:text-3xl">{pain}</p>
                  </div>
                ))}
                <div className="border-t border-border py-7">
                  <p className="font-display text-3xl font-semibold tracking-[-0.03em]">Yeah. We were dealing with that too.</p>
                  <p className="mt-3 text-base leading-7 text-muted">That is what became MACS.</p>
                </div>
              </Reveal>
            </div>

            <Reveal className="mt-16 grid gap-5 md:grid-cols-2 md:gap-6" delay={0.04}>
              <article className="rounded-[1.75rem] border border-border bg-bg p-7 md:p-9">
                <p className="text-xs font-bold uppercase tracking-[0.13em] text-accent">Stacy · Founder</p>
                <h3 className="mt-4 font-display text-3xl font-semibold tracking-[-0.035em]">The nontechnical owner became the test.</h3>
                <p className="mt-5 text-base leading-7 text-muted">
                  MACS had to be understandable to someone running the business, not someone who wanted to become a software administrator. Stacy keeps the company grounded in that reality: plain language, useful outcomes and systems the owner can actually live with.
                </p>
              </article>
              <article className="rounded-[1.75rem] border border-border bg-[#e4ece8] p-7 md:p-9">
                <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#315848]">Stavari · E-commerce + Shopify</p>
                <h3 className="mt-4 font-display text-3xl font-semibold tracking-[-0.035em]">Take the mystery out of selling online.</h3>
                <p className="mt-5 text-base leading-7 text-[#52665d]">
                  Stavari, owner of PostaTees, brings the e-commerce side of MACS: Shopify, store structure, product presentation, UGC creative and the practical work of turning an online store into something a nontechnical owner can understand and operate.
                </p>
              </article>
            </Reveal>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <Reveal className="mx-auto max-w-7xl px-5 md:px-8">
            <Label>Imagine the opposite</Label>
            <h2 className="mt-6 max-w-5xl font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] md:text-7xl">
              A business that uses technology without feeling like a technology business.
            </h2>
            <div className="mt-14 grid gap-px overflow-hidden rounded-[1.75rem] border border-border bg-border md:grid-cols-2">
              {outcomes.map(([title, body]) => (
                <div key={title} className="bg-bg p-7 md:p-9">
                  <h3 className="font-display text-3xl font-semibold tracking-[-0.035em]">{title}</h3>
                  <p className="mt-4 max-w-xl text-base leading-7 text-muted">{body}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-muted">
              The goal is simple: your business should know what it knows, your systems should work together, and the owner should stay in control.
            </p>
          </Reveal>
        </section>

        <section id="system" className="bg-[#102f28] py-20 text-[#f7f3ea] md:py-28">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a9d7c4]">Diagnose first</p>
              <h2 className="mt-6 font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] md:text-7xl">No prescription before diagnosis.</h2>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="font-display text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-4xl">
                You would not trust a doctor who prescribed seven medications before asking what hurts.
              </p>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d1ddd8]">
                Technology should not work that way either. You might need a CRM, automation, AI or a new website. But maybe you do not. We inspect what is really happening first, then recommend the smallest useful intervention.
              </p>
              <div className="mt-9 border-y border-white/20 py-7">
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#a9d7c4]">The MACS no-prescription promise</p>
                <p className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-[-0.03em]">If we do not believe you need a bigger system, we will not sell you one.</p>
              </div>
              <Link href="/audit" className="mt-8 inline-flex rounded-full bg-[#f7f3ea] px-6 py-3.5 text-sm font-bold text-[#102f28]">Start the $497 Vibe Audit</Link>
            </Reveal>
          </div>
        </section>

        <section id="work" className="py-20 md:py-28">
          <Reveal className="mx-auto max-w-7xl px-5 md:px-8">
            <Label>Selected work</Label>
            <h2 className="mt-6 max-w-5xl font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] md:text-7xl">Do not take our word for it. Look at what changed.</h2>

            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              <article className="group flex min-h-[520px] flex-col justify-between rounded-[2rem] bg-[#dfe9e4] p-7 md:p-10">
                <div className="flex items-start justify-between gap-5 text-xs font-bold uppercase tracking-[0.13em] text-[#35584a]">
                  <span>ASC3ND Collective</span>
                  <span>Nonprofit systems</span>
                </div>
                <div>
                  <p className="max-w-xl font-display text-4xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-5xl">Turning a community mission into an organized digital system.</p>
                  <p className="mt-6 max-w-xl text-base leading-7 text-[#52665d]">
                    Strategy, event experience, intake, brand context and operating knowledge organized into a clearer system the organization can keep using.
                  </p>
                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.13em] text-[#35584a]">Mission → context → workflow → ownership</p>
                  <Link href="/work/asc3nd" className="mt-8 inline-block border-b border-[#35584a] pb-1 text-sm font-bold">View case study →</Link>
                </div>
              </article>

              <article className="group flex min-h-[520px] flex-col justify-between rounded-[2rem] bg-[#171b18] p-7 text-[#f7f3ea] md:p-10">
                <div className="flex items-start justify-between gap-5 text-xs font-bold uppercase tracking-[0.13em] text-[#a9bdb4]">
                  <span>MACS</span>
                  <span>Client Zero</span>
                </div>
                <div>
                  <p className="max-w-xl font-display text-4xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-5xl">Building a technology company around a nontechnical founder.</p>
                  <p className="mt-6 max-w-xl text-base leading-7 text-[#b9c5bf]">
                    We used our own company to build and test a structured intake, portable company context and approval-aware operating layer before selling the idea to somebody else.
                  </p>
                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.13em] text-[#a9bdb4]">116 questions → 83 required → one company brain</p>
                  <Link href="/work/macs-client-zero" className="mt-8 inline-block border-b border-[#a9bdb4] pb-1 text-sm font-bold">View case study →</Link>
                </div>
              </article>
            </div>
          </Reveal>
        </section>

        <section className="border-y border-border bg-surface py-20 md:py-28">
          <Reveal className="mx-auto max-w-7xl px-5 md:px-8">
            <Label>The ownership path</Label>
            <div className="mt-6 grid gap-10 lg:grid-cols-[.74fr_1.26fr] lg:gap-20">
              <div>
                <h2 className="font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] md:text-7xl">Start small. Build more only when the diagnosis earns it.</h2>
                <p className="mt-7 max-w-xl text-lg leading-8 text-muted">
                  MAXX Migrations sits at the back of the ladder for companies ready to leave expensive platforms or rebuild a fragmented stack around their own business.
                </p>
              </div>
              <div className="border-b border-border">
                {offers.map((offer) => (
                  <div key={offer.number} className="grid gap-4 border-t border-border py-7 md:grid-cols-[52px_180px_1fr_170px] md:gap-7 md:py-8">
                    <span className="text-xs text-muted">{offer.number}</span>
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.03em]">{offer.title}</h3>
                    <p className="max-w-xl text-sm leading-6 text-muted">{offer.body}</p>
                    <p className="text-xs font-bold uppercase tracking-[0.11em] text-accent md:text-right">{offer.meta}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-12 rounded-[1.75rem] bg-bg p-7 md:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.13em] text-accent">The MAXX handoff</p>
              <h3 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-[1] tracking-[-0.04em] md:text-6xl">Extract → understand → redesign → rebuild → migrate → train → hand over the keys.</h3>
              <p className="mt-6 max-w-3xl text-base leading-7 text-muted">When the engagement is complete, the goal is a system your team understands and can continue operating—with extended MACS support available because you want it, not because leaving would break the business.</p>
            </div>
          </Reveal>
        </section>

        <section className="flex min-h-[62vh] items-center py-20 md:py-28">
          <Reveal className="mx-auto w-full max-w-7xl px-5 md:px-8">
            <div className="grid gap-12 lg:grid-cols-[.82fr_1.18fr] lg:items-end lg:gap-20">
              <div>
                <Label>Tell us what is getting in the way</Label>
                <h2 className="mt-6 font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] md:text-7xl">You do not need to know what technology you need.</h2>
                <p className="mt-7 max-w-xl text-lg leading-8 text-muted">That is what the diagnosis is for.</p>
              </div>
              <div className="border-t border-border pt-8">
                <div className="grid gap-3 text-lg font-semibold md:grid-cols-2">
                  <p className="rounded-2xl bg-surface px-5 py-4">I am paying for too many tools.</p>
                  <p className="rounded-2xl bg-surface px-5 py-4">My systems do not work together.</p>
                  <p className="rounded-2xl bg-surface px-5 py-4">Too much work is still manual.</p>
                  <p className="rounded-2xl bg-surface px-5 py-4">I know AI could help, but I do not know where to start.</p>
                </div>
                <Link href="/audit" data-event="audit_cta_click" className="mt-8 inline-flex rounded-full bg-accent px-7 py-4 text-sm font-bold text-white transition-transform duration-150 active:scale-[0.98]">Start the $497 Vibe Audit</Link>
                <p className="mt-4 text-sm text-muted">We diagnose before we prescribe.</p>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
