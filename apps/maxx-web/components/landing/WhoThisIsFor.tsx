const ideal = [
  "Mission-driven nonprofits",
  "Growing social and civic organizations",
  "Agencies and coalitions serving nonprofits",
  "Teams that want to own their tech stack",
  "Organizations seeking AI-powered automation",
  "Groups locked into legacy systems",
];

const notIdeal = [
  "Teams wanting SaaS comfort and zero maintenance",
  "Organizations locked into another CRM long-term",
  "Those needing turnkey support from a large vendor",
  "Departments with no technical capacity to manage code",
  "Orgs that must use enterprise-only platforms",
];

export function WhoThisIsFor() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="font-display text-3xl font-semibold md:text-4xl">
        Who this is for
      </h2>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-medium text-accent">Ideal fit</h3>
          <ul className="mt-6 space-y-3">
            {ideal.map((item) => (
              <li key={item} className="flex gap-3 text-sm">
                <span aria-hidden className="flex-shrink-0 text-accent">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-medium text-accent">Not the right fit</h3>
          <ul className="mt-6 space-y-3">
            {notIdeal.map((item) => (
              <li key={item} className="flex gap-3 text-sm">
                <span aria-hidden className="flex-shrink-0 text-muted">
                  —
                </span>
                <span className="text-muted">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
