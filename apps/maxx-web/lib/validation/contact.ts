import { z } from "zod";

export const contactStatuses = ["lead", "active", "donor", "volunteer", "archived"] as const;
export const contactSources = [
  "website_form",
  "ghl_import",
  "manual",
  "missed_call",
  "event",
  "referral",
] as const;

export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(contactStatuses).default("lead"),
  source: z.enum(contactSources).default("manual"),
});

export type ContactInput = z.infer<typeof contactSchema>;
