"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { featureNavItems } from "@/lib/nav";

const appRouteByFeature: Record<string, string> = {
  "/features/community": "/app/community",
  "/features/courses": "/app/community/courses",
  "/features/workflows": "/app/workflows",
  "/features/social-planner": "/app/social-planner",
  "/features/ghl-import": "/app/import/ghl",
  "/features/missed-call-text-back": "/app/missed-calls",
  "/features/website-migration": "/app/migrations",
};

export function FeatureParityCommandCenter() {
  const [query, setQuery] = useState("");
  const items = featureNavItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-display text-lg font-semibold text-text">Feature parity command center</h3>
        <input
          aria-label="Filter features"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter…"
          className="w-40 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm"
        />
      </div>
      <ul className="divide-y divide-border">
        {items.map((item) => (
          <li key={item.href} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-text">{item.label}</p>
              <div className="mt-1 flex gap-3 text-xs">
                <Link href={item.href} className="text-accent">Feature page</Link>
                <Link href={appRouteByFeature[item.href] ?? "/app"} className="text-muted hover:text-accent">App route</Link>
              </div>
            </div>
            <StatusPill status="published" />
          </li>
        ))}
      </ul>
    </Card>
  );
}
