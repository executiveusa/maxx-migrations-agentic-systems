import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { MainNav } from "@/components/landing/MainNav";
import { Footer } from "@/components/landing/Footer";
import { Reveal } from "@/components/landing/MotionPrimitives";
import { SnoqualmieHeroMedia } from "@/components/landing/SnoqualmieHeroMedia";
import { MACS_FOUNDER_DATA_URI } from "@/lib/brand-assets";

export const metadata: Metadata = {
  title: "MACS Digital Media — Technology That Makes Business Flow",
  description:
    "A Pacific Northwest father-and-son company helping nontechnical owners simplify tools, connect systems, reduce repetitive work and keep control of what they build.",
};

const pains = [
  "Paying for software you barely use.",
  "The same customer information living in three different places.",
  "Leads still needing someone to manually chase them down.",
  "Automations so complicated nobody wants to touch them.",
  "Knowing AI could help without knowing where it actually belongs.",
];

const outcomes = [
  ["Fewer tools", "Keep only the technology that earns its place."],
  ["Connected work", "Let information move between the systems that already matter."],
  ["Less babysitting", "Automate repeatable work after the process itself makes sense."],
  ["Owner control", "Keep your data, context and handoff portable instead of becoming trapped."],
];

const offers = [
  {
    number: "01",
    title: "Vibe Audit",
    body: "We inspect what is happening before recommending another platform, automation or build.",
    meta: "$497 · Start here",
  },
  {
    number: "02",
    title: "Vibe Rescue",
    body: "If one bounded blocker is the problem, we fix that before turning it into a giant project.",
    meta: "Fix one blocker",
  },
  {
    number: "03",
    title: "Sovereign Launch",
    body: "When a new system is justified, we build around owner-controlled code, data, context and handoff.",
    meta: "Build what is needed",
  },
  {
    number: "04",
    title: "MAXX Migrations",
    body: "For businesses ready to leave expensive platforms or fragmented stacks and own the replacement.",
    meta: "Flagship transformation",
  },
];

function Label({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`text-xs font-bold uppercase tracking-[0.14em] ${light ? "text-[#c5dfd4]" : "text-accent"}`}>
      {children}
    </p>
  );
}

