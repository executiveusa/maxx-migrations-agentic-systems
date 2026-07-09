import { NextResponse } from "next/server";
import { getStore } from "@/lib/data/store";

export async function GET(_request: Request, { params }: { params: Promise<{ formId: string }> }) {
  const { formId } = await params;
  const form = getStore().forms.find((f) => f.id === formId);
  if (!form) {
    return NextResponse.json({ error: "Form not found." }, { status: 404 });
  }
  return NextResponse.json({ form });
}
