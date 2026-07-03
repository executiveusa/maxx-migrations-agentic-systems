import type { SocialChannel } from "@/lib/types/social";

export interface PublishRequest {
  channels: SocialChannel[];
  copy: string;
  assetDescription?: string;
}

export interface PublishResult {
  success: boolean;
  status: "published" | "setup_required" | "failed";
  message: string;
  publishedAt?: string;
}

export interface SocialProvider {
  readonly name: string;
  isConfigured(): boolean;
  publish(request: PublishRequest): Promise<PublishResult>;
}
