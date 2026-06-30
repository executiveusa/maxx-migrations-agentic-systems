const features = [
  { title: "Owned CRM", body: "Contacts, pipelines, and opportunities — stored in infrastructure you control." },
  { title: "Migration Engine", body: "Crawl, extract, and rebuild your existing site into an owned component system." },
  { title: "AI Agents", body: "Migration, copy, CRM, and review agents that work inside human-set guardrails." },
  { title: "Forms & Intake", body: "Public forms that feed contacts and opportunities directly into your pipeline." },
  { title: "Automations", body: "Recipe-based automations for follow-up, notifications, and handoffs." },
  { title: "Sovereign Hosting", body: "Deploy on infrastructure your organization owns — no vendor lock-in." },
];

export function FeatureStack() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="font-display text-3xl font-semibold md:text-4xl">
        What you own
      </h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <h3 className="text-lg font-medium text-accent">{feature.title}</h3>
            <p className="mt-2 text-muted">{feature.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
