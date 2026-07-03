import { z } from "zod";

export const opportunitySchema = z.object({
  pipelineId: z.string().min(1),
  stageId: z.string().min(1),
  contactId: z.string().min(1),
  title: z.string().min(2, "Give this opportunity a name."),
  value: z.number().nonnegative("Value cannot be negative."),
});

export type OpportunityInput = z.infer<typeof opportunitySchema>;
