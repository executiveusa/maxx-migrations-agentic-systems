import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import { communityPosts } from "@/lib/mock-data/community";

export function CommunitySnapshot() {
  return (
    <Card>
      <CardHeader
        title="Community"
        description="Latest activity"
        action={<Link href="/app/community" className="text-sm text-accent">Open community</Link>}
      />
      <ul className="space-y-3">
        {communityPosts.slice(0, 3).map((post) => (
          <li key={post.id} className="rounded-lg border border-border px-4 py-3">
            <p className="text-sm font-medium text-text">{post.authorName}</p>
            <p className="mt-1 line-clamp-2 text-sm text-muted">{post.body}</p>
            <p className="mt-1 text-xs text-muted">{post.reactionCount} reactions · {post.comments.length} comments</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
