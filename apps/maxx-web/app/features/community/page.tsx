import type { Metadata } from "next";
import { FeaturePageLayout } from "@/components/features/FeaturePageLayout";

export const metadata: Metadata = {
  title: "Community & Courses — Maxx Migrations",
  description: "A feed, classroom, direct messages, and leaderboards for your team and volunteers.",
};

export default function CommunityFeaturePage() {
  return (
    <FeaturePageLayout
      eyebrow="Recent update"
      title="Community & Courses"
      description="Give your volunteers, donors, and staff one place to post updates, ask questions, message each other directly, and complete onboarding courses — without renting a separate community platform."
      appRoute="/app/community"
      appRouteLabel="Open Community"
      highlights={[
        { title: "Feed", body: "Organization-wide posts with reactions and threaded comments, visible to every member." },
        { title: "Direct messages", body: "One-to-one threads for staff and volunteer coordination outside the public feed." },
        { title: "Leaderboard", body: "Recognizes the volunteers and staff most active in the community and courses." },
      ]}
      detailTitle="Built for mission-driven teams, not internet strangers"
      detailBody="Organizations like Community Garden Initiative and Mutual Aid Kitchen use Community to coordinate shifts, celebrate wins, and keep volunteers connected between events — all inside the same system that holds their donor and pipeline data."
    />
  );
}
