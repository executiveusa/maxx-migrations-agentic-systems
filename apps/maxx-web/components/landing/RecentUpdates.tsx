import Link from "next/link";

const updates = [
  {
    title: "Community & Courses",
    body: "Community with a feed, classroom, direct messages, and leaderboards.",
    featureHref: "/features/community",
    appHref: "/app/community",
  },
  {
    title: "Workflow Builder",
    body: "Visual, step-by-step automations without flowchart spaghetti.",
    featureHref: "/features/workflows",
    appHref: "/app/workflows",
  },
  {
    title: "Social Media Planner",
    body: "Schedule and publish posts to Facebook and Instagram.",
    featureHref: "/features/social-planner",
    appHref: "/app/social-planner",
  },
  {
    title: "GHL Import Wizard",
    body: "Transfer contacts, pipelines, opportunities, notes, and tasks from GHL.",
    featureHref: "/features/ghl-import",
    appHref: "/app/import/ghl",
  },
  {
    title: "Missed Call Text Back",
    body: "Turn missed calls into conversations and recover leads automatically.",
    featureHref: "/features/missed-call-text-back",
    appHref: "/app/missed-calls",
  },
];

export function RecentUpdates() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="font-display text-3xl font-semibold md:text-4xl">
        Recent updates shipped to your CRM
      </h2>
      <p className="mt-3 max-w-2xl text-muted">
        Every update below is live in the app, not a roadmap slide.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {updates.map((update) => (
          <div key={update.title} className="flex flex-col rounded-2xl border border-border bg-surface p-6">
            <h3 className="text-lg font-medium text-accent">{update.title}</h3>
            <p className="mt-2 flex-1 text-sm text-muted">{update.body}</p>
            <div className="mt-4 flex gap-4 text-sm font-medium">
              <Link href={update.featureHref} className="text-text hover:text-accent">
                Learn more →
              </Link>
              <Link href={update.appHref} className="text-muted hover:text-accent">
                Open in app →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
