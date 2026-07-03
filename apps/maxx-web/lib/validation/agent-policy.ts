import { z } from "zod";

export const agentToolPermissions = ["read", "write", "send", "publish", "billing"] as const;

export const agentPolicySchema = z.object({
  agentId: z.string().min(1),
  modelPolicy: z.string().min(1, "Choose a model policy."),
  toolPermissions: z.array(z.enum(agentToolPermissions)),
  monthlyBudgetUsd: z.number().nonnegative(),
});

export type AgentPolicyInput = z.infer<typeof agentPolicySchema>;
