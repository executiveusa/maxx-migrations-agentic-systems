import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { opportunitySchema } from "@/lib/validation/opportunity";
import { getStore } from "@/lib/data/store";
import { isSeedMode } from "@/lib/data/mode";
import { getCurrentOrgId, getSupabaseClient, supabaseErrorStatus } from "@/lib/data/supabase-client";
import type { Opportunity } from "@/lib/types/pipeline";

/** Maps a maxx_opportunities row (+ joined maxx_contacts) to the API's Opportunity shape. */
function mapOpportunityRow(row: {
  id: string;
  organization_id: string;
  pipeline_id: string;
  stage_id: string;
  contact_id: string;
  title: string;
  value_cents: number;
  currency: string;
  created_at: string;
  updated_at: string;
  maxx_contacts?: { first_name: string; last_name: string } | null;
}): Opportunity {
  return {
    id: row.id,
    organizationId: row.organization_id,
    pipelineId: row.pipeline_id,
    stageId: row.stage_id,
    contactId: row.contact_id,
    contactName: row.maxx_contacts
      ? `${row.maxx_contacts.first_name} ${row.maxx_contacts.last_name}`
      : "Unknown contact",
    title: row.title,
    value: row.value_cents / 100,
    currency: (row.currency as "USD") ?? "USD",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Partial opportunity schema for PATCH requests — stageId required for moves, others optional. */
const patchOpportunitySchema = z.object({
  stageId: z.string().min(1, "Stage is required to move this deal."),
  title: z.string().min(2, "Give this opportunity a name.").optional(),
  value: z.number().nonnegative("Value cannot be negative.").optional(),
  contactId: z.string().min(1).optional(),
  pipelineId: z.string().min(1).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();
  const parsed = patchOpportunitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid opportunity data." },
      { status: 400 }
    );
  }

  if (isSeedMode()) {
    const store = getStore();
    const oppIndex = store.opportunities.findIndex((o) => o.id === id);
    if (oppIndex === -1) {
      return NextResponse.json({ error: "Opportunity not found." }, { status: 404 });
    }

    const existing = store.opportunities[oppIndex]!;
    const updated: Opportunity = {
      id: existing.id,
      organizationId: existing.organizationId,
      pipelineId: parsed.data.pipelineId ?? existing.pipelineId,
      stageId: parsed.data.stageId ?? existing.stageId,
      contactId: parsed.data.contactId ?? existing.contactId,
      contactName: existing.contactName,
      title: parsed.data.title ?? existing.title,
      value: parsed.data.value !== undefined ? parsed.data.value : existing.value,
      currency: existing.currency,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    store.opportunities[oppIndex] = updated;
    return NextResponse.json({ opportunity: updated }, { status: 200 });
  }

  try {
    const supabase = getSupabaseClient();
    const orgId = getCurrentOrgId();

    // Build update object with snake_case keys
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (parsed.data.stageId !== undefined) updateData.stage_id = parsed.data.stageId;
    if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
    if (parsed.data.value !== undefined) updateData.value_cents = Math.round(parsed.data.value * 100);
    if (parsed.data.contactId !== undefined) updateData.contact_id = parsed.data.contactId;
    if (parsed.data.pipelineId !== undefined) updateData.pipeline_id = parsed.data.pipelineId;

    const { data, error } = await supabase
      .from("maxx_opportunities")
      .update(updateData)
      .eq("id", id)
      .eq("organization_id", orgId)
      .select("*, maxx_contacts(first_name, last_name)")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: supabaseErrorStatus(error) });
    }

    const opportunity = mapOpportunityRow(data);
    return NextResponse.json({ opportunity }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (isSeedMode()) {
    const store = getStore();
    const oppIndex = store.opportunities.findIndex((o) => o.id === id);
    if (oppIndex === -1) {
      return NextResponse.json({ error: "Opportunity not found." }, { status: 404 });
    }

    store.opportunities.splice(oppIndex, 1);
    return new NextResponse(null, { status: 204 });
  }

  try {
    const supabase = getSupabaseClient();
    const orgId = getCurrentOrgId();

    const { error } = await supabase
      .from("maxx_opportunities")
      .delete()
      .eq("id", id)
      .eq("organization_id", orgId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: supabaseErrorStatus(error) });
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
