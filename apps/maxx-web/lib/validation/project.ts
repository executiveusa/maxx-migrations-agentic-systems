import { z } from "zod";

export const projectTypes = ["website_build", "ghl_migration", "social_content", "crm_setup", "other"] as const;

export const createProjectSchema = z.object({
  organizationId: z.string().min(1, "Choose an agency."),
  name: z.string().min(1, "Give the project a name."),
  description: z.string().optional(),
  repoUrl: z.string().url("Enter a valid repo URL.").optional().or(z.literal("")),
  projectType: z.enum(projectTypes),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
