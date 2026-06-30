import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="border-y border-border bg-accent-soft py-20">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="font-display text-3xl font-semibold md:text-4xl">
          Ready to own your infrastructure?
        </h2>
        <p className="mt-4 text-muted">
          Start with a Migration Audit and see exactly what a sovereign,
          AI-powered system looks like for your organization.
        </p>
        <div className="mt-8 flex justify-center">
          <Button href="/migration-audit">Start a Migration Audit</Button>
        </div>
      </div>
    </section>
  );
}
