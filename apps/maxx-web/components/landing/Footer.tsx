import Link from "next/link";

const columns: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/how-it-works", label: "How It Works" },
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/migration-audit", label: "Migration Audit" },
    ],
  },
  {
    title: "Recent Updates",
    links: [
      { href: "/features/community", label: "Community & Courses" },
      { href: "/features/workflows", label: "Workflow Builder" },
      { href: "/features/social-planner", label: "Social Media Planner" },
      { href: "/features/ghl-import", label: "GHL Import Wizard" },
      { href: "/features/missed-call-text-back", label: "Missed Call Text Back" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Use" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="font-display text-lg font-semibold">Maxx Migrations</p>
          <p className="mt-2 text-sm text-muted">
            Sovereign AI infrastructure for Pacific Northwest nonprofits and
            social-purpose teams.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-medium text-muted">{col.title}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-12 text-xs text-muted">
        AI assists with migration, content, support, and automation.
        Sensitive decisions, legal approvals, payment approvals, and final
        public messaging remain under human control.
      </p>
      <p className="mt-4 text-xs text-muted">
        © {new Date().getFullYear()} Maxx Migrations. Not affiliated with or
        endorsed by GoHighLevel, HubSpot, Twilio, Stripe, or Supabase.
      </p>
    </footer>
  );
}
