const values = [
  {
    title: "Website migration",
    description: "Your existing site rebuilt as owned components on modern infrastructure.",
  },
  {
    title: "CRM foundation",
    description: "Contacts, pipelines, and deals stored in a database you control.",
  },
  {
    title: "Follow-up workflows",
    description: "Automations for lead nurture, task assignment, and opportunity advancement.",
  },
  {
    title: "Content & social planner",
    description: "Calendar and scheduling for public-facing content across channels.",
  },
  {
    title: "30-day onboarding",
    description: "Structured handoff: training sessions, system documentation, team alignment.",
  },
  {
    title: "Code ownership",
    description: "Complete access to source code, deployment pipelines, and infrastructure.",
  },
  {
    title: "Optional AI partnership",
    description: "Continue working with us as your ongoing technology partner — or go independent.",
  },
];

export function ValueStack() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="font-display text-3xl font-semibold md:text-4xl">
        What you get after the audit
      </h2>
      <p className="mt-3 max-w-2xl text-muted">
        A sovereign, AI-powered system built on your infrastructure.
      </p>
      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {values.map((value) => (
          <li
            key={value.title}
            className="rounded-xl border border-border bg-surface p-4"
          >
            <h3 className="font-medium text-accent">{value.title}</h3>
            <p className="mt-2 text-sm text-muted">{value.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
