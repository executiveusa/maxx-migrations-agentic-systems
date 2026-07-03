import { MetricCard } from "@/components/ui/MetricCard";
import { pipelineTotal, opportunities } from "@/lib/mock-data/pipeline";
import { contacts } from "@/lib/mock-data/contacts";
import { missedCallEvents } from "@/lib/mock-data/telephony";
import { socialPosts } from "@/lib/mock-data/social";
import { workflows } from "@/lib/mock-data/workflows";
import { migrationJobs } from "@/lib/mock-data/migrations";
import { courseEnrollments } from "@/lib/mock-data/courses";

export function DashboardMetricGrid() {
  const activeWorkflows = workflows.filter((w) => w.status === "active").length;
  const recoveredCalls = missedCallEvents.filter((m) => m.textBackSent).length;
  const scheduledPosts = socialPosts.filter((p) => p.status === "scheduled" || p.status === "setup_required").length;
  const activeMigrations = migrationJobs.filter((j) => j.status !== "published").length;
  const avgCourseProgress = Math.round(
    courseEnrollments.reduce((sum, e) => sum + e.progressPercent, 0) / (courseEnrollments.length || 1),
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard label="Pipeline value" value={`$${pipelineTotal().toLocaleString()}`} helpText={`${opportunities.length} open opportunities`} />
      <MetricCard label="Contacts" value={contacts.length.toString()} helpText="Across all sources" />
      <MetricCard label="Missed calls recovered" value={`${recoveredCalls}/${missedCallEvents.length}`} helpText="Text-back success rate" />
      <MetricCard label="Active workflows" value={activeWorkflows.toString()} helpText={`${workflows.length} total workflows`} />
      <MetricCard label="Scheduled posts" value={scheduledPosts.toString()} helpText="Awaiting publish or connection" />
      <MetricCard label="Active migrations" value={activeMigrations.toString()} helpText={`${migrationJobs.length} total jobs`} />
      <MetricCard label="Avg. course progress" value={`${avgCourseProgress}%`} helpText="Across enrolled staff" />
      <MetricCard label="Community activity" value="3 posts this week" helpText="28 reactions, 3 comments" />
    </div>
  );
}
