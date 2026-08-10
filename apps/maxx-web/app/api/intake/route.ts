import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient, supabaseErrorStatus } from "@/lib/data/supabase-client";
import { buildClientZeroNote, intakePayloadSchema } from "@/lib/intake/schema";

export const dynamic = "force-dynamic";

const DEFAULT_TENANT_SLUG = "macs-digital-media";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = intakePayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid intake payload." },
      { status: 400 },
    );
  }

  try {
    const supabase = getSupabaseClient();
    const tenantSlug = process.env.MAXX_INTAKE_TENANT_SLUG || DEFAULT_TENANT_SLUG;

    const { data: tenant, error: tenantError } = await supabase
      .from("maxx_icm_tenants")
      .select("id, slug, name")
      .eq("slug", tenantSlug)
      .single();

    if (tenantError || !tenant) {
      return NextResponse.json(
        { error: "Client Zero tenant is not initialized.", detail: tenantError?.message },
        { status: tenantError ? supabaseErrorStatus(tenantError) : 500 },
      );
    }

    const { data: submission, error: submissionError } = await supabase
      .from("maxx_intake_submissions")
      .insert({
        tenant_id: tenant.id,
        status: "normalized",
        schema_version: parsed.data.schema_version,
        answers: parsed.data.answers,
        icm: parsed.data.icm,
        ontology: parsed.data.ontology,
        open_questions: parsed.data.open_questions,
        evidence: parsed.data.evidence,
      })
      .select("id, receipt_token, created_at")
      .single();

    if (submissionError || !submission) {
      return NextResponse.json(
        { error: submissionError?.message ?? "Failed to persist intake." },
        { status: submissionError ? supabaseErrorStatus(submissionError) : 500 },
      );
    }

    const note = buildClientZeroNote(parsed.data);
    const idempotencyKey = `intake:${submission.id}:create-client-note:v1`;

    const { data: proposal, error: proposalError } = await supabase
      .from("maxx_action_proposals")
      .insert({
        tenant_id: tenant.id,
        intake_submission_id: submission.id,
        action_type: "create_client_note",
        action_payload: { note },
        proposed_actor: "maxx-agent",
        idempotency_key: idempotencyKey,
      })
      .select("id, status, action_type, idempotency_key, created_at")
      .single();

    if (proposalError || !proposal) {
      return NextResponse.json(
        { error: proposalError?.message ?? "Failed to create approval proposal." },
        { status: proposalError ? supabaseErrorStatus(proposalError) : 500 },
      );
    }

    const { count: sideEffectCount, error: countError } = await supabase
      .from("maxx_client_notes")
      .select("id", { head: true, count: "exact" })
      .eq("proposal_id", proposal.id);

    if (countError) {
      return NextResponse.json(
        { error: countError.message },
        { status: supabaseErrorStatus(countError) },
      );
    }

    await supabase.from("maxx_evidence_ledger").insert([
      {
        tenant_id: tenant.id,
        intake_submission_id: submission.id,
        event_type: "intake_received",
        actor_type: "client",
        evidence: {
          schema_version: parsed.data.schema_version,
          open_question_count: parsed.data.open_questions.length,
        },
      },
      {
        tenant_id: tenant.id,
        intake_submission_id: submission.id,
        proposal_id: proposal.id,
        event_type: "action_proposed",
        actor_type: "agent",
        evidence: {
          action_type: proposal.action_type,
          idempotency_key: proposal.idempotency_key,
          side_effects_before_approval: sideEffectCount ?? 0,
        },
      },
    ]);

    return NextResponse.json(
      {
        mode: "supabase",
        tenant: { slug: tenant.slug, name: tenant.name },
        submission: {
          id: submission.id,
          receiptToken: submission.receipt_token,
          createdAt: submission.created_at,
        },
        proposal: {
          id: proposal.id,
          status: proposal.status,
          actionType: proposal.action_type,
          sideEffectsBeforeApproval: sideEffectCount ?? 0,
        },
        proof: {
          durableCapture: true,
          normalizedToIcm: true,
          approvalRequired: true,
          sideEffectsBeforeApproval: sideEffectCount ?? 0,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected intake error." },
      { status: 500 },
    );
  }
}
