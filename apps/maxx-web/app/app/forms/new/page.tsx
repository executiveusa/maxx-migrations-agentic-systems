import type { Metadata } from "next";
import { FormBuilder } from "@/components/forms/FormBuilder";

export const metadata: Metadata = { title: "New Form" };

export default function NewFormPage() {
  return <FormBuilder />;
}
