"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { socialPosts } from "@/lib/mock-data/social";

const filters = ["all", "draft", "scheduled", "published"] as const;

export function SocialCalendarArtifact() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const posts = socialPosts.filter((p) => {
    if (filter === "all") return true;
    if (filter === "scheduled") return p.status === "scheduled" || p.status === "setup_required";
    return p.status === filter;
  });

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-display text-lg font-semibold text-text">Social calendar preview</h3>
        <div className="flex gap-1 rounded-lg border border-border p-1">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-md px-2 py-1 text-xs font-medium ${filter === f ? "bg-accent-soft text-accent" : "text-muted"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
            <span className="truncate pr-4 text-text">{post.copy}</span>
            <StatusPill status={post.status} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
