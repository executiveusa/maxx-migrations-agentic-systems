import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <div className="max-w-3xl">
        <h1 className="font-display text-4xl font-semibold leading-tight md:text-6xl">
          Sovereign AI migrations for mission-driven teams.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          We clone, upgrade, and connect your existing website into an owned,
          AI-powered CRM system — so your organization stops renting fragile
          SaaS tools and starts building on infrastructure it controls.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button href="/migration-audit">Start a Migration Audit</Button>
          <Button href="/how-it-works" variant="secondary">
            See How It Works
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted">
          One-time install. Owned code. Owned data. Optional AI partnership.
        </p>
      </div>
    </section>
  );
}
