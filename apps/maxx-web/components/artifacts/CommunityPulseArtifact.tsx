import { Card } from "@/components/ui/Card";
import type { CommunityPost } from "@/lib/types/community";

export function CommunityPulseArtifact({ posts }: { posts: CommunityPost[] }) {
  const totalReactions = posts.reduce((sum, p) => sum + p.reactionCount, 0);
  const totalComments = posts.reduce((sum, p) => sum + p.comments.length, 0);
  const activeAuthors = new Set(posts.map((p) => p.authorId)).size;

  return (
    <Card>
      <h3 className="mb-4 font-display text-lg font-semibold text-text">Community pulse</h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="font-display text-2xl font-semibold text-text">{posts.length}</p>
          <p className="text-xs text-muted">Posts</p>
        </div>
        <div>
          <p className="font-display text-2xl font-semibold text-text">{totalReactions}</p>
          <p className="text-xs text-muted">Reactions</p>
        </div>
        <div>
          <p className="font-display text-2xl font-semibold text-text">{totalComments}</p>
          <p className="text-xs text-muted">Comments</p>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted">{activeAuthors} active contributors this period.</p>
    </Card>
  );
}
