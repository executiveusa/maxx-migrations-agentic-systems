import type { Metadata } from "next";
import { isIntegrationConfigured } from "@/lib/data/mode";
import { GhlImportWizard } from "@/components/import/GhlImportWizard";

export const metadata: Metadata = { title: "GHL Import" };

export default function GhlImportPage() {
  const ghlApiConfigured = isIntegrationConfigured("GHL_API_KEY") && isIntegrationConfigured("GHL_LOCATION_ID");
  return <GhlImportWizard ghlApiConfigured={ghlApiConfigured} />;
}
