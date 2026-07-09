export type AgentToolPermission = "read" | "write" | "send" | "publish" | "billing";

export interface AiAgent {
  id: string;
  name: string;
  description: string;
  modelPolicy: string;
  status: "active" | "inactive";
  toolPermissions: AgentToolPermission[];
  monthlyBudgetUsd: number;
  monthlySpendUsd: number;
}

export interface AgentSession {
  id: string;
  agentId: string;
  task: string;
  status: "completed" | "running" | "failed" | "awaiting_approval";
  startedAt: string;
  finishedAt?: string;
  tokensUsed: number;
}

export interface ModelUsageEvent {
  id: string;
  agentId: string;
  model: string;
  tokensIn: number;
  tokensOut: number;
  costUsd: number;
  occurredAt: string;
}
