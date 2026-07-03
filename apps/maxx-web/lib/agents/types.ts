import type { AgentToolPermission } from "@/lib/types/agents";

export interface ModelRoute {
  model: string;
  reason: string;
  maxCostPerTaskUsd: number;
}

export interface AgentTask {
  agentId: string;
  task: string;
  estimatedTokens: number;
}

export interface AgentRunResult {
  allowed: boolean;
  reason: string;
  route?: ModelRoute;
}

export interface ToolPolicyCheck {
  permission: AgentToolPermission;
  granted: boolean;
  reason: string;
}
