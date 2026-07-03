import { NextRequest, NextResponse } from "next/server";
import { communityPostSchema } from "@/lib/validation/community";
import { getStore } from "@/lib/data/store";
import { currentOrganization } from "@/lib/mock-data/organizations";
import type { CommunityPost } from "@/lib/types/community";

export async function GET() {
  const { communityPosts } = getStore();
  return NextResponse.json({ posts: communityPosts });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = communityPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid post." }, { status: 400 });
  }

  const post: CommunityPost = {
    id: `post_${Date.now()}`,
    organizationId: currentOrganization.id,
    authorId: "me",
    authorName: "You",
    body: parsed.data.body,
    reactionCount: 0,
    comments: [],
    createdAt: new Date().toISOString(),
  };

  const store = getStore();
  store.communityPosts = [post, ...store.communityPosts];
  return NextResponse.json({ post }, { status: 201 });
}
