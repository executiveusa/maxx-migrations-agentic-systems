import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const decision =
    body && typeof body === "object" && "decision" in body
      ? (body as { decision?: unknown }).decision
      : undefined;

  if (decision !== "approve" && decision !== "reject") {
    return NextResponse.json(
      { error: 'decision must be "approve" or "reject".' },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { data, error } = await supabase.rpc("maxx_review_action_proposal", {
    p_proposal_id: id,
    p_decision: decision,
  });

  if (error) {
    const status =
      error.code === "42501" ? 403 :
      error.code === "P0002" ? 404 :
      error.code === "22023" ? 400 :
      500;
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ reviewer: user.id, review: data });
}
