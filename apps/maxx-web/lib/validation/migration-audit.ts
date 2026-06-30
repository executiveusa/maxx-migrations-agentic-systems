import { z } from "zod";

export const orgTypes = [
  "nonprofit",
  "social_purpose_business",
  "community_organization",
  "agency_or_consultant",
  "other",
] as const;

export const migrationAuditSchema = z.object({
  organizationName: z.string().min(2, "Organization name is required."),
  websiteUrl: z.string().url("Enter a valid URL, including https://."),
  contactName: z.string().min(2, "Contact name is required."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().optional(),
  organizationType: z.enum(orgTypes),
  missionFocus: z.string().min(2, "Tell us your mission focus."),
  currentTools: z.string().optional(),
  biggestProblem: z.string().min(10, "Tell us a bit more about the problem."),
  budgetRange: z.string().min(1, "Select a budget range."),
  desiredTimeline: z.string().min(1, "Select a timeline."),
});

export type MigrationAuditInput = z.infer<typeof migrationAuditSchema>;