function NextAction({ href, children, inverse = false }: { href: string; children: ReactNode; inverse?: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition-transform duration-150 active:scale-[0.98] ${
        inverse ? "bg-[#f7f3ea] text-[#102f28]" : "bg-accent text-white"
      }`}
    >
      {children}
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="marketing-shell min-h-screen bg-bg text-text">
      <MainNav />
      <main id="main-content">
        <section className="relative isolate min-h-[78svh] overflow-hidden bg-[#0d1815] text-[#f7f3ea] md:min-h-[84svh]">
          <SnoqualmieHeroMedia />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,20,16,.88)_0%,rgba(7,20,16,.68)_48%,rgba(7,20,16,.25)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0d1815]/65 to-transparent" />

          <div className="relative mx-auto flex min-h-[78svh] max-w-7xl items-end px-5 pb-14 pt-28 md:min-h-[84svh] md:px-8 md:pb-20 lg:items-center lg:pb-16 lg:pt-32">
            <Reveal className="max-w-5xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c5dfd4]">
                Pacific Northwest · Father + Son · Built for nontechnical owners
              </p>
              <h1 className="mt-6 max-w-5xl font-display text-[clamp(3.5rem,8.6vw,8.5rem)] font-semibold leading-[0.86] tracking-[-0.065em]">
                Technology should make your business flow.
                <span className="mt-3 block text-[#a9d7c4]">Not give you another job.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-[#e1ebe7] md:text-xl md:leading-8">
                Tell us what is slowing the business down. We will diagnose the digital side before we prescribe more software, automation or AI.
              </p>
              <div className="mt-8">
                <NextAction href="/audit" inverse>
                  Diagnose it · $497
                </NextAction>
              </div>
              <p className="mt-4 text-xs leading-5 text-[#bfd0c9]">One first step. No platform pitch before the diagnosis.</p>
            </Reveal>
          </div>

          <p className="absolute bottom-3 right-4 hidden text-[10px] text-white/65 md:block">
            Snoqualmie Falls · video by Chris Light · CC BY-SA 4.0
          </p>
        </section>

        <section id="about" className="border-b border-border bg-surface py-20 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16">
            <Reveal>
              <figure className="relative overflow-hidden rounded-[2rem] bg-[#173f35] text-[#f7f3ea]">
                <img
                  src={MACS_FOUNDER_DATA_URI}
                  width={840}
                  height={980}
                  alt="Stacy and Stavari, the father-and-son team behind MACS Digital Media"
                  className="aspect-[5/6] h-full w-full object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-[#102f28]/95 px-6 py-5 md:px-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a9d7c4]">Father + son · Pacific Northwest</p>
                  <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em]">Stacy + Stavari</p>
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={0.05}>
              <Label>This is where MACS came from</Label>
              <h2 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[0.94] tracking-[-0.05em] md:text-7xl">
                We built the business we needed when the technology got too complicated.
              </h2>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
                Stacy is a nontechnical owner. That became the test: if the system required him to become an IT department, it was the wrong system. Stavari, owner of PostaTees, brings the Shopify, e-commerce and UGC side—taking the mystery out of selling online.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
                We work especially well with owners, coaches, mentors, sports programs, nonprofits and community organizations that need better digital systems without another technical job.
              </p>
              <div className="mt-7">
                <Link href="#problems" className="text-sm font-bold text-accent underline decoration-border underline-offset-4">
                  See if this sounds familiar →
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="problems" className="py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
              <Reveal>
                <Label>This was us</Label>
                <h2 className="mt-5 font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] md:text-7xl">
                  The technology was supposed to help. Instead, somebody had to manage it.
                </h2>
              </Reveal>
              <Reveal delay={0.05} className="border-b border-border">
                {pains.map((pain, index) => (
                  <div key={pain} className="grid grid-cols-[42px_1fr] gap-4 border-t border-border py-5 md:grid-cols-[58px_1fr] md:py-6">
                    <span className="pt-1 text-xs font-bold text-accent">0{index + 1}</span>
                    <p className="font-display text-2xl font-semibold leading-tight tracking-[-0.025em] md:text-3xl">{pain}</p>
                  </div>
                ))}
                <div className="border-t border-border py-6">
                  <p className="font-display text-3xl font-semibold tracking-[-0.03em]">Yeah. We were dealing with that too.</p>
                </div>
              </Reveal>
            </div>
            <div className="mt-10">
              <Link href="#outcome" className="text-sm font-bold text-accent underline decoration-border underline-offset-4">
                Show me the opposite →
              </Link>
            </div>
          </div>
        </section>

        <section id="outcome" className="border-y border-border bg-surface py-20 md:py-24">
          <Reveal className="mx-auto max-w-7xl px-5 md:px-8">
            <Label>Imagine the opposite</Label>
            <h2 className="mt-5 max-w-5xl font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] md:text-7xl">
              The business moves. The owner stays in control.
            </h2>
            <div className="mt-10 grid gap-px overflow-hidden rounded-[1.5rem] border border-border bg-border md:grid-cols-2">
              {outcomes.map(([title, body]) => (
                <div key={title} className="bg-bg p-6 md:p-8">
                  <h3 className="font-display text-3xl font-semibold tracking-[-0.035em]">{title}</h3>
                  <p className="mt-3 max-w-xl text-base leading-7 text-muted">{body}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link href="#system" className="text-sm font-bold text-accent underline decoration-border underline-offset-4">
                How do we decide what to fix? →
              </Link>
            </div>
          </Reveal>
        </section>

        <section id="system" className="bg-[#102f28] py-20 text-[#f7f3ea] md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
            <Reveal>
              <Label light>Diagnose first</Label>
              <h2 className="mt-5 font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] md:text-7xl">No prescription before diagnosis.</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="font-display text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-4xl">
                You would not trust a doctor who prescribed seven medications before asking what hurts.
              </p>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#d1ddd8]">
                Technology should not work that way either. Maybe you need a CRM, automation, AI or a new website. Maybe you do not. We inspect the business first and recommend the smallest useful intervention.
              </p>
              <div className="mt-8 border-y border-white/20 py-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#a9d7c4]">The MACS no-prescription promise</p>
                <p className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-[-0.03em]">If we do not believe you need a bigger system, we will not sell you one.</p>
              </div>
              <div className="mt-7">
                <NextAction href="/audit" inverse>
                  Start the $497 diagnosis
                </NextAction>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="work" className="py-20 md:py-24">
          <Reveal className="mx-auto max-w-7xl px-5 md:px-8">
            <Label>Selected work</Label>
            <h2 className="mt-5 max-w-5xl font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] md:text-7xl">Look at what changed.</h2>
            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              <article className="flex min-h-[430px] flex-col justify-between rounded-[1.75rem] bg-[#dfe9e4] p-7 md:p-9">
                <div className="flex items-start justify-between gap-5 text-xs font-bold uppercase tracking-[0.13em] text-[#35584a]">
                  <span>ASC3ND Collective</span>
                  <span>Nonprofit systems</span>
                </div>
                <div>
                  <p className="max-w-xl font-display text-4xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-5xl">Turning a community mission into an organized digital system.</p>
                  <p className="mt-5 max-w-xl text-base leading-7 text-[#52665d]">Strategy, intake, brand context and operating knowledge organized into a clearer system the organization can keep using.</p>
                  <Link href="/work/asc3nd" className="mt-7 inline-block border-b border-[#35584a] pb-1 text-sm font-bold">See what changed →</Link>
                </div>
              </article>

              <article className="flex min-h-[430px] flex-col justify-between rounded-[1.75rem] bg-[#171b18] p-7 text-[#f7f3ea] md:p-9">
                <div className="flex items-start justify-between gap-5 text-xs font-bold uppercase tracking-[0.13em] text-[#a9bdb4]">
                  <span>MACS</span>
                  <span>Client Zero</span>
                </div>
                <div>
                  <p className="max-w-xl font-display text-4xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-5xl">Building a technology company around a nontechnical founder.</p>
                  <p className="mt-5 max-w-xl text-base leading-7 text-[#b9c5bf]">We used our own company to test structured intake, portable business context and approval-aware workflows before selling the idea to somebody else.</p>
                  <Link href="/work/macs-client-zero" className="mt-7 inline-block border-b border-[#a9bdb4] pb-1 text-sm font-bold">See Client Zero →</Link>
                </div>
              </article>
            </div>
          </Reveal>
        </section>

        <section className="border-y border-border bg-surface py-20 md:py-24">
          <Reveal className="mx-auto max-w-7xl px-5 md:px-8">
            <Label>The ownership path</Label>
            <div className="mt-5 grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
              <div>
                <h2 className="font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] md:text-7xl">Start small. Build more only when the diagnosis earns it.</h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-muted">MAXX Migrations sits at the back of the path for companies ready to leave rented platforms or rebuild a fragmented stack around their own business.</p>
              </div>
              <div className="border-b border-border">
                {offers.map((offer) => (
                  <div key={offer.number} className="grid gap-3 border-t border-border py-6 md:grid-cols-[42px_170px_1fr] md:gap-6">
                    <span className="text-xs text-muted">{offer.number}</span>
                    <div>
                      <h3 className="font-display text-2xl font-semibold tracking-[-0.03em]">{offer.title}</h3>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-accent">{offer.meta}</p>
                    </div>
                    <p className="max-w-xl text-sm leading-6 text-muted">{offer.body}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-10 rounded-[1.5rem] bg-bg p-6 md:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.13em] text-accent">The MAXX handoff</p>
              <h3 className="mt-3 max-w-5xl font-display text-4xl font-semibold leading-[1] tracking-[-0.04em] md:text-6xl">Extract → understand → redesign → rebuild → migrate → train → hand over the keys.</h3>
            </div>
          </Reveal>
        </section>

        <section id="home-team" className="bg-[#111714] py-20 text-[#f7f3ea] md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[.86fr_1.14fr] lg:items-end lg:gap-16">
            <Reveal>
              <Label light>Build in public · Home Team Face-Off 001</Label>
              <h2 className="mt-5 font-display text-5xl font-semibold leading-[0.94] tracking-[-0.05em] md:text-7xl">Microsoft Phi vs. Ai2 OLMo.</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="max-w-2xl text-lg leading-8 text-[#cbd7d1]">
                Before we go looking everywhere else, we want to see what open models from our own backyard can actually do for real businesses inside MAXX + ICM.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#aebdb7]">
                We are testing business intake, tool use, company-context retrieval, lead work, e-commerce tasks, local/offline operation, speed, hardware, cost and failure behavior. Technology we test is not automatically a partnership or endorsement.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/maxx" className="inline-flex min-h-12 items-center rounded-full bg-[#f7f3ea] px-6 py-3 text-sm font-bold text-[#111714]">See Agent MAXX</Link>
                <Link href="/blog" className="inline-flex min-h-12 items-center rounded-full border border-white/25 px-6 py-3 text-sm font-bold">Follow the face-off</Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="flex min-h-[58svh] items-center py-20 md:py-24">
          <Reveal className="mx-auto w-full max-w-7xl px-5 md:px-8">
            <div className="grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-end lg:gap-20">
              <div>
                <Label>Your next action</Label>
                <h2 className="mt-5 font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] md:text-7xl">You do not need to know what technology you need.</h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-muted">Tell us what is getting in the way. That is enough to start.</p>
              </div>
              <div className="border-t border-border pt-7">
                <p className="max-w-xl text-base leading-7 text-muted">The Vibe Audit finds the bottleneck, maps what is already there and gives you the next move without forcing a bigger build.</p>
                <div className="mt-7">
                  <NextAction href="/audit">Diagnose my business · $497</NextAction>
                </div>
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
