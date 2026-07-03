import Link from "next/link";
import { currentOrganization } from "@/lib/mock-data/organizations";

export function AppHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border bg-bg px-6 py-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted">Organization</p>
        <p className="font-display text-lg font-semibold text-text">{currentOrganization.name}</p>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/app/settings/integrations"
          className="text-sm text-muted transition-colors hover:text-text"
        >
          Integrations
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:text-text"
        >
          Exit to site
        </Link>
        <div
          aria-hidden
          className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft font-display text-sm font-semibold text-accent"
        >
          {currentOrganization.name.slice(0, 1)}
        </div>
      </div>
    </header>
  );
}
