export type FormFieldType = "text" | "email" | "phone" | "textarea" | "select" | "checkbox";

export interface FormField {
  id: string;
  formId: string;
  type: FormFieldType;
  label: string;
  required: boolean;
  options?: string[];
  order: number;
}

export interface CrmForm {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description: string;
  fields: FormField[];
  submissionCount: number;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, string>;
  createdAt: string;
}
