import type { AiAgent } from "@/lib/types/agents";
import type { AgentRunResult } from "@/lib/agents/types";
import { routeModel } from "@/lib/agents/model-router";
import { checkBudget, checkToolPermission } from "@/lib/agents/tool-policy";

export function evaluateAgentRun(
  agent: AiAgent,
  task: string,
  estimatedTokens: number,
  requiresGeneration: boolean,
): AgentRunResult {
  const permissionCheck = checkToolPermission(agent, requiresGeneration ? "write" : "read");
  if (!permissionCheck.granted) {
    return { allowed: false, reason: permissionCheck.reason };
  }

  const budgetCheck = checkBudget(agent);
  if (!budgetCheck.granted) {
    return { allowed: false, reason: budgetCheck.reason };
  }

  const route = routeModel(estimatedTokens, requiresGeneration);
  return {
    allowed: true,
    reason: `${agent.name} approved to run "${task}".`,
    route,
  };
}
