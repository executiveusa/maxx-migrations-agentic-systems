const orgTypes = [
  "Community Garden Initiative",
  "Housing Justice Collective",
  "Youth Arts Northwest",
  "Climate Resilience Lab",
  "Mutual Aid Kitchen",
  "Indigenous Language Project",
  "Local Food Bank Coalition",
];

export function ProofPanel() {
  return (
    <section
      aria-label="Who we serve"
      className="border-y border-border bg-surface py-10"
    >
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-center text-sm uppercase tracking-wide text-muted">
          Built for Pacific Northwest social-purpose organizations like
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted">
          {orgTypes.map((org) => (
            <li key={org} className="rounded-full border border-border px-4 py-2">
              {org}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
