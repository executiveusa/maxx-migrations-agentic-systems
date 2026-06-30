const faqs = [
  {
    q: "How long does a migration take?",
    a: "Most Sovereign Install projects take 3–6 weeks depending on site size and how much CRM/automation work is included.",
  },
  {
    q: "What's included vs. an add-on?",
    a: "Migration, design upgrade, and a basic CRM/forms foundation are included in every Sovereign Install. SMS, advanced automations, and AI agent setup are part of the AI Technology Partner tier.",
  },
  {
    q: "Do we actually own the code and data afterward?",
    a: "Yes. The Sovereign Install model means you receive the code and data outright. Maintenance and AI partnership are optional, not required.",
  },
  {
    q: "What does ongoing support look like?",
    a: "Optional monthly maintenance ranges from $500–$2,500/month depending on complexity. There is no obligation to continue past the initial install.",
  },
  {
    q: "How does billing work?",
    a: "Migration Audit and Sovereign Install are one-time payments. AI Technology Partner includes an install fee plus optional monthly support, billed transparently with no hidden fees.",
  },
];

export function FAQSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="font-display text-3xl font-semibold md:text-4xl">
        Frequently asked questions
      </h2>
      <dl className="mt-10 space-y-4">
        {faqs.map((faq) => (
          <details
            key={faq.q}
            className="rounded-xl border border-border bg-surface p-5"
          >
            <summary className="cursor-pointer text-lg font-medium">
              {faq.q}
            </summary>
            <p className="mt-3 text-muted">{faq.a}</p>
          </details>
        ))}
      </dl>
    </section>
  );
}
