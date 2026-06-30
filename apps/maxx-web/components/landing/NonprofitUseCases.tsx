const cases = [
  {
    org: "Climate Resilience Lab",
    quote:
      "Placeholder — real testimonial pending client engagement. Do not publish without written permission.",
  },
  {
    org: "Youth Arts Northwest",
    quote:
      "Placeholder — real testimonial pending client engagement. Do not publish without written permission.",
  },
  {
    org: "Local Food Bank Coalition",
    quote:
      "Placeholder — real testimonial pending client engagement. Do not publish without written permission.",
  },
];

export function NonprofitUseCases() {
  return (
    <section className="border-y border-border bg-surface py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-3xl font-semibold md:text-4xl">
          Built with mission-driven teams
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {cases.map((c) => (
            <figure
              key={c.org}
              className="rounded-2xl border border-border bg-surface-2 p-6"
            >
              <blockquote className="text-muted italic">
                &ldquo;{c.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm font-medium">
                {c.org}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
