export type ModelPolicyName = "claude-sonnet-5" | "claude-haiku-4-5" | "claude-opus-4-8";

export interface ModelPricing {
  inputPer1kUsd: number;
  outputPer1kUsd: number;
}

export const MODEL_PRICING: Record<ModelPolicyName, ModelPricing> = {
  "claude-haiku-4-5": { inputPer1kUsd: 0.001, outputPer1kUsd: 0.005 },
  "claude-sonnet-5": { inputPer1kUsd: 0.003, outputPer1kUsd: 0.015 },
  "claude-opus-4-8": { inputPer1kUsd: 0.015, outputPer1kUsd: 0.075 },
};

export function estimateCostUsd(model: ModelPolicyName, tokensIn: number, tokensOut: number): number {
  const pricing = MODEL_PRICING[model];
  return (tokensIn / 1000) * pricing.inputPer1kUsd + (tokensOut / 1000) * pricing.outputPer1kUsd;
}
