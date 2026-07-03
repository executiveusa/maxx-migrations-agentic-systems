import type { CampaignTemplate, SocialAccount, SocialPost } from "@/lib/types/social";
import { currentOrganization } from "@/lib/mock-data/organizations";

const orgId = currentOrganization.id;

export const socialAccounts: SocialAccount[] = [
  { id: "acct_fb", organizationId: orgId, channel: "facebook_page", displayName: "Riverside Mutual Aid Kitchen", connected: false },
  { id: "acct_ig", organizationId: orgId, channel: "instagram_business", displayName: "@riversidemutualaid", connected: false },
];

export const campaignTemplates: CampaignTemplate[] = [
  { id: "camp_weekly_meal_count", name: "Weekly meal count", description: "Share this week's meal-service numbers.", suggestedCopy: "This week our volunteers served {{mealCount}} meals across {{shiftCount}} shifts. Thank you to everyone who showed up." },
  { id: "camp_volunteer_shoutout", name: "Volunteer shoutout", description: "Recognize a volunteer or team publicly.", suggestedCopy: "Volunteer spotlight: {{volunteerName}} has shown up for {{shiftCount}} shifts this quarter. We could not do this work without you." },
  { id: "camp_donation_appeal", name: "Donation appeal", description: "A direct, specific ask tied to a program need.", suggestedCopy: "{{amount}} covers {{impactUnit}} for a family this month. Will you chip in today?" },
];

export const socialPosts: SocialPost[] = [
  {
    id: "sp_1",
    organizationId: orgId,
    channels: ["facebook_page", "instagram_business"],
    copy: "This week our volunteers served 412 meals across 6 shifts. Thank you to everyone who showed up.",
    scheduledFor: "2026-07-05T16:00:00.000Z",
    status: "setup_required",
    campaignTemplateId: "camp_weekly_meal_count",
    publishLog: [],
  },
  {
    id: "sp_2",
    organizationId: orgId,
    channels: ["instagram_business"],
    copy: "Volunteer spotlight: Marcus Lee has shown up for 14 shifts this quarter. We could not do this work without you.",
    scheduledFor: "2026-06-30T14:00:00.000Z",
    status: "published",
    campaignTemplateId: "camp_volunteer_shoutout",
    publishLog: ["Local mock publish completed at 2026-06-30T14:00:05.000Z"],
  },
  {
    id: "sp_3",
    organizationId: orgId,
    channels: ["facebook_page"],
    copy: "$25 covers five family meal bags this month. Will you chip in today?",
    scheduledFor: "2026-07-10T15:00:00.000Z",
    status: "draft",
    campaignTemplateId: "camp_donation_appeal",
    publishLog: [],
  },
];
