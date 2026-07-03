import type { AgentToolPermission, AiAgent } from "@/lib/types/agents";
import type { ToolPolicyCheck } from "@/lib/agents/types";

export function checkToolPermission(agent: AiAgent, permission: AgentToolPermission): ToolPolicyCheck {
  if (agent.status !== "active") {
    return { permission, granted: false, reason: `${agent.name} is inactive.` };
  }
  if (!agent.toolPermissions.includes(permission)) {
    return {
      permission,
      granted: false,
      reason: `${agent.name} does not have "${permission}" permission.`,
    };
  }
  return { permission, granted: true, reason: "Permission granted." };
}

export function checkBudget(agent: AiAgent): ToolPolicyCheck {
  if (agent.monthlySpendUsd >= agent.monthlyBudgetUsd) {
    return {
      permission: "write",
      granted: false,
      reason: `${agent.name} has reached its monthly budget of $${agent.monthlyBudgetUsd}.`,
    };
  }
  return { permission: "write", granted: true, reason: "Within budget." };
}
