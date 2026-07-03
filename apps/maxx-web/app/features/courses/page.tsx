import type { Metadata } from "next";
import { FeaturePageLayout } from "@/components/features/FeaturePageLayout";

export const metadata: Metadata = {
  title: "Courses — Maxx Migrations",
  description: "Onboarding and training courses your staff and volunteers actually finish.",
};

export default function CoursesFeaturePage() {
  return (
    <FeaturePageLayout
      eyebrow="Recent update"
      title="Courses"
      description="Turn your volunteer onboarding, donor stewardship training, board orientation, and grant readiness knowledge into structured courses with modules, lessons, and progress tracking."
      appRoute="/app/community/courses"
      appRouteLabel="Open Courses"
      highlights={[
        { title: "Modules and lessons", body: "Organize training into modules with short, focused lessons and clear duration estimates." },
        { title: "Progress tracking", body: "See exactly which lessons a volunteer or staff member has completed." },
        { title: "Leaderboard credit", body: "Course completions feed the same leaderboard as community participation." },
      ]}
      detailTitle="Training that lives with your data, not in a separate LMS"
      detailBody="Volunteer Onboarding, Donor Stewardship Basics, Board Member Orientation, Grant Readiness Training, and the Community Response Playbook ship as real starter courses you can edit immediately."
    />
  );
}
