import type { Metadata } from "next";
import { getStore } from "@/lib/data/store";
import { communityMembers, directMessageThreads } from "@/lib/mock-data/community";
import { CommunityView } from "@/components/community/CommunityView";

export const metadata: Metadata = { title: "Community" };
export const dynamic = "force-dynamic";

export default function CommunityPage() {
  const { communityPosts } = getStore();
  return (
    <CommunityView
      initialPosts={communityPosts}
      members={communityMembers}
      threads={directMessageThreads}
    />
  );
}
