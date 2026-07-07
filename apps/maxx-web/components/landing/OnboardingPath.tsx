const steps = [
  {
    number: "1",
    title: "Audit",
    description: "Map your current site, tools, and data.",
  },
  {
    number: "2",
    title: "Map",
    description: "Plan structure, content, and integrations.",
  },
  {
    number: "3",
    title: "Install",
    description: "Deploy system and migrate your data.",
  },
  {
    number: "4",
    title: "30-day onboarding",
    description: "Training, documentation, team alignment.",
  },
  {
    number: "5",
    title: "Optional support",
    description: "Ongoing partnership or full independence.",
  },
];

export function OnboardingPath() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="font-display text-3xl font-semibold md:text-4xl">
        Your migration path
      </h2>
      <p className="mt-3 max-w-2xl text-muted">
        Five phases from audit to handoff.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-5">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent bg-surface">
                  <span className="font-display font-semibold text-accent">
                    {step.number}
                  </span>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden h-0.5 w-full translate-y-6 bg-border md:block" />
              )}
            </div>
            <h3 className="mt-4 font-medium text-accent">{step.title}</h3>
            <p className="mt-2 text-sm text-muted">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
