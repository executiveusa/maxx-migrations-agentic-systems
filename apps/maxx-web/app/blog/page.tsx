import type { Metadata } from "next";
import Link from "next/link";
import { MainNav } from "@/components/landing/MainNav";
import { Footer } from "@/components/landing/Footer";
import { Lift, Reveal } from "@/components/landing/MotionPrimitives";

export const metadata: Metadata = {
  title: "Northwest Field Notes — MACS Digital Media",
  description:
    "Plain-English technology notes for nontechnical business owners: fewer subscriptions, simpler systems, useful AI, e-commerce, ownership and practical fixes.",
};

const topics = [
  {
    number: "01",
    category: "Spend less",
    title: "How many software subscriptions does a small business actually need?",
    summary: "A plain-English way to decide what to keep, cancel, consolidate or replace before another monthly charge lands.",
  },
  {
    number: "02",
    category: "Automation",
    title: "Do not automate a broken process.",
    summary: "If the handoff is already confusing, automation usually makes the confusion move faster. Fix the path first.",
  },
  {
    number: "03",
    category: "Ownership",
    title: "GoHighLevel or your own stack? Start with the kind of business you actually run.",
    summary: "All-in-one software can be useful. Ownership can be useful. The right answer depends on control, complexity and what you are trying to escape.",
  },
  {
    number: "04",
    category: "AI without the hype",
    title: "AI is not just a chatbot anymore. Here is what changed for small business.",
    summary: "The useful shift is from asking AI questions to letting approved tools handle boring, repeatable digital work around a clear outcome.",
  },
  {
    number: "05",
    category: "E-commerce",
    title: "UGC ads without the mystery: what a small Shopify store actually needs first.",
    summary: "Stavari breaks the process down into product, proof, hook, footage and one clear next action—without turning the owner into an ad technician.",
  },
  {
    number: "06",
    category: "Business brain",
    title: "Get your business out of your head before you add more AI.",
    summary: "Organize the facts, offers, customers, rules and workflows people keep asking you for. Then the technology has something reliable to work from.",
  },
];

const lanes = [
  ["Spend less", "Subscriptions, software bills and deciding what actually earns its place."],
  ["Connect the mess", "Leads, forms, CRM, follow-up and the awkward gaps between tools."],
  ["AI without the hype", "Agents, automation and practical uses explained without terminal-speak."],
  ["Sell online", "Shopify, e-commerce, UGC and conversion basics for nontechnical owners."],
  ["Own the system", "Data, portability, handoff and what should still belong to you when the project is over."],
  ["Northwest business", "Local operator lessons for small businesses and nonprofits across the Pacific Northwest."],
];

function NorthwestBackdrop() {
  return (
    <svg aria-hidden="true" viewBox="0 0 1600 760" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full opacity-45">
      <path d="M0 620L170 470l90 82 170-210 138 144 118-110 155 176 140-162 180 205 130-104 249 179v140H0Z" fill="#143a30" />
      <path d="M0 665l210-96 118 56 180-94 154 100 156-65 166 89 152-105 164 106 142-61 158 88v77H0Z" fill="#0b201b" />
      <g stroke="#8fb5a6" strokeWidth="2" opacity=".18">
        {Array.from({ length: 18 }).map((_, index) => (
          <path key={index} d={`M${70 + index * 92} 50l-44 148`} />
        ))}
      </g>
    </svg>
  );
}

