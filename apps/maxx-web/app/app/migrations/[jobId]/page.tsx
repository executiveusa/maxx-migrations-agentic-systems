import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStore } from "@/lib/data/store";
import { MigrationJobDetailView } from "@/components/migrations/MigrationJobDetailView";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ jobId: string }>;
}): Promise<Metadata> {
  const { jobId } = await params;
  const job = getStore().migrationJobs.find((j) => j.id === jobId);
  return { title: job ? job.sourceUrl.replace(/^https?:\/\//, "") : "Migration" };
}

export default async function MigrationJobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const job = getStore().migrationJobs.find((j) => j.id === jobId);
  if (!job) notFound();
  return <MigrationJobDetailView job={job} />;
}
