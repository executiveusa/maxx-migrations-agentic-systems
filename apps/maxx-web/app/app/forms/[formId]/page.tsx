import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStore } from "@/lib/data/store";
import { FormDetailView } from "@/components/forms/FormDetailView";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ formId: string }>;
}): Promise<Metadata> {
  const { formId } = await params;
  const form = getStore().forms.find((f) => f.id === formId);
  return { title: form ? form.name : "Form" };
}

export default async function FormDetailPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  const { forms, formSubmissions } = getStore();
  const form = forms.find((f) => f.id === formId);
  if (!form) notFound();

  const submissions = formSubmissions.filter((s) => s.formId === formId);
  return <FormDetailView form={form} submissions={submissions} />;
}
