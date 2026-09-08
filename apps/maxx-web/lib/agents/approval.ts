import { getSupabaseAuth } from "@/lib/auth/supabase-auth";
import { executeTool, type ToolName } from "@/lib/agents/tools";

const WRITE_TOOLS = new Set<ToolName>(["create_contact", "move_deal", "delete_contact"]);

function riskFor(toolName: ToolName): "medium" | "high" {
  return toolName === "delete_contact" ? "high" : "medium";
}

export interface PersistedProposal {
  proposalId: string;
  actionHash: string;
  status: string;
  expiresAt?: string | null;
}

export async function persistWriteProposal(input: {
  organizationId: string;
  toolName: ToolName;
  toolInput: unknown;
  idempotencyKey: string;
}): Promise<PersistedProposal> {
  if (!WRITE_TOOLS.has(input.toolName)) throw new Error("Tool is not an approval-gated write tool.");
  const supabase = await getSupabaseAuth();
  const { data, error } = await supabase.rpc("maxx_revenue_create_action_proposal", {
    p_organization_id: input.organizationId,
    p_tool_key: input.toolName,
    p_payload: input.toolInput ?? {},
    p_idempotency_key: input.idempotencyKey,
    p_risk_class: riskFor(input.toolName),
    p_expires_at: null,
  });
  if (error) throw new Error(`Could not persist action proposal: ${error.message}`);
  const row = data as {
    proposal_id?: string;
    action_hash?: string;
    status?: string;
    expires_at?: string | null;
  } | null;
  if (!row?.proposal_id || !row.action_hash) throw new Error("Proposal persistence returned incomplete proof.");
  return {
    proposalId: row.proposal_id,
    actionHash: row.action_hash,
    status: row.status ?? "proposed",
    expiresAt: row.expires_at ?? null,
  };
}

export async function decideAndExecuteProposal(
  proposalId: string,
  decision: "approve" | "reject",
): Promise<Record<string, unknown>> {
  const supabase = await getSupabaseAuth();
  const { data: decisionData, error: decisionError } = await supabase.rpc("maxx_revenue_decide_action_proposal", {
    p_proposal_id: proposalId,
    p_decision: decision,
  });
  if (decisionError) throw new Error(`Could not record approval decision: ${decisionError.message}`);

  if (decision === "reject") {
    return { proposalId, status: "rejected", decision: decisionData ?? null, sideEffects: 0 };
  }

  const { data: claimData, error: claimError } = await supabase.rpc("maxx_revenue_claim_approved_action", {
    p_proposal_id: proposalId,
  });
  if (claimError) throw new Error(`Approved action could not be claimed: ${claimError.message}`);

  const claim = claimData as {
    proposal_id?: string;
    organization_id?: string;
    tool_key?: string;
    action_payload?: unknown;
    action_hash?: string;
  } | null;
  if (!claim?.proposal_id || !claim.organization_id || !claim.tool_key || !claim.action_hash) {
    throw new Error("Approved action claim returned incomplete proof.");
  }
  if (!WRITE_TOOLS.has(claim.tool_key as ToolName)) {
    throw new Error("Claimed proposal references an unsupported write tool.");
  }

  let parsedResult: Record<string, unknown>;
  try {
    const rawResult = await executeTool(claim.tool_key as ToolName, claim.action_payload, claim.organization_id);
    const parsed = JSON.parse(rawResult) as Record<string, unknown>;
    parsedResult = parsed;
  } catch (error) {
    parsedResult = { error: error instanceof Error ? error.message : "Execution failed" };
  }

  const failed = typeof parsedResult.error === "string" && parsedResult.error.length > 0;
  const { data: finishData, error: finishError } = await supabase.rpc("maxx_revenue_finish_action", {
    p_proposal_id: proposalId,
    p_status: failed ? "failed" : "executed",
    p_result: {
      ...parsedResult,
      actionHash: claim.action_hash,
      executedBy: "popebot-approved-tool",
    },
  });
  if (finishError) throw new Error(`Action executed but execution receipt failed: ${finishError.message}`);

  return {
    proposalId,
    status: failed ? "failed" : "executed",
    actionHash: claim.action_hash,
    toolName: claim.tool_key,
    result: parsedResult,
    receipt: finishData ?? null,
  };
}
