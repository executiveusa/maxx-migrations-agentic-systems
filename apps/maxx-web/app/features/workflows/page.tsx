import type { Metadata } from "next";
import { FeaturePageLayout } from "@/components/features/FeaturePageLayout";
import { WorkflowBuilderPreviewArtifact } from "@/components/artifacts/WorkflowBuilderPreviewArtifact";

export const metadata: Metadata = {
  title: "Workflow Builder — Maxx Migrations",
  description: "Visual, step-by-step automations without flowchart spaghetti.",
};

export default function WorkflowsFeaturePage() {
  return (
    <FeaturePageLayout
      eyebrow="Recent update"
      title="Workflow Builder"
      description="Build automations as a readable, ordered list of steps — trigger, condition, wait, send, notify, approve — instead of dragging boxes around an infinite canvas."
      appRoute="/app/workflows"
      appRouteLabel="Open Workflow Builder"
      highlights={[
        { title: "Real templates", body: "Start from New Donor Follow-Up, Volunteer Onboarding, Missed Call Recovery, and five more proven templates." },
        { title: "Twelve step types", body: "Trigger, condition, wait, send email, send SMS, create task, update contact, move stage, notify, webhook, AI generate, human approval." },
        { title: "Run history", body: "Every automated run is logged with which steps completed and what triggered it." },
      ]}
      detailTitle="Automation your staff can read without training"
      detailBody="Each workflow renders as plain-language steps in order, so a program director can review or edit a Missed Call Recovery or Grant Application Reminder workflow without learning a flowchart tool."
      artifact={<WorkflowBuilderPreviewArtifact />}
    />
  );
}
