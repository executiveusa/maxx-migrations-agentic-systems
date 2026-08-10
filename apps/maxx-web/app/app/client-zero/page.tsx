import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ClientZeroReviewConsole } from "@/components/client-zero/ClientZeroReviewConsole";

export const metadata: Metadata = { title: "Client Zero Proof Console" };

export default function ClientZeroPage() {
  return (
    <>
      <PageHeader
        eyebrow="Proof harness"
        title="Client Zero approval gate"
        description="Review a proposed benign CRM note. Rejection must create zero side effects; approval must execute exactly once. This screen never bypasses Supabase auth or the database gate."
      />
      <ClientZeroReviewConsole />
    </>
  );
}
