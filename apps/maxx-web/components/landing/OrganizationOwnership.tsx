const ownership = [
  {
    title: "Code ownership",
    description:
      "You receive the complete source code. Deploy it anywhere — your servers, your cloud account, wherever.",
  },
  {
    title: "Data ownership",
    description:
      "Your contacts, pipelines, and opportunities live in a database you control. No vendor access.",
  },
  {
    title: "Workflow ownership",
    description:
      "Every automation, form, and integration is yours to modify, extend, or replace.",
  },
  {
    title: "Infrastructure ownership",
    description:
      "No monthly SaaS dependency. Deploy once, own the system, pay only for hosting.",
  },
];

export function OrganizationOwnership() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="font-display text-3xl font-semibold md:text-4xl">
        What your organization owns after launch
      </h2>
      <p className="mt-3 max-w-2xl text-muted">
        Complete independence from vendor lock-in.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {ownership.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <h3 className="text-lg font-medium text-accent">{item.title}</h3>
            <p className="mt-3 text-muted">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
