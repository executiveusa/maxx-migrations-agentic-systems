import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/contact";
import { getStore } from "@/lib/data/store";
import { isSeedMode } from "@/lib/data/mode";
import { getCurrentOrgId, getSupabaseClient, supabaseErrorStatus } from "@/lib/data/supabase-client";
import type { Contact } from "@/lib/types/contacts";

/** Maps a maxx_contacts row (+ joined maxx_contact_tags) to the API's Contact shape. */
function mapContactRow(row: {
  id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
  maxx_contact_tags?: Array<{ tag: string }> | null;
}): Contact {
  return {
    id: row.id,
    organizationId: row.organization_id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone ?? undefined,
    tags: (row.maxx_contact_tags ?? []).map((t) => t.tag),
    status: row.status as Contact["status"],
    source: row.source as Contact["source"],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    notes: [],
    timeline: [],
  };
}

/** Partial contact schema for PATCH requests — all fields optional. */
const partialContactSchema = contactSchema.partial();

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();
  const parsed = partialContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid contact data." },
      { status: 400 },
    );
  }

  if (isSeedMode()) {
    const store = getStore();
    const contactIndex = store.contacts.findIndex((c) => c.id === id);
    if (contactIndex === -1) {
      return NextResponse.json({ error: "Contact not found." }, { status: 404 });
    }

    const existing = store.contacts[contactIndex]!;
    const updated: Contact = {
      id: existing.id,
      organizationId: existing.organizationId,
      firstName: parsed.data.firstName ?? existing.firstName,
      lastName: parsed.data.lastName ?? existing.lastName,
      email: parsed.data.email ?? existing.email,
      phone: parsed.data.phone !== undefined ? parsed.data.phone : existing.phone,
      tags: parsed.data.tags ?? existing.tags,
      status: parsed.data.status ?? existing.status,
      source: parsed.data.source ?? existing.source,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
      notes: existing.notes,
      timeline: existing.timeline,
    };

    store.contacts[contactIndex] = updated;
    return NextResponse.json({ contact: updated }, { status: 200 });
  }

  try {
    const supabase = getSupabaseClient();
    const orgId = getCurrentOrgId();

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (parsed.data.firstName !== undefined) updateData.first_name = parsed.data.firstName;
    if (parsed.data.lastName !== undefined) updateData.last_name = parsed.data.lastName;
    if (parsed.data.email !== undefined) updateData.email = parsed.data.email;
    if (parsed.data.phone !== undefined) updateData.phone = parsed.data.phone ?? null;
    if (parsed.data.status !== undefined) updateData.status = parsed.data.status;
    if (parsed.data.source !== undefined) updateData.source = parsed.data.source;

    const { data, error } = await supabase
      .from("maxx_contacts")
      .update(updateData)
      .eq("id", id)
      .eq("organization_id", orgId)
      .select("*, maxx_contact_tags(tag)")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: supabaseErrorStatus(error) });
    }

    if (parsed.data.tags !== undefined) {
      const { error: deleteError } = await supabase
        .from("maxx_contact_tags")
        .delete()
        .eq("contact_id", id);
      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: supabaseErrorStatus(deleteError) });
      }

      if (parsed.data.tags.length > 0) {
        const { error: insertError } = await supabase
          .from("maxx_contact_tags")
          .insert(parsed.data.tags.map((tag) => ({ organization_id: orgId, contact_id: id, tag })));
        if (insertError) {
          return NextResponse.json({ error: insertError.message }, { status: supabaseErrorStatus(insertError) });
        }
      }
    }

    const contact = mapContactRow(data);
    return NextResponse.json({ contact }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  if (isSeedMode()) {
    const store = getStore();
    const contactIndex = store.contacts.findIndex((c) => c.id === id);
    if (contactIndex === -1) {
      return NextResponse.json({ error: "Contact not found." }, { status: 404 });
    }

    store.contacts.splice(contactIndex, 1);
    return new NextResponse(null, { status: 204 });
  }

  try {
    const supabase = getSupabaseClient();
    const orgId = getCurrentOrgId();

    const { error } = await supabase
      .from("maxx_contacts")
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
