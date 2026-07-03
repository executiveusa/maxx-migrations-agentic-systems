import { NextRequest, NextResponse } from "next/server";
import { formSchema } from "@/lib/validation/form";
import { getStore } from "@/lib/data/store";
import { currentOrganization } from "@/lib/mock-data/organizations";
import type { CrmForm } from "@/lib/types/forms";

export async function GET() {
  const { forms } = getStore();
  return NextResponse.json({ forms });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = formSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid form." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const formId = `form_${Date.now()}`;
  const form: CrmForm = {
    id: formId,
    organizationId: currentOrganization.id,
    name: parsed.data.name,
    slug: parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    description: parsed.data.description,
    status: "draft",
    submissionCount: 0,
    createdAt: now,
    updatedAt: now,
    fields: parsed.data.fields.map((field, index) => ({
      id: `field_${Date.now()}_${index}`,
      formId,
      order: index + 1,
      ...field,
    })),
  };

  const store = getStore();
  store.forms = [form, ...store.forms];
  return NextResponse.json({ form }, { status: 201 });
}
