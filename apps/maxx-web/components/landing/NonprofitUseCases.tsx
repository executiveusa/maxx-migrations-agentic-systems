const cases = [
  {
    org: "Climate Resilience Lab",
    scenario:
      "A community climate action network like this could route grant deadlines through Workflow Builder and keep board members on a shared Grant Application Reminder automation.",
  },
  {
    org: "Youth Arts Northwest",
    scenario:
      "A youth arts nonprofit could migrate off a legacy site builder, launch a Volunteer Onboarding course, and recover after-hours phone inquiries with Missed Call Text Back.",
  },
  {
    org: "Local Food Bank Coalition",
    scenario:
      "A food bank coalition could import years of contact history from GoHighLevel with the GHL Import Wizard, then run donor stewardship follow-up through the CRM pipeline.",
  },
];

export function NonprofitUseCases() {
  return (
    <section className="border-y border-border bg-surface py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-3xl font-semibold md:text-4xl">
          Built with mission-driven teams
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Illustrative examples of how organizations like these use Maxx
          Migrations — not client testimonials.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {cases.map((c) => (
            <figure
              key={c.org}
              className="rounded-2xl border border-border bg-surface-2 p-6"
            >
              <p className="text-muted">{c.scenario}</p>
              <figcaption className="mt-4 text-sm font-medium">
                {c.org} <span className="text-muted">(illustrative example)</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
