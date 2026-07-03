import { z } from "zod";

export const socialChannels = ["facebook_page", "instagram_business"] as const;

export const socialPostSchema = z.object({
  channels: z.array(z.enum(socialChannels)).min(1, "Choose at least one channel."),
  copy: z.string().min(1, "Write your post copy.").max(2200, "Keep it under 2200 characters."),
  assetDescription: z.string().optional(),
  scheduledFor: z.string().min(1, "Choose a date and time."),
  campaignTemplateId: z.string().optional(),
});

export type SocialPostInput = z.infer<typeof socialPostSchema>;
