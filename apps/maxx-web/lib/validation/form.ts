import { z } from "zod";

export const formFieldTypes = ["text", "email", "phone", "textarea", "select", "checkbox"] as const;

export const formFieldSchema = z.object({
  type: z.enum(formFieldTypes),
  label: z.string().min(1, "Field label is required."),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
});

export const formSchema = z.object({
  name: z.string().min(2, "Form name is required."),
  description: z.string().min(1, "Add a short description."),
  fields: z.array(formFieldSchema).min(1, "Add at least one field."),
});

export type FormInput = z.infer<typeof formSchema>;
export type FormFieldInput = z.infer<typeof formFieldSchema>;
