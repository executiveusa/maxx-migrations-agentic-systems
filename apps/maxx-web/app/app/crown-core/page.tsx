import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { CrownOfferConsole } from "@/components/crown-core/CrownOfferConsole";

export const metadata: Metadata = { title: "Crown & Core · Vibe Audit" };

export default function CrownAndCoreInternalPage() {
  return (
    <>
      <PageHeader eyebrow="MACS / MAXX · Internal only"
        title="Crown & Core"
        description="Evidence-led Vibe Audit preparation and independent review. Crown & Core has not signed or approved a production service. Nothing here publishes, books, sends or executes a client action." />
      <CrownOfferConsole />
    </>
  );
}