export default function BlogPage() {
  return (
    <div className="marketing-shell min-h-screen bg-bg text-text">
      <MainNav />
      <main id="main-content">
        <section className="relative isolate overflow-hidden bg-[#0e2b24] text-[#f7f3ea]">
          <NorthwestBackdrop />
          <div className="relative mx-auto min-h-[66vh] max-w-7xl px-5 py-20 md:px-8 md:py-28 lg:flex lg:items-end lg:py-32">
            <Reveal className="max-w-5xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a9d7c4]">Working title · Northwest Field Notes</p>
              <h1 className="mt-7 font-display text-[clamp(4rem,9vw,8.5rem)] font-semibold leading-[0.88] tracking-[-0.06em]">
                Technology for people who have a business to run.
              </h1>
              <p className="mt-8 max-w-3xl text-lg leading-8 text-[#cddbd5] md:text-2xl md:leading-10">
                Down-to-earth field notes from the Pacific Northwest about subscriptions, AI, e-commerce, disconnected systems and the boring digital work nobody started a business to manage.
              </p>
              <div className="mt-8 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.11em] text-[#c5d7cf]">
                <span className="rounded-full border border-white/20 px-4 py-2">Nontechnical first</span>
                <span className="rounded-full border border-white/20 px-4 py-2">No AI theater</span>
                <span className="rounded-full border border-white/20 px-4 py-2">Practical fixes</span>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">Start with the pain</p>
              <h2 className="mt-6 max-w-5xl font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] md:text-7xl">
                The questions owners are already asking when the software stops feeling simple.
              </h2>
            </Reveal>

            <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {topics.map((topic, index) => (
                <Lift key={topic.number} className="h-full">
                  <article className="flex h-full min-h-[360px] flex-col justify-between rounded-[1.75rem] border border-border bg-surface p-6 md:p-8">
                    <div>
                      <div className="flex items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                        <span>Field note {topic.number}</span>
                        <span>{topic.category}</span>
                      </div>
                      <h3 className="mt-8 font-display text-3xl font-semibold leading-[1.02] tracking-[-0.035em] md:text-4xl">{topic.title}</h3>
                    </div>
                    <div>
                      <p className="text-base leading-7 text-muted">{topic.summary}</p>
                      <p className="mt-6 text-xs font-bold uppercase tracking-[0.12em] text-accent">Editorial draft · human review required</p>
                    </div>
                  </article>
                </Lift>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-surface py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">Six lanes. One audience.</p>
              <h2 className="mt-6 font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] md:text-7xl">No terminal required.</h2>
              <p className="mt-7 max-w-xl text-lg leading-8 text-muted">If a nontechnical owner cannot understand what the article is telling them to do next, it is not ready.</p>
            </Reveal>
            <Reveal delay={0.06} className="border-b border-border">
              {lanes.map(([title, body], index) => (
                <div key={title} className="grid gap-3 border-t border-border py-6 md:grid-cols-[46px_190px_1fr] md:gap-7 md:py-7">
                  <span className="text-xs text-muted">0{index + 1}</span>
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.03em]">{title}</h3>
                  <p className="text-base leading-7 text-muted">{body}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <section id="editorial-note" className="py-20 md:py-28">
          <Reveal className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid gap-10 rounded-[2rem] bg-[#171b18] p-7 text-[#f7f3ea] md:p-10 lg:grid-cols-[.78fr_1.22fr] lg:gap-16">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a9d7c4]">How this blog will work</p>
                <h2 className="mt-5 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-6xl">Real questions first. Articles second.</h2>
              </div>
              <div className="space-y-5 text-base leading-7 text-[#c7d2cd]">
                <p>We are seeding the editorial desk with 30 days of customer problems: software cost, failed automation, AI confusion, ownership, Shopify, UGC and the questions local operators keep asking.</p>
                <p>Those dates are coverage slots, not fake publication history. Drafts stay drafts until a human reviews the claims, usefulness and fit.</p>
                <p>When an article is live, it will have a real publication date, clear source notes where needed and one practical next step.</p>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="border-t border-border py-20 text-center md:py-28">
          <Reveal className="mx-auto max-w-5xl px-5 md:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">Have one of these problems now?</p>
            <h2 className="mt-6 font-display text-5xl font-semibold leading-[0.96] tracking-[-0.05em] md:text-7xl">You do not have to become technical before asking for help.</h2>
            <Link href="/audit" className="mt-9 inline-flex rounded-full bg-accent px-7 py-4 text-sm font-bold text-white">Start the $497 Vibe Audit</Link>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
