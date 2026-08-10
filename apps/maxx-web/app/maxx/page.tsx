import type { Metadata } from "next";
import Link from "next/link";
import { MainNav } from "@/components/landing/MainNav";
import { Footer } from "@/components/landing/Footer";
import { Lift, Reveal } from "@/components/landing/MotionPrimitives";

export const metadata: Metadata = {
  title: "Agent MAXX — Practical AI Products by MACS",
  description:
    "Meet Agent MAXX and the MAXX product family: free and one-off digital tools for nontechnical business owners, plus owner-controlled systems when a bigger build is justified.",
};

const productLanes = [
  {
    label: "Free",
    title: "Agent MAXX",
    state: "In development",
    body: "A downloadable AI operator for people who want useful help without becoming AI engineers. The free release is being designed around plain-English outcomes, portable context and explicit human control.",
  },
  {
    label: "Digital",
    title: "MAXX Drops",
    state: "Product shelf forming",
    body: "Small, repeatable agents, checklists, starter systems, playbooks and operator tools. Build once, deliver repeatedly, and make each one valuable enough to stand on its own.",
  },
  {
    label: "Editorial",
    title: "MAXX Notes",
    state: "Preview live",
    body: "Notes from the Northwest for nontechnical owners dealing with subscriptions, AI, e-commerce, messy systems and the technology work they never wanted to manage.",
  },
  {
    label: "Flagship",
    title: "MAXX Migrations",
    state: "Diagnosis required",
    body: "The high-value transformation for businesses ready to leave expensive platforms or fragmented stacks and rebuild around a system they can own, operate and eventually remove MACS from if they choose.",
  },
];

export default function MaxxPage() {
  return (
    <div className="marketing-shell min-h-screen bg-bg text-text">
      <MainNav />
      <main id="main-content">
        <section className="relative overflow-hidden bg-[#111714] text-[#f7f3ea]">
          <div className="mx-auto grid min-h-[72vh] max-w-7xl gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-32">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a9d7c4]">The product side of MACS</p>
              <h1 className="mt-7 font-display text-[clamp(4.6rem,10vw,9rem)] font-semibold leading-[0.84] tracking-[-0.065em]">
                Meet
                <span className="block text-[#8fc5ae]">MAXX.</span>
              </h1>
              <p className="mt-8 max-w-3xl text-lg leading-8 text-[#cbd7d1] md:text-2xl md:leading-10">
                MAXX is the product family we are building around the same rule as the company: technology should do useful work without forcing the owner to become technical.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <span className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-[#dbe6e1]">Agent MAXX · Free release coming</span>
                <Link href="/blog" className="rounded-full bg-[#f7f3ea] px-6 py-3 text-sm font-bold text-[#111714]">Read MAXX Notes</Link>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="relative aspect-square overflow-hidden rounded-[2.25rem] border border-white/15 bg-[#173f35] p-7 md:p-10">
                <div className="absolute inset-0 opacity-30" aria-hidden="true">
                  <div className="absolute -right-20 -top-16 h-72 w-72 rounded-full border border-white/20" />
                  <div className="absolute -bottom-24 -left-12 h-80 w-80 rounded-full border border-white/10" />
                </div>
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.16em] text-[#b9d8cb]">
                    <span>Agent profile</span>
                    <span>MAXX</span>
                  </div>
                  <div>
                    <p className="font-display text-[clamp(5rem,12vw,10rem)] font-semibold leading-[0.72] tracking-[-0.08em] text-[#f7f3ea]">M<span className="text-[#e85d4a]">X</span></p>
                    <p className="mt-7 max-w-sm text-sm leading-6 text-[#cbdad4]">
                      The approved Agent MAXX avatar will replace this identity panel. We are not inventing a new character while the canonical avatar asset is still outside this repo.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">One brand. Two ways to work with us.</p>
              <h2 className="mt-6 max-w-5xl font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] md:text-7xl">
                Buy the useful thing. Or bring us the whole problem.
              </h2>
            </Reveal>

            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              <Reveal>
                <article className="h-full rounded-[2rem] border border-border bg-surface p-7 md:p-10">
                  <p className="text-xs font-bold uppercase tracking-[0.13em] text-accent">MAXX Products</p>
                  <h3 className="mt-5 font-display text-4xl font-semibold tracking-[-0.04em] md:text-5xl">Low-friction. High usefulness.</h3>
                  <p className="mt-6 max-w-xl text-base leading-7 text-muted">
                    Free tools and paid one-offs should solve one recognizable problem without a consulting engagement. These are the products we can improve once, sell repeatedly and use to earn trust before somebody ever needs a custom system.
                  </p>
                  <p className="mt-8 text-sm font-bold">Agents · starter systems · checklists · templates · operator kits</p>
                </article>
              </Reveal>
              <Reveal delay={0.06}>
                <article className="h-full rounded-[2rem] bg-[#102f28] p-7 text-[#f7f3ea] md:p-10">
                  <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#a9d7c4]">MACS Partnership</p>
                  <h3 className="mt-5 font-display text-4xl font-semibold tracking-[-0.04em] md:text-5xl">Premium diagnosis and transformation.</h3>
                  <p className="mt-6 max-w-xl text-base leading-7 text-[#d1ddd8]">
                    When the problem is bigger than a one-off product, MACS diagnoses first and builds only what the business can justify. MAXX Migrations sits at the high end for companies that want to leave rented platforms and own the replacement.
                  </p>
                  <Link href="/audit" className="mt-8 inline-flex rounded-full bg-[#f7f3ea] px-6 py-3 text-sm font-bold text-[#102f28]">Start with the $497 Vibe Audit</Link>
                </article>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-surface py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">The MAXX shelf</p>
              <h2 className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] md:text-7xl">A product family, not a pile of random offers.</h2>
            </Reveal>

            <div className="mt-14 grid gap-5 md:grid-cols-2">
              {productLanes.map((product) => (
                <Lift key={product.title} className="h-full">
                  <article className="flex h-full min-h-[330px] flex-col justify-between rounded-[1.75rem] border border-border bg-bg p-7 md:p-9">
                    <div className="flex items-center justify-between gap-5 text-[10px] font-bold uppercase tracking-[0.13em] text-muted">
                      <span>{product.label}</span>
                      <span>{product.state}</span>
                    </div>
                    <div>
                      <h3 className="font-display text-4xl font-semibold tracking-[-0.04em]">{product.title}</h3>
                      <p className="mt-5 max-w-xl text-base leading-7 text-muted">{product.body}</p>
                    </div>
                  </article>
                </Lift>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <Reveal className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">Brand architecture</p>
              <h2 className="mt-6 font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] md:text-7xl">Keep the names simple.</h2>
            </div>
            <div className="border-b border-border">
              {[
                ["MACS Digital Media", "The father-and-son company and trusted human relationship."],
                ["MAXX", "The product universe customers see and remember."],
                ["Agent MAXX", "The downloadable AI avatar/operator product."],
                ["MAXX Notes", "Notes from the Northwest: education, problem-solving and practical technology guidance."],
                ["MAXX Migrations", "The flagship high-value ownership and migration transformation."],
                ["Hermes", "Runtime infrastructure under the hood—not the customer-facing brand."],
              ].map(([name, body]) => (
                <div key={name} className="grid gap-3 border-t border-border py-6 md:grid-cols-[190px_1fr] md:gap-8 md:py-7">
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.03em]">{name}</h3>
                  <p className="text-base leading-7 text-muted">{body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
