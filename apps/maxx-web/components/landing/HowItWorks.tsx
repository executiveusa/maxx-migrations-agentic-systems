const steps = [
  {
    n: "01",
    title: "Audit",
    body: "We understand your stack, existing vendors, and pain points. One strategy call to align on vision.",
  },
  {
    n: "02",
    title: "Map",
    body: "Design the CRM and workflows for your org. Configure contacts, pipeline, forms, and automations.",
  },
  {
    n: "03",
    title: "Install",
    body: "Set up Maxx platform, import contacts, configure integrations—SMS text-back, social planner, community.",
  },
  {
    n: "04",
    title: "30-day onboarding",
    body: "Hands-on setup, staff training, workflow testing. Forms, courses, and documentation included.",
  },
  {
    n: "05",
    title: "Optional partner",
    body: "Ongoing AI agent support, quarterly reviews, new workflow development. Monthly fee optional.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="font-display text-3xl font-semibold md:text-4xl">
        How it works
      </h2>
      <ol className="mt-10 grid gap-8 md:grid-cols-2">
        {steps.map((step) => (
          <li
            key={step.n}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <span className="font-display text-2xl text-accent">{step.n}</span>
            <h3 className="mt-3 text-xl font-medium">{step.title}</h3>
            <p className="mt-2 text-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
