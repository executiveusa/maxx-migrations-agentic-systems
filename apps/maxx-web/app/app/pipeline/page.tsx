import type { Metadata } from "next";
import { PipelineView } from "@/components/pipeline/PipelineView";
import { pipeline } from "@/lib/mock-data/pipeline";
import { getStore } from "@/lib/data/store";

export const metadata: Metadata = { title: "Pipeline" };
export const dynamic = "force-dynamic";

export default function PipelinePage() {
  const { opportunities, contacts } = getStore();
  return (
    <PipelineView
      pipeline={pipeline}
      initialOpportunities={opportunities}
      contacts={contacts.map((c) => ({ id: c.id, name: `${c.firstName} ${c.lastName}` }))}
    />
  );
}
