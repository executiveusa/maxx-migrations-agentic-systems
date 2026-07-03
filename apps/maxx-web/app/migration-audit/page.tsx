import type { Metadata } from "next";
import { MainNav } from "@/components/landing/MainNav";
import { Footer } from "@/components/landing/Footer";
import { MigrationAuditForm } from "@/components/forms/MigrationAuditForm";

export const metadata: Metadata = {
  title: "Migration Audit — Maxx Migrations",
  description:
    "Tell us about your current website and tools. We'll map exactly what a sovereign migration would look like for your organization.",
};

export default function MigrationAuditPage() {
  return (
    <>
      <MainNav />
      <main id="main-content">
        <section className="mx-auto max-w-3xl px-4 py-16">
          <span className="text-xs font-semibold uppercase tracking-wide text-accent">
            Start here
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
            Get your migration audit
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Answer eight questions about your current site, tools, and biggest
            bottleneck. A human from Maxx Migrations reviews every submission
            and follows up with a scoped plan — not a generic sales pitch.
          </p>
          <div className="mt-10">
            <MigrationAuditForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
