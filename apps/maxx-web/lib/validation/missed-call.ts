import { z } from "zod";

export const missedCallRuleSchema = z.object({
  name: z.string().min(2, "Rule name is required."),
  templateId: z.string().min(1, "Choose a text-back template."),
  active: z.boolean().default(true),
  delaySeconds: z.number().int().min(0).max(600, "Delay must be 10 minutes or less."),
});

export const smsTemplateSchema = z.object({
  name: z.string().min(2, "Template name is required."),
  body: z
    .string()
    .min(1, "Template body is required.")
    .max(320, "Keep templates under 320 characters."),
});

export type MissedCallRuleInput = z.infer<typeof missedCallRuleSchema>;
export type SmsTemplateInput = z.infer<typeof smsTemplateSchema>;
