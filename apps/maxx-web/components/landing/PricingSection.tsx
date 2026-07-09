import { Button } from "@/components/ui/Button";

const tiers = [
  {
    name: "Migration Audit",
    price: "$497",
    cadence: "one-time",
    description:
      "For organizations that need a full digital inventory and migration plan before committing further.",
    features: [
      "Site audit",
      "CRM/tool audit",
      "Risk map",
      "Migration roadmap",
      "One strategy call",
    ],
    cta: "Start a Migration Audit",
    featured: false,
  },
  {
    name: "Sovereign Install",
    price: "$4,800–$8,000",
    cadence: "one-time",
    description: "For smaller nonprofits and social-purpose teams.",
    features: [
      "Site clone/rebuild",
      "CRM foundation",
      "Forms",
      "Basic pipeline",
      "Migration dashboard",
      "Deployment handoff",
      "Training session",
    ],
    cta: "Start a Migration Audit",
    featured: true,
  },
  {
    name: "AI Technology Partner",
    price: "$12,000+",
    cadence: "install, plus optional monthly support",
    description:
      "For regional organizations, coalitions, and agencies that want an ongoing AI operating partner.",
    features: [
      "Everything in Sovereign Install",
      "Advanced automations",
      "AI agent setup",
      "SMS/email integrations",
      "Impact dashboards",
      "Monthly optimization",
      "Priority support",
    ],
    cta: "Start a Migration Audit",
    featured: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="border-y border-border bg-surface py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-3xl font-semibold md:text-4xl">
          No endless SaaS rent
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          Start with a one-time sovereign migration install, then decide
          whether you want us as your ongoing AI technology partner.
          Optional maintenance runs $500–$2,500/month depending on
          complexity — never required.
        </p>
        <p className="mt-4 max-w-2xl border-l-2 border-accent pl-4 text-sm font-medium">
          No forced monthly subscription — tools and data ownership transfer entirely to your org.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-2xl border p-6 ${
                tier.featured
                  ? "border-accent bg-accent-soft"
                  : "border-border bg-surface-2"
              }`}
            >
              {tier.featured && (
                <span className="mb-3 inline-block w-fit rounded-full bg-accent px-3 py-1 text-xs font-medium text-bg">
                  Most common starting point
                </span>
              )}
              <h3 className="text-xl font-medium">{tier.name}</h3>
              <p className="mt-2 font-display text-3xl text-accent">
                {tier.price}
              </p>
              <p className="text-xs text-muted">{tier.cadence}</p>
              <p className="mt-3 text-sm text-muted">{tier.description}</p>
              <ul className="mt-6 flex-1 space-y-2 text-sm">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span aria-hidden className="text-accent">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                href="/migration-audit"
                variant={tier.featured ? "primary" : "secondary"}
                className="mt-8"
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
