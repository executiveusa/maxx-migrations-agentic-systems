// Every row is phrased as a positive claim, so `true` always means
// "good" and renders as a green checkmark for both columns — no
// downside (e.g. vendor lock-in) can accidentally render as a win.
const features = [
  { name: "Code ownership", ghl: false, maxx: true },
  { name: "Data ownership", ghl: false, maxx: true },
  { name: "Custom workflows", ghl: false, maxx: true },
  { name: "Migration support", ghl: false, maxx: true },
  { name: "AI agent toolkit", ghl: false, maxx: true },
  { name: "Handoff & training", ghl: false, maxx: true },
  { name: "No vendor lock-in", ghl: false, maxx: true },
  { name: "No forced monthly subscription", ghl: false, maxx: true },
];

function Mark({ present }: { present: boolean }) {
  return present ? (
    <span className="text-accent">✓</span>
  ) : (
    <span className="text-muted">—</span>
  );
}

export function ComparisonTable() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="max-w-3xl">
        <h2 className="font-display text-3xl font-semibold md:text-4xl">
          Ownership vs. rent
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          GHL and other CRMs can be useful; this comparison shows our
          differentiator.
        </p>
      </div>
      <div className="mt-10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 px-4 text-left font-medium">Feature</th>
              <th className="py-3 px-4 text-center font-medium">GHL</th>
              <th className="py-3 px-4 text-center font-medium">Maxx</th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => (
              <tr key={feature.name} className="border-b border-border">
                <td className="py-3 px-4">{feature.name}</td>
                <td className="py-3 px-4 text-center">
                  <Mark present={feature.ghl} />
                </td>
                <td className="py-3 px-4 text-center">
                  <Mark present={feature.maxx} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
