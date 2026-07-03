import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { socialPosts } from "@/lib/mock-data/social";

export function SocialPlannerSnapshot() {
  return (
    <Card>
      <CardHeader
        title="Social planner"
        description="Upcoming and recent posts"
        action={<Link href="/app/social-planner" className="text-sm text-accent">Open planner</Link>}
      />
      <ul className="space-y-2">
        {socialPosts.map((post) => (
          <li key={post.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5">
            <span className="truncate pr-4 text-sm text-text">{post.copy}</span>
            <StatusPill status={post.status} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
