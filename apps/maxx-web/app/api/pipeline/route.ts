import { NextRequest, NextResponse } from "next/server";
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

export async function GET(request: NextRequest) {
  // Parse pagination and filtering query params
  const searchParams = request.nextUrl.searchParams;
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100); // cap at 100
  const pipelineId = searchParams.get("pipelineId");
  const stageId = searchParams.get("stageId");
  const contactId = searchParams.get("contactId");

  if (isSeedMode()) {
    let { opportunities } = getStore();

    // Apply filters in-memory
    if (pipelineId) {
      opportunities = opportunities.filter((o) => o.pipelineId === pipelineId);
    }
    if (stageId) {
      opportunities = opportunities.filter((o) => o.stageId === stageId);
    }
    if (contactId) {
      opportunities = opportunities.filter((o) => o.contactId === contactId);
    }

    // Apply pagination
    const total = opportunities.length;
    const paginated = opportunities.slice(offset, offset + limit);

    return NextResponse.json({ opportunities: paginated, total, offset, limit });
  }

  try {
    const supabase = getSupabaseClient();
    const orgId = getCurrentOrgId();

    // Build query with filters
    let query = supabase
      .from("maxx_opportunities")
      .select("*, maxx_contacts(first_name, last_name)", { count: "exact" })
      .eq("organization_id", orgId);

    if (pipelineId) {
      query = query.eq("pipeline_id", pipelineId);
    }
    if (stageId) {
      query = query.eq("stage_id", stageId);
    }
    if (contactId) {
      query = query.eq("contact_id", contactId);
    }

    // Apply ordering and pagination
    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: supabaseErrorStatus(error) });
    }

    const opportunities = (data ?? []).map(mapOpportunityRow);
    const total = count ?? 0;
    return NextResponse.json({ opportunities, total, offset, limit });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = opportunitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid opportunity." }, { status: 400 });
  }

  if (isSeedMode()) {
    const store = getStore();
    const contact = store.contacts.find((c) => c.id === parsed.data.contactId);
    const now = new Date().toISOString();
    const opportunity: Opportunity = {
      id: `opp_${Date.now()}`,
      organizationId: contact?.organizationId ?? "",
      contactName: contact ? `${contact.firstName} ${contact.lastName}` : "Unknown contact",
      currency: "USD",
      createdAt: now,
      updatedAt: now,
      ...parsed.data,
    };

    store.opportunities = [opportunity, ...store.opportunities];
    return NextResponse.json({ opportunity }, { status: 201 });
  }

  try {
    const supabase = getSupabaseClient();
    const orgId = getCurrentOrgId();
    const { pipelineId, stageId, contactId, title, value } = parsed.data;

    const { data: contact, error: contactError } = await supabase
      .from("maxx_contacts")
      .select("first_name, last_name")
      .eq("id", contactId)
      .eq("organization_id", orgId)
      .maybeSingle();

    if (contactError) {
      return NextResponse.json({ error: contactError.message }, { status: supabaseErrorStatus(contactError) });
    }

    const { data, error } = await supabase
      .from("maxx_opportunities")
      .insert([
        {
          organization_id: orgId,
          pipeline_id: pipelineId,
          stage_id: stageId,
          contact_id: contactId,
          title,
          value_cents: Math.round(value * 100),
          currency: "USD",
        },
      ])
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: supabaseErrorStatus(error) });
    }

    const opportunity = mapOpportunityRow({ ...data, maxx_contacts: contact ?? null });
    return NextResponse.json({ opportunity }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
