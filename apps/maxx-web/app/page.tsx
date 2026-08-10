import Link from "next/link";
import { MainNav } from "@/components/landing/MainNav";
import { Footer } from "@/components/landing/Footer";
import { AuditCommand } from "@/components/landing/new-look/AuditCommand";

const programs = [
  {
    number: "01",
    title: "Vibe Audit",
    body: "We map the business, inspect the current stack and customer flow, identify lost revenue, wasted time and risk, then rank the fixes.",
    meta: "$497 · Start here",
  },
  {
    number: "02",
    title: "Vibe Rescue Sprint",
    body: "We fix the single highest-value bounded bottleneck the audit uncovers and define the evidence that proves it worked.",
    meta: "After audit",
  },
  {
    number: "03",
    title: "Sovereign Launch",
    body: "When a deeper system is justified, we build around owner-controlled code, data, context, integrations and a documented handoff.",
    meta: "Scoped proposal",
  },
  {
    number: "04",
    title: "MAXX Operations",
    body: "Optional ongoing optimization: supervised agents, automations, monitoring and operating improvements with human gates.",
    meta: "Optional",
  },
];

const outcomes = [
  ["Get customers", "Capture, qualify, route and follow up with leads without losing them between tools."],
  ["Run the work", "Intake, CRM, workflows, approvals and operating context that reflect how the company actually works."],
  ["Use AI safely", "Agents inspect, summarize and act only inside explicit authority instead of operating as an unbounded black box."],
  ["Keep control", "Code, data, domains, credentials, company context and export paths remain under owner control wherever practical."],
];

const process = [
  ["1", "Tell us what is wrong", "Start with one outcome or bottleneck in plain language. No giant form wall."],
  ["2", "We inspect", "We discover facts from the website, systems, files and data you authorize instead of making you repeat them."],
  ["3", "You get the audit", "You receive the bottleneck, ranked fix, proof requirement, ownership map and recommended next move."],
  ["4", "You choose", "Take the audit, hire us for a Rescue Sprint or Sovereign Launch, or continue with optional operations."],
];

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">{children}</p>;
}

