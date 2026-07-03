import type { PublishRequest, PublishResult, SocialProvider } from "@/lib/integrations/social/social-provider";

export class MockSocialProvider implements SocialProvider {
  readonly name = "mock";

  isConfigured(): boolean {
    return true;
  }

  async publish(request: PublishRequest): Promise<PublishResult> {
    if (!request.copy.trim()) {
      return { success: false, status: "failed", message: "Post copy cannot be empty." };
    }
    const publishedAt = new Date().toISOString();
    return {
      success: true,
      status: "published",
      message: `Local mock publish completed for ${request.channels.join(", ")}.`,
      publishedAt,
    };
  }
}
