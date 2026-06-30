const steps = [
  {
    n: "01",
    title: "Audit the current site",
    body: "We map your existing website, tools, and data so nothing gets lost in the move.",
  },
  {
    n: "02",
    title: "Clone and map the system",
    body: "We capture structure, copy, and assets, then map them onto an owned component system.",
  },
  {
    n: "03",
    title: "Upgrade UI, CRM, and automations",
    body: "We rebuild the site with a premium design system and connect it to a real CRM and automations.",
  },
  {
    n: "04",
    title: "Hand over the keys",
    body: "You receive owned code, owned data, and a working system — with optional ongoing partnership.",
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
