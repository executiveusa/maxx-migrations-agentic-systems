import type { PublishRequest, PublishResult, SocialProvider } from "@/lib/integrations/social/social-provider";
import { isIntegrationConfigured } from "@/lib/data/mode";

/**
 * Reference adapter for Postiz (https://postiz.com) as an alternative external
 * scheduling backend. Organizations that already run Postiz can route publish
 * requests there instead of directly through Meta.
 */
export class PostizAdapter implements SocialProvider {
  readonly name = "postiz";

  isConfigured(): boolean {
    return isIntegrationConfigured("POSTIZ_API_KEY") && isIntegrationConfigured("POSTIZ_BASE_URL");
  }

  async publish(request: PublishRequest): Promise<PublishResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        status: "setup_required",
        message:
          "Postiz connection required. Add POSTIZ_API_KEY and POSTIZ_BASE_URL in Settings → Integrations.",
      };
    }

    const baseUrl = process.env.POSTIZ_BASE_URL;
    const apiKey = process.env.POSTIZ_API_KEY;

    try {
      const response = await fetch(`${baseUrl}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          content: request.copy,
          channels: request.channels,
        }),
      });

      if (!response.ok) {
        return { success: false, status: "failed", message: `Postiz API error: ${response.status}` };
      }

      return {
        success: true,
        status: "published",
        message: "Queued via Postiz successfully.",
        publishedAt: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        status: "failed",
        message: `Postiz request failed: ${error instanceof Error ? error.message : "unknown error"}`,
      };
    }
  }
}
