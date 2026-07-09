import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/data/store";
import { getSocialProvider } from "@/lib/integrations/social";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const postId = body.postId as string | undefined;
  if (!postId) {
    return NextResponse.json({ error: "postId is required." }, { status: 400 });
  }

  const store = getStore();
  const post = store.socialPosts.find((p) => p.id === postId);
  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const provider = getSocialProvider();
  const result = await provider.publish({
    channels: post.channels,
    copy: post.copy,
    assetDescription: post.assetDescription,
  });

  post.status = result.status;
  post.publishLog = [...post.publishLog, result.message];

  return NextResponse.json({ success: result.success, status: result.status, message: result.message });
}
