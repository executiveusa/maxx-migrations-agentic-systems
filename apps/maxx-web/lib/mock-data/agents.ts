import type { AgentSession, AiAgent } from "@/lib/types/agents";

export const aiAgents: AiAgent[] = [
  { id: "agent_migration", name: "Migration Agent", description: "Crawls source sites and orchestrates the migration pipeline.", modelPolicy: "claude-sonnet-5", status: "active", toolPermissions: ["read", "write"], monthlyBudgetUsd: 150, monthlySpendUsd: 42.1 },
  { id: "agent_copy", name: "Copy Agent", description: "Rewrites extracted page copy into the Maxx voice.", modelPolicy: "claude-sonnet-5", status: "active", toolPermissions: ["read", "write"], monthlyBudgetUsd: 100, monthlySpendUsd: 18.4 },
  { id: "agent_workflow", name: "Workflow Agent", description: "Builds and tunes automation workflows from templates.", modelPolicy: "claude-sonnet-5", status: "active", toolPermissions: ["read", "write"], monthlyBudgetUsd: 60, monthlySpendUsd: 9.8 },
  { id: "agent_crm", name: "CRM Agent", description: "Keeps contact and pipeline data clean and current.", modelPolicy: "claude-haiku-4-5", status: "active", toolPermissions: ["read", "write"], monthlyBudgetUsd: 40, monthlySpendUsd: 6.2 },
  { id: "agent_community", name: "Community Agent", description: "Surfaces community activity and drafts moderator digests.", modelPolicy: "claude-haiku-4-5", status: "active", toolPermissions: ["read"], monthlyBudgetUsd: 30, monthlySpendUsd: 4.1 },
  { id: "agent_course", name: "Course Agent", description: "Recommends next courses based on completion history.", modelPolicy: "claude-haiku-4-5", status: "inactive", toolPermissions: ["read"], monthlyBudgetUsd: 20, monthlySpendUsd: 0 },
  { id: "agent_social", name: "Social Planner Agent", description: "Drafts and schedules social copy from campaign templates.", modelPolicy: "claude-sonnet-5", status: "active", toolPermissions: ["read", "write", "publish"], monthlyBudgetUsd: 50, monthlySpendUsd: 11.3 },
  { id: "agent_import", name: "Import Agent", description: "Maps and validates GHL import records.", modelPolicy: "claude-sonnet-5", status: "active", toolPermissions: ["read", "write"], monthlyBudgetUsd: 40, monthlySpendUsd: 7.6 },
  { id: "agent_missed_call", name: "Missed Call Agent", description: "Sends compliant text-back replies for missed calls.", modelPolicy: "claude-haiku-4-5", status: "active", toolPermissions: ["read", "send"], monthlyBudgetUsd: 25, monthlySpendUsd: 3.9 },
  { id: "agent_qa", name: "QA Agent", description: "Runs the route, link, and banned-content harness checks before every publish.", modelPolicy: "claude-sonnet-5", status: "active", toolPermissions: ["read"], monthlyBudgetUsd: 30, monthlySpendUsd: 5.0 },
];

export const agentSessions: AgentSession[] = [
  { id: "sess_1", agentId: "agent_migration", task: "Crawl youtharts-northwest.wixsite.com", status: "running", startedAt: "2026-07-02T08:00:00.000Z", tokensUsed: 18400 },
  { id: "sess_2", agentId: "agent_copy", task: "Rewrite riversidemutualaid donate page", status: "completed", startedAt: "2026-05-04T09:00:00.000Z", finishedAt: "2026-05-04T09:12:00.000Z", tokensUsed: 9200 },
  { id: "sess_3", agentId: "agent_missed_call", task: "Send text-back for missed call from +15035550199", status: "completed", startedAt: "2026-07-01T15:20:05.000Z", finishedAt: "2026-07-01T15:20:07.000Z", tokensUsed: 620 },
];
