import { NextRequest, NextResponse } from "next/server";
import { decideAndExecuteProposal } from "@/lib/agents/approval";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: Params) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as { decision?: string };
    if (!id) return NextResponse.json({ error: "Proposal id is required." }, { status: 400 });
    if (body.decision !== "approve" && body.decision !== "reject") {
      return NextResponse.json({ error: "Decision must be approve or reject." }, { status: 400 });
    }

    const result = await decideAndExecuteProposal(id, body.decision);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not decide proposal.";
    const status = /auth|membership|owner|admin|approval|actor/i.test(message) ? 403 : /not found/i.test(message) ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
