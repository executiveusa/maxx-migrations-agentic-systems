import type { Metadata } from "next";
import { FeaturePageLayout } from "@/components/features/FeaturePageLayout";
import { GhlImportMapperArtifact } from "@/components/artifacts/GhlImportMapperArtifact";

export const metadata: Metadata = {
  title: "GHL Import Wizard — Maxx Migrations",
  description: "Transfer contacts, pipelines, opportunities, notes, and tasks from GoHighLevel.",
};

export default function GhlImportFeaturePage() {
  return (
    <FeaturePageLayout
      eyebrow="Recent update"
      title="GHL Import Wizard"
      description="Leave GoHighLevel without losing your data. Map every contact, pipeline, opportunity, note, task, and tag into your owned CRM with a validation report before anything runs."
      appRoute="/app/import/ghl"
      appRouteLabel="Open GHL Import"
      highlights={[
        { title: "CSV or live API", body: "Import from a CSV export today, or connect the GHL API once your credentials are configured." },
        { title: "Field mapping", body: "Auto-suggested field mapping you can review and correct before import." },
        { title: "Validation report", body: "See exactly which rows have errors before you commit, with a downloadable error export." },
      ]}
      detailTitle="A real seven-step wizard, not a single upload button"
      detailBody="Choose source, upload or connect, select objects, map fields, validate, run, and review — each step is a real screen with real state, so nothing about your migration happens invisibly."
      artifact={<GhlImportMapperArtifact />}
    />
  );
}
