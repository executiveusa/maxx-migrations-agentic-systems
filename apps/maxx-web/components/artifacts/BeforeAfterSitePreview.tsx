"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import type { MigrationJob } from "@/lib/types/migrations";

export function BeforeAfterSitePreview({ job }: { job: MigrationJob }) {
  const [view, setView] = useState<"before" | "after">("after");

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-text">Before / after preview</h3>
        <div className="flex gap-1 rounded-lg border border-border p-1">
          {(["before", "after"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setView(option)}
              className={`rounded-md px-3 py-1 text-xs font-medium ${
                view === option ? "bg-accent-soft text-accent" : "text-muted"
              }`}
            >
              {option === "before" ? "Before" : "After"}
            </button>
          ))}
        </div>
      </div>
      {view === "before" ? (
        <div className="rounded-xl border border-border bg-surface-2 p-6">
          <p className="text-xs text-muted">{job.sourceUrl}</p>
          <p className="mt-2 text-sm text-muted">Legacy site — generic template, no ownership, vendor-hosted.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-accent/40 bg-accent-soft p-6">
          <p className="text-xs text-accent">maxxmigrations.com/{job.id}</p>
          <p className="mt-2 text-sm text-text">Sovereign rebuild — dark canvas, editorial type, owned component system.</p>
          <p className="mt-2 text-xs text-muted">Design audit score: {job.designAuditScore}/100</p>
        </div>
      )}
    </Card>
  );
}
