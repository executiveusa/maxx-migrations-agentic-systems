import type { PublishRequest, PublishResult, SocialProvider } from "@/lib/integrations/social/social-provider";
import { isIntegrationConfigured } from "@/lib/data/mode";

const GRAPH_API_VERSION = "v19.0";

export class MetaProvider implements SocialProvider {
  readonly name = "meta";

  isConfigured(): boolean {
    return isIntegrationConfigured("META_ACCESS_TOKEN") && isIntegrationConfigured("META_PAGE_ID");
  }

  async publish(request: PublishRequest): Promise<PublishResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        status: "setup_required",
        message:
          "Meta connection required. Add META_ACCESS_TOKEN and META_PAGE_ID in Settings → Integrations to publish to Facebook and Instagram.",
      };
    }

    const pageId = process.env.META_PAGE_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;

    try {
      const response = await fetch(
        `https://graph.facebook.com/${GRAPH_API_VERSION}/${pageId}/feed`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: request.copy, access_token: accessToken }),
        },
      );

      if (!response.ok) {
        const body = await response.text();
        return { success: false, status: "failed", message: `Meta API error: ${body}` };
      }

      return {
        success: true,
        status: "published",
        message: "Published to Meta successfully.",
        publishedAt: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        status: "failed",
        message: `Meta API request failed: ${error instanceof Error ? error.message : "unknown error"}`,
      };
    }
  }
}
