export type SocialChannel = "facebook_page" | "instagram_business";

export type SocialPostStatus = "draft" | "scheduled" | "published" | "failed" | "setup_required";

export interface SocialAccount {
  id: string;
  organizationId: string;
  channel: SocialChannel;
  displayName: string;
  connected: boolean;
}

export interface SocialPost {
  id: string;
  organizationId: string;
  channels: SocialChannel[];
  copy: string;
  assetDescription?: string;
  scheduledFor: string;
  status: SocialPostStatus;
  campaignTemplateId?: string;
  publishLog: string[];
}

export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  suggestedCopy: string;
}
