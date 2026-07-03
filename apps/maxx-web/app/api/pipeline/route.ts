import { NextRequest, NextResponse } from "next/server";
import { opportunitySchema } from "@/lib/validation/opportunity";
import { getStore } from "@/lib/data/store";
import type { Opportunity } from "@/lib/types/pipeline";

export async function GET() {
  const { opportunities } = getStore();
  return NextResponse.json({ opportunities });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = opportunitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid opportunity." }, { status: 400 });
  }

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
