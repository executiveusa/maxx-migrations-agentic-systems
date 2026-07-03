import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { DashboardMetricGrid } from "@/components/dashboard/DashboardMetricGrid";
import { MigrationJobsSnapshot } from "@/components/dashboard/MigrationJobsSnapshot";
import { PipelineSnapshot } from "@/components/dashboard/PipelineSnapshot";
import { MissedCallSnapshot } from "@/components/dashboard/MissedCallSnapshot";
import { WorkflowSnapshot } from "@/components/dashboard/WorkflowSnapshot";
import { SocialPlannerSnapshot } from "@/components/dashboard/SocialPlannerSnapshot";
import { CommunitySnapshot } from "@/components/dashboard/CommunitySnapshot";
import { AgentStatusSnapshot } from "@/components/dashboard/AgentStatusSnapshot";
import { currentOrganization } from "@/lib/mock-data/organizations";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title={`Welcome back, ${currentOrganization.name}`}
        description="Everything happening across your migrations, pipeline, workflows, and community in one operator view."
        actions={<Button href="/app/migrations/new">Start a migration</Button>}
      />
      <div className="space-y-8">
        <DashboardMetricGrid />
        <div className="grid gap-6 lg:grid-cols-2">
          <MigrationJobsSnapshot />
          <PipelineSnapshot />
          <WorkflowSnapshot />
          <MissedCallSnapshot />
          <SocialPlannerSnapshot />
          <CommunitySnapshot />
        </div>
        <AgentStatusSnapshot />
      </div>
    </>
  );
}
