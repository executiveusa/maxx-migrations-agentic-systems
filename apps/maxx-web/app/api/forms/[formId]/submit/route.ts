import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/data/store";
import type { FormSubmission } from "@/lib/types/forms";

export async function POST(request: NextRequest, { params }: { params: Promise<{ formId: string }> }) {
  const { formId } = await params;
  const store = getStore();
  const form = store.forms.find((f) => f.id === formId);
  if (!form) {
    return NextResponse.json({ error: "Form not found." }, { status: 404 });
  }
  if (form.status !== "published") {
    return NextResponse.json({ error: "This form is not published yet." }, { status: 400 });
  }

  const body = await request.json();
  const data: Record<string, string> = typeof body === "object" && body !== null ? body : {};

  const requiredFields = form.fields.filter((f) => f.required);
  for (const field of requiredFields) {
    if (!data[field.label]?.toString().trim()) {
      return NextResponse.json({ error: `"${field.label}" is required.` }, { status: 400 });
    }
  }

  const submission: FormSubmission = {
    id: `sub_${Date.now()}`,
    formId,
    data,
    createdAt: new Date().toISOString(),
  };

  store.formSubmissions = [submission, ...store.formSubmissions];
  form.submissionCount += 1;

  return NextResponse.json({ submission }, { status: 201 });
}
