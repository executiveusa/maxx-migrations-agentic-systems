import type { ModelUsageEvent } from "@/lib/types/agents";
import { estimateCostUsd, type ModelPolicyName } from "@/lib/agents/model-policy";

export function recordUsageEvent(
  agentId: string,
  model: ModelPolicyName,
  tokensIn: number,
  tokensOut: number,
): ModelUsageEvent {
  return {
    id: `usage_${Date.now()}`,
    agentId,
    model,
    tokensIn,
    tokensOut,
    costUsd: Number(estimateCostUsd(model, tokensIn, tokensOut).toFixed(4)),
    occurredAt: new Date().toISOString(),
  };
}
