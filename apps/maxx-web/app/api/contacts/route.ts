import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/contact";
import { getStore } from "@/lib/data/store";
import { isSeedMode } from "@/lib/data/mode";
import { getCurrentOrgId, getSupabaseClient, supabaseErrorStatus } from "@/lib/data/supabase-client";
import { currentOrganization } from "@/lib/mock-data/organizations";
import type { Contact, ContactStatus, ContactSource } from "@/lib/types/contacts";

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
    status: row.status as ContactStatus,
    source: row.source as ContactSource,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    // Not yet backed by a Supabase table (no maxx_contact_notes /
    // maxx_contact_timeline in the deployed schema) — seed mode is still the
    // only place these are populated.
    notes: [],
    timeline: [],
  };
}

export async function GET() {
  // Seed mode: local dev / test suite, no Supabase project required.
  if (isSeedMode()) {
    const { contacts } = getStore();
    return NextResponse.json({ contacts });
  }

  // Prod mode: query Supabase directly. Manually scoped by organization_id
  // (see lib/data/supabase-client.ts for why the service-role client can't
  // rely on maxx_is_org_member RLS alone yet).
  try {
    const supabase = getSupabaseClient();
    const orgId = getCurrentOrgId();
    const { data, error } = await supabase
      .from("maxx_contacts")
      .select("*, maxx_contact_tags(tag)")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: supabaseErrorStatus(error) });
    }

    const contacts = (data ?? []).map(mapContactRow);
    return NextResponse.json({ contacts });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid contact." }, { status: 400 });
  }

  if (isSeedMode()) {
    const now = new Date().toISOString();
    const contact: Contact = {
      id: `contact_${Date.now()}`,
      organizationId: currentOrganization.id,
      ...parsed.data,
      createdAt: now,
      updatedAt: now,
      notes: [],
      timeline: [
        {
          id: `tl_${Date.now()}`,
          contactId: `contact_${Date.now()}`,
          type: "note",
          summary: "Contact created manually",
          createdAt: now,
        },
      ],
    };

    const store = getStore();
    store.contacts = [contact, ...store.contacts];

    return NextResponse.json({ contact }, { status: 201 });
  }

  try {
    const supabase = getSupabaseClient();
    const orgId = getCurrentOrgId();
    const { tags, firstName, lastName, email, phone, status, source } = parsed.data;

    const { data, error } = await supabase
      .from("maxx_contacts")
      .insert([
        {
          organization_id: orgId,
          first_name: firstName,
          last_name: lastName,
          email,
          phone: phone ?? null,
          status,
          source,
        },
      ])
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: supabaseErrorStatus(error) });
    }

    if (tags.length > 0) {
      const { error: tagError } = await supabase
        .from("maxx_contact_tags")
        .insert(tags.map((tag) => ({ organization_id: orgId, contact_id: data.id, tag })));
      if (tagError) {
        return NextResponse.json({ error: tagError.message }, { status: supabaseErrorStatus(tagError) });
      }
    }

    const contact = mapContactRow({ ...data, maxx_contact_tags: tags.map((tag) => ({ tag })) });
    return NextResponse.json({ contact }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
