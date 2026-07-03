import type { Metadata } from "next";
import { getStore } from "@/lib/data/store";
import { socialAccounts, campaignTemplates } from "@/lib/mock-data/social";
import { SocialPlannerView } from "@/components/social/SocialPlannerView";

export const metadata: Metadata = { title: "Social Planner" };
export const dynamic = "force-dynamic";

export default function SocialPlannerPage() {
  const { socialPosts } = getStore();
  return (
    <SocialPlannerView
      initialPosts={socialPosts}
      accounts={socialAccounts}
      templates={campaignTemplates}
    />
  );
}