export default function HomePage() {
  return (
    <div className="marketing-shell min-h-screen bg-bg text-text">
      <MainNav />
      <main id="main-content">
        <section className="mx-auto flex min-h-[78vh] max-w-7xl items-end px-5 py-20 md:px-8 md:py-28 lg:py-36">
          <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(220px,.55fr)] lg:items-end">
            <div>
              <Label>Business systems, not more software</Label>
              <h1 className="mt-7 max-w-6xl font-display text-[clamp(3.7rem,8vw,7.7rem)] font-semibold leading-[0.91] tracking-[-0.055em]">
                Find what&apos;s costing you money. Fix the system behind it.
              </h1>
              <p className="mt-8 max-w-3xl text-lg leading-8 text-muted md:text-2xl md:leading-10">
                We inspect how your website, tools, leads, data and daily work actually fit together. Then we show you the highest-value fix before we recommend another build.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <Link
                  href="/audit"
                  data-event="audit_cta_click"
                  className="rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-white transition-transform duration-150 active:scale-[0.98]"
                >
                  Start the $497 Vibe Audit
                </Link>
                <Link href="/work/macs-client-zero" className="border-b border-text pb-1 text-sm font-bold">
                  See Client Zero
                </Link>
              </div>
              <AuditCommand />
            </div>
            <div className="hidden pb-3 lg:block">
              <p className="font-display text-[8rem] font-semibold leading-none tracking-[-0.06em] text-accent">01</p>
              <p className="mt-5 max-w-[14rem] text-sm leading-6 text-muted">
                One front door. One paid first step. No software pitch before diagnosis.
              </p>
            </div>
          </div>
        </section>

        <section id="system" className="bg-surface py-24 md:py-36">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Label>The system</Label>
            <h2 className="mt-6 max-w-5xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.045em] md:text-7xl">
              Diagnose first. Build only what earns its place.
            </h2>
            <div className="mt-16 border-b border-border md:mt-24">
              {programs.map((program) => (
                <div key={program.number} className="grid gap-5 border-t border-border py-8 md:grid-cols-[70px_minmax(0,.8fr)_minmax(0,1.2fr)_180px] md:gap-8 md:py-10">
                  <span className="text-sm text-muted">{program.number}</span>
                  <h3 className="font-display text-3xl font-semibold tracking-[-0.035em] md:text-4xl">{program.title}</h3>
                  <p className="max-w-2xl text-base leading-7 text-muted">{program.body}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent md:text-right">{program.meta}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="bg-[#0f3428] py-24 text-[#f6f3ec] md:py-36">
          <div className="mx-auto grid max-w-7xl gap-16 px-5 md:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
            <div className="border-t border-white/25 pt-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a9d7c4]">Case study · Client Zero</p>
              <p className="mt-10 font-display text-[clamp(5rem,10vw,10rem)] font-semibold leading-none tracking-[-0.06em] text-[#a9d7c4]">116</p>
              <p className="mt-3 max-w-sm text-sm leading-6 text-[#c8d8d2]">Structured business-intake questions organized into a reusable company-brain process.</p>
            </div>
            <div>
              <h2 className="font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] md:text-7xl">
                MACS had the same problem we sell against.
              </h2>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-[#d8e3df]">
                Too much interface, too much offer language, and no durable company-intake operating layer. We reduced the problem into one governed onboarding system before expanding the product.
              </p>
              <div className="mt-12 grid grid-cols-2 border-y border-white/25 md:grid-cols-4">
                {[
                  ["116", "structured questions"],
                  ["83", "required decisions"],
                  ["1", "ICM company brain"],
                  ["0", "fake proof claims"],
                ].map(([value, label]) => (
                  <div key={label} className="border-white/20 px-3 py-6 first:pl-0 md:border-r md:last:border-r-0">
                    <strong className="block font-display text-4xl font-semibold">{value}</strong>
                    <span className="mt-2 block text-xs leading-5 text-[#a9bdb4]">{label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-7 max-w-2xl text-sm leading-6 text-[#a9bdb4]">
                Application build checks passed before merge. Live Supabase tenant-isolation and approval receipts remain a separate release gate and are not presented as completed proof.
              </p>
              <Link href="/work/macs-client-zero" className="mt-8 inline-block border-b border-[#a9d7c4] pb-1 text-sm font-bold text-[#a9d7c4]">
                Read the Client Zero case study
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-36">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
            <div>
              <Label>What we actually build</Label>
              <h2 className="mt-6 font-display text-5xl font-semibold leading-[0.98] tracking-[-0.045em] md:text-7xl">
                Systems your business can use and own.
              </h2>
            </div>
            <div className="border-b border-border">
              {outcomes.map(([title, body]) => (
                <div key={title} className="grid gap-3 border-t border-border py-8 md:grid-cols-[170px_1fr] md:gap-8">
                  <h3 className="text-sm font-bold text-accent">{title}</h3>
                  <p className="max-w-2xl text-lg leading-8 text-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="bg-surface py-24 md:py-36">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Label>Who this is for</Label>
            <h2 className="mt-6 max-w-5xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.045em] md:text-7xl">
              For owners with a real operating problem. Not people shopping for an AI toy.
            </h2>
            <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-2 md:gap-14">
              <div className="border-t border-text pt-7">
                <h3 className="font-display text-3xl font-semibold">Good fit</h3>
                <ul className="mt-6 space-y-4 text-base leading-7 text-muted">
                  <li>Leads, time or visibility are being lost between tools.</li>
                  <li>The team repeats manual work every week.</li>
                  <li>You want AI with human control, evidence and explicit authority.</li>
                  <li>You want control of the delivered system and an exit path.</li>
                </ul>
              </div>
              <div className="border-t border-text pt-7">
                <h3 className="font-display text-3xl font-semibold">Not a fit</h3>
                <ul className="mt-6 space-y-4 text-base leading-7 text-muted">
                  <li>You want a generic chatbot with no measurable business outcome.</li>
                  <li>You want working systems replaced before diagnosis.</li>
                  <li>You want automation designed to bypass approvals or ownership.</li>
                  <li>You will not let the audit inspect the real workflow or available evidence.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-36">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Label>What happens after you click</Label>
            <h2 className="mt-6 max-w-5xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.045em] md:text-7xl">
              You tell us the outcome. We do the investigation.
            </h2>
            <div className="mt-16 border-b border-border md:mt-24">
              {process.map(([number, title, body]) => (
                <div key={number} className="grid gap-4 border-t border-border py-8 md:grid-cols-[70px_minmax(0,.7fr)_minmax(0,1.3fr)] md:gap-8 md:py-10">
                  <span className="text-sm text-muted">{number}</span>
                  <h3 className="font-display text-3xl font-semibold tracking-[-0.035em]">{title}</h3>
                  <p className="max-w-2xl text-base leading-7 text-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex min-h-[66vh] items-center border-t border-border py-24 text-center md:py-36">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <Label>Start with diagnosis</Label>
            <h2 className="mx-auto mt-7 max-w-5xl font-display text-5xl font-semibold leading-[0.96] tracking-[-0.05em] md:text-7xl lg:text-8xl">
              Before we build you anything, let&apos;s find out what is actually worth fixing.
            </h2>
            <Link
              href="/audit"
              data-event="audit_cta_click"
              className="mt-10 inline-flex rounded-full bg-accent px-7 py-4 text-sm font-bold text-white transition-transform duration-150 active:scale-[0.98]"
            >
              Start the $497 Vibe Audit
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
