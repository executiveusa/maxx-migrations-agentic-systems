import { NextRequest, NextResponse } from "next/server";
import { communityCommentSchema } from "@/lib/validation/community";
import { getStore } from "@/lib/data/store";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = communityCommentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid comment." }, { status: 400 });
  }

  const store = getStore();
  const post = store.communityPosts.find((p) => p.id === parsed.data.postId);
  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const comment = {
    id: `cmt_${Date.now()}`,
    postId: parsed.data.postId,
    authorId: "me",
    authorName: "You",
    body: parsed.data.body,
    createdAt: new Date().toISOString(),
  };
  post.comments = [...post.comments, comment];

  return NextResponse.json({ comment }, { status: 201 });
}
