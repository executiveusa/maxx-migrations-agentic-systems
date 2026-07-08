import type { Metadata } from "next";
import Link from "next/link";
import { MainNav } from "@/components/landing/MainNav";
import { Footer } from "@/components/landing/Footer";
import { featureNavItems } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Features — Maxx Migrations",
  description: "Every feature layer inside your owned Maxx Migrations CRM.",
};

const featureSummaries: Record<string, string> = {
  "/features/community": "A feed, classroom, direct messages, and leaderboards for your team and volunteers.",
  "/features/courses": "Onboarding and training courses your staff and volunteers actually finish.",
  "/features/workflows": "Visual, step-by-step automations without flowchart spaghetti.",
  "/features/social-planner": "Schedule and publish posts to Facebook and Instagram from one calendar.",
  "/features/ghl-import": "Transfer contacts, pipelines, opportunities, notes, and tasks from GoHighLevel.",
  "/features/missed-call-text-back": "Turn missed calls into conversations and recover leads automatically.",
  "/features/website-migration": "Crawl, rewrite, and rebuild your existing site into an owned component system.",
};

export default function FeaturesPage() {
  return (
    <>
      <MainNav />
      <main id="main-content">
        <section className="mx-auto max-w-4xl px-4 py-16">
          <span className="text-xs font-semibold uppercase tracking-wide text-accent">
            The full stack
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
            Everything shipped inside your CRM
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Maxx Migrations is not a website builder with a CRM bolted on. It
            is one owned operating system for migration, fundraising,
            volunteers, and community — built feature by feature into
            infrastructure you control.
          </p>
        </section>
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="grid gap-6 sm:grid-cols-2">
            {featureNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/40 hover:bg-surface-2"
              >
                <h2 className="font-display text-lg font-semibold text-text">{item.label}</h2>
                <p className="mt-2 text-sm text-muted">{featureSummaries[item.href]}</p>
                <span className="mt-4 inline-block text-sm font-medium text-accent">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
