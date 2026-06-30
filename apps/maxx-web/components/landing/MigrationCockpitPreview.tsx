const panels = [
  { label: "Migration Job", value: "Crawling 18 pages" },
  { label: "Contacts Synced", value: "342" },
  { label: "Pipeline Stage", value: "Mapping → Rewriting" },
  { label: "AI Agent", value: "Copy Agent: active" },
];

export function MigrationCockpitPreview() {
  return (
    <section className="border-y border-border bg-surface py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-3xl font-semibold md:text-4xl">
          Inside the Migration Cockpit
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          A single dashboard for your migration job, contacts, pipeline, and
          AI agents — owned by your organization from day one.
        </p>
        <div className="mt-10 grid gap-4 rounded-2xl border border-border bg-surface-2 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {panels.map((panel) => (
            <div key={panel.label} className="rounded-xl bg-bg p-4">
              <p className="text-xs uppercase tracking-wide text-muted">
                {panel.label}
              </p>
              <p className="mt-2 font-display text-lg text-accent">
                {panel.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
