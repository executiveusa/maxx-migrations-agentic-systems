import Link from "next/link";
import { MACS_FOUNDER_DATA_URI } from "@/lib/brand-assets";
import { Reveal } from "@/components/landing/MotionPrimitives";

export function FounderBrandStrip() {
  return (
    <section className="border-y border-border bg-surface py-14 md:py-18">
      <Reveal className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-[180px_1fr] md:items-center md:px-8 lg:grid-cols-[240px_1fr] lg:gap-12">
        <figure className="overflow-hidden rounded-[1.5rem] border border-border bg-[#173f35] shadow-[0_18px_48px_rgba(20,35,29,0.12)]">
          <img
            src={MACS_FOUNDER_DATA_URI}
            width={420}
            height={560}
            alt="Stacy and Stavari, the father-and-son team behind MACS Digital Media and MAXX"
            className="aspect-[4/5] h-full w-full object-cover"
          />
        </figure>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">The people behind MAXX</p>
          <h2 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-5xl lg:text-6xl">
            Built by a father and son who got tired of technology making business harder.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted md:text-lg md:leading-8">
            Stacy keeps every system grounded in the nontechnical-owner experience. Stavari, owner of PostaTees, brings the Shopify, e-commerce and UGC side. MAXX grows out of the problems they have had to solve in real businesses—not a software feature list.
          </p>
          <Link href="/#about" className="mt-6 inline-block border-b border-text pb-1 text-sm font-bold">
            Read the father + son story →
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
