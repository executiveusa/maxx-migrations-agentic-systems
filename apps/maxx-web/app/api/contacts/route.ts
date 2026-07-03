import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/contact";
import { getStore } from "@/lib/data/store";
import { currentOrganization } from "@/lib/mock-data/organizations";
import type { Contact } from "@/lib/types/contacts";

export async function GET() {
  const { contacts } = getStore();
  return NextResponse.json({ contacts });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid contact." }, { status: 400 });
  }

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
