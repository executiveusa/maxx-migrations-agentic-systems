import type { SocialProvider } from "@/lib/integrations/social/social-provider";
import { MockSocialProvider } from "@/lib/integrations/social/mock-social-provider";
import { MetaProvider } from "@/lib/integrations/social/meta-provider";
import { mockIntegrationsEnabled } from "@/lib/data/mode";

export * from "@/lib/integrations/social/social-provider";
export { MockSocialProvider } from "@/lib/integrations/social/mock-social-provider";
export { MetaProvider } from "@/lib/integrations/social/meta-provider";
export { PostizAdapter } from "@/lib/integrations/social/postiz-adapter";

export function getSocialProvider(): SocialProvider {
  const meta = new MetaProvider();
  if (meta.isConfigured()) return meta;
  if (mockIntegrationsEnabled()) return new MockSocialProvider();
  return meta;
}
