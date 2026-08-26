import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient, supabaseErrorStatus } from "@/lib/data/supabase-client";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const receiptToken = request.nextUrl.searchParams.get("receipt");
  if (!receiptToken) {
    return NextResponse.json({ error: "receipt is required." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseClient();

    const { data: submission, error } = await supabase
      .from("maxx_intake_submissions")
      .select("id, status, receipt_token, created_at, updated_at")
      .eq("id", id)
      .eq("receipt_token", receiptToken)
      .single();

    if (error || !submission) {
      return NextResponse.json(
        { error: "Submission not found." },
        { status: error ? supabaseErrorStatus(error) : 404 },
      );
    }

    const { data: proposals, error: proposalError } = await supabase
      .from("maxx_action_proposals")
      .select("id, status, action_type, created_at, reviewed_at, result")
      .eq("intake_submission_id", submission.id)
      .order("created_at", { ascending: true });

    if (proposalError) {
      return NextResponse.json(
        { error: proposalError.message },
        { status: supabaseErrorStatus(proposalError) },
      );
    }

    const proposalIds = (proposals ?? []).map((proposal) => proposal.id);
    let sideEffects = 0;
    if (proposalIds.length > 0) {
      const { count, error: countError } = await supabase
        .from("maxx_client_notes")
        .select("id", { head: true, count: "exact" })
        .in("proposal_id", proposalIds);
      if (countError) {
        return NextResponse.json(
          { error: countError.message },
          { status: supabaseErrorStatus(countError) },
        );
      }
      sideEffects = count ?? 0;
    }

    return NextResponse.json({
      submission: {
        id: submission.id,
        status: submission.status,
        createdAt: submission.created_at,
        updatedAt: submission.updated_at,
      },
      proposals: proposals ?? [],
      proof: {
        sideEffects,
        pendingApproval: (proposals ?? []).some((proposal) => proposal.status === "proposed"),
        rejectedWithoutSideEffect:
          (proposals ?? []).some((proposal) => proposal.status === "rejected") && sideEffects === 0,
        executedExactlyOnce:
          (proposals ?? []).some((proposal) => proposal.status === "executed") && sideEffects === 1,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected receipt error." },
      { status: 500 },
    );
  }
}
