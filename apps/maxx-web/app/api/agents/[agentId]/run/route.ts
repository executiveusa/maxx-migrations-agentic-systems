import { NextRequest, NextResponse } from "next/server";
import { aiAgents } from "@/lib/mock-data/agents";
import { evaluateAgentRun } from "@/lib/agents/agent-runner";
import { recordUsageEvent } from "@/lib/agents/usage-logger";
import type { ModelPolicyName } from "@/lib/agents/model-policy";

export async function POST(request: NextRequest, { params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;
  const agent = aiAgents.find((a) => a.id === agentId);
  if (!agent) {
    return NextResponse.json({ error: "Agent not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const task = typeof body.task === "string" ? body.task : "Ad hoc task";
  const estimatedTokens = typeof body.estimatedTokens === "number" ? body.estimatedTokens : 1000;
  const requiresGeneration = Boolean(body.requiresGeneration);

  const evaluation = evaluateAgentRun(agent, task, estimatedTokens, requiresGeneration);
  if (!evaluation.allowed) {
    return NextResponse.json({ allowed: false, reason: evaluation.reason }, { status: 403 });
  }

  const usage = recordUsageEvent(
    agent.id,
    evaluation.route!.model as ModelPolicyName,
    estimatedTokens,
    Math.round(estimatedTokens * 0.6),
  );

  return NextResponse.json({ allowed: true, reason: evaluation.reason, route: evaluation.route, usage });
}
