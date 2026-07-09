import type { Metadata } from "next";
import { FeaturePageLayout } from "@/components/features/FeaturePageLayout";
import { SocialCalendarArtifact } from "@/components/artifacts/SocialCalendarArtifact";

export const metadata: Metadata = {
  title: "Social Media Planner — Maxx Migrations",
  description: "Schedule and publish posts to Facebook and Instagram from one calendar.",
};

export default function SocialPlannerFeaturePage() {
  return (
    <FeaturePageLayout
      eyebrow="Recent update"
      title="Social Media Planner"
      description="Plan, draft, and schedule posts to your Facebook Page and Instagram Business account from a single content calendar, with campaign templates built for mission-driven storytelling."
      appRoute="/app/social-planner"
      appRouteLabel="Open Social Planner"
      highlights={[
        { title: "Content calendar", body: "See drafts, scheduled posts, and published posts across every connected channel." },
        { title: "Campaign templates", body: "Start from Weekly Meal Count, Volunteer Shoutout, or Donation Appeal templates." },
        { title: "Clear publish status", body: "Every post shows exactly why it hasn't gone live yet — no silent failures." },
      ]}
      detailTitle="Publish status is always accurate"
      detailBody="Until your Meta connection is configured, publish attempts are clearly labeled setup required. Once connected, posts publish for real through the Meta Graph API — with a Postiz adapter available for teams that already run their own scheduling backend."
      artifact={<SocialCalendarArtifact />}
    />
  );
}
