import type { Metadata } from "next";
import { PipelineView } from "@/components/pipeline/PipelineView";
import { pipeline } from "@/lib/mock-data/pipeline";
import { getOpportunities, getContacts } from "@/lib/supabase/queries";

export const metadata: Metadata = { title: "Pipeline" };
export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const opportunities = await getOpportunities();
  const contacts = await getContacts();
  return (
    <PipelineView
      pipeline={pipeline}
      initialOpportunities={opportunities}
      contacts={contacts.map((c) => ({ id: c.id, name: `${c.firstName} ${c.lastName}` }))}
    />
  );
}
