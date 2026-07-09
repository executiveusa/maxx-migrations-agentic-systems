import type { Metadata } from "next";
import { FeaturePageLayout } from "@/components/features/FeaturePageLayout";
import { MissedCallRecoveryArtifact } from "@/components/artifacts/MissedCallRecoveryArtifact";

export const metadata: Metadata = {
  title: "Missed Call Text Back — Maxx Migrations",
  description: "Turn missed calls into conversations and recover leads automatically.",
};

export default function MissedCallFeaturePage() {
  return (
    <FeaturePageLayout
      eyebrow="Recent update"
      title="Missed Call Text Back"
      description="Every missed call automatically triggers a text reply within seconds, so a family calling about food access — or a donor calling about a gift — never hits a dead end."
      appRoute="/app/missed-calls"
      appRouteLabel="Open Missed Calls"
      highlights={[
        { title: "Automatic text-back", body: "Configurable delay and templates, sent the moment a call is marked missed." },
        { title: "Opt-out compliance", body: "STOP replies are honored immediately and logged — opted-out numbers are never texted again." },
        { title: "Recovery panel", body: "See every missed call, its text-back status, and the resulting conversation in one place." },
      ]}
      detailTitle="Compliance is enforced, not optional"
      detailBody="Missed Call Text Back only sends when your organization has enabled it, a phone number is configured, and the caller hasn't opted out — every attempt is logged whether it sends or not."
      artifact={<MissedCallRecoveryArtifact />}
    />
  );
}
