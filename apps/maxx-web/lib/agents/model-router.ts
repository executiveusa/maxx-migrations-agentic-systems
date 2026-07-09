import type { ModelPolicyName } from "@/lib/agents/model-policy";
import type { ModelRoute } from "@/lib/agents/types";

/**
 * Routes a task to the cheapest model policy that can handle it. Low-token,
 * read-heavy tasks (community digests, missed-call replies) route to Haiku;
 * generative or multi-step tasks (copy rewrites, workflow authoring) route
 * to Sonnet. Nothing routes to Opus automatically — that requires an
 * explicit override, since it is reserved for high-stakes review tasks.
 */
export function routeModel(estimatedTokens: number, requiresGeneration: boolean): ModelRoute {
  if (!requiresGeneration && estimatedTokens < 2000) {
    return {
      model: "claude-haiku-4-5" satisfies ModelPolicyName,
      reason: "Low-complexity, low-token task routed to the fastest model.",
      maxCostPerTaskUsd: 0.05,
    };
  }

  return {
    model: "claude-sonnet-5" satisfies ModelPolicyName,
    reason: "Generative or multi-step task routed to the default reasoning model.",
    maxCostPerTaskUsd: 1,
  };
}
