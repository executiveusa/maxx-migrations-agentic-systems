import { NextRequest, NextResponse } from "next/server";
import { socialPostSchema } from "@/lib/validation/social";
import { getStore } from "@/lib/data/store";
import { currentOrganization } from "@/lib/mock-data/organizations";
import type { SocialPost } from "@/lib/types/social";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = socialPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid post." }, { status: 400 });
  }

  const post: SocialPost = {
    id: `sp_${Date.now()}`,
    organizationId: currentOrganization.id,
    channels: parsed.data.channels,
    copy: parsed.data.copy,
    assetDescription: parsed.data.assetDescription,
    scheduledFor: parsed.data.scheduledFor,
    campaignTemplateId: parsed.data.campaignTemplateId,
    status: new Date(parsed.data.scheduledFor) > new Date() ? "scheduled" : "draft",
    publishLog: [],
  };

  const store = getStore();
  store.socialPosts = [post, ...store.socialPosts];
  return NextResponse.json({ post }, { status: 201 });
}
