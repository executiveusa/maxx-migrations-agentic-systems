import type { Metadata } from "next";
import Link from "next/link";
import { MainNav } from "@/components/landing/MainNav";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "ASC3ND Collective — MACS Case Study",
  description:
    "How MACS helped organize ASC3ND Collective's digital presence, event experience, strategy and operating context into a clearer system.",
};

const changes = [
  ["01", "Clarify the public experience", "Reduce the event journey to the information families actually need: what it is, where it is, who it is for and how to RSVP."],
  ["02", "Preserve the mission", "Keep the nonprofit's language and identity authoritative instead of letting the technology rewrite the organization."],
  ["03", "Connect intake to operations", "Structure RSVP and intake so information can move into a usable operating system instead of becoming another disconnected form."],
  ["04", "Organize reusable context", "Turn strategy, brand, campaign and operating decisions into durable context that can support future work without starting from zero."],
];

export default function Asc3ndCaseStudyPage() {
  return (
    <div className="marketing-shell min-h-screen bg-bg text-text">
      <MainNav />
      <main id="main-content">
        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:items-end lg:gap-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">Case study · Nonprofit systems</p>
              <p className="mt-8 text-sm font-bold uppercase tracking-[0.12em] text-muted">ASC3ND Collective</p>
            </div>
            <div>
              <h1 className="max-w-5xl font-display text-[clamp(3.7rem,7vw,7.2rem)] font-semibold leading-[0.91] tracking-[-0.055em]">
                Turning a community mission into an organized digital system.
              </h1>
              <p className="mt-8 max-w-3xl text-xl leading-9 text-muted">
                ASC3ND did not need more random software. It needed its public experience, campaign strategy, intake and organizational knowledge to work together without losing the voice of the nonprofit.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#dfe9e4] py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#35584a]">They came in with</p>
                <h2 className="mt-6 max-w-xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.045em] md:text-6xl">
                  A real mission spread across too many separate digital moments.
                </h2>
              </div>
              <div className="space-y-6 text-lg leading-8 text-[#52665d]">
                <p>Event information had to be easy for families to understand and act on.</p>
                <p>RSVP and intake needed to support the organization instead of creating another manual data island.</p>
                <p>Strategy, brand decisions and campaign knowledge needed a durable home so future work could build on what was already learned.</p>
                <p>Most importantly, the technology had to serve ASC3ND&apos;s language and community purpose—not overwrite it.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">What MACS changed</p>
              <h2 className="mt-6 font-display text-5xl font-semibold leading-[0.98] tracking-[-0.045em] md:text-7xl">Mission → context → workflow → ownership.</h2>
            </div>
            <div className="border-b border-border">
              {changes.map(([number, title, body]) => (
                <div key={number} className="grid gap-4 border-t border-border py-8 md:grid-cols-[55px_190px_1fr] md:gap-7">
                  <span className="text-sm text-muted">{number}</span>
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.03em]">{title}</h3>
                  <p className="text-base leading-7 text-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#102f28] py-20 text-[#f7f3ea] md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a9d7c4]">What this case shows about MACS</p>
            <div className="mt-8 grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
              <h2 className="font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] md:text-7xl">
                The job is not to add technology. The job is to make the organization easier to operate.
              </h2>
              <div className="space-y-7 text-lg leading-8 text-[#d1ddd8]">
                <p>For a nonprofit, that can mean a clearer public experience, reliable intake, less repeated explanation and organizational knowledge that survives beyond one campaign or one vendor.</p>
                <p>That same method is what MACS brings to local businesses: understand the real work first, organize the context, fix the bottleneck, and only add technology when it earns its place.</p>
                <p className="font-semibold text-[#f7f3ea]">The organization keeps its mission, its information and the ability to continue without being trapped inside MACS.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-[55vh] items-center py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-5 text-center md:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">Your business next</p>
            <h2 className="mt-7 font-display text-5xl font-semibold leading-[0.97] tracking-[-0.05em] md:text-7xl">Before adding another tool, find out what is actually in the way.</h2>
            <Link href="/audit" className="mt-10 inline-flex rounded-full bg-accent px-7 py-4 text-sm font-bold text-white">Start the $497 Vibe Audit</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
