import { describe, expect, it } from "vitest";
import { MockSocialProvider } from "@/lib/integrations/social/mock-social-provider";
import { socialPostSchema } from "@/lib/validation/social";

describe("MockSocialProvider", () => {
  it("publishes successfully in local mock mode", async () => {
    const provider = new MockSocialProvider();
    const result = await provider.publish({ channels: ["facebook_page"], copy: "Hello community" });
    expect(result.success).toBe(true);
    expect(result.status).toBe("published");
    expect(result.message).toContain("Local mock publish completed");
  });

  it("fails when copy is empty", async () => {
    const provider = new MockSocialProvider();
    const result = await provider.publish({ channels: ["facebook_page"], copy: "   " });
    expect(result.success).toBe(false);
  });
});

describe("socialPostSchema", () => {
  it("requires at least one channel", () => {
    const result = socialPostSchema.safeParse({
      channels: [],
      copy: "Hello",
      scheduledFor: new Date().toISOString(),
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid scheduled post", () => {
    const result = socialPostSchema.safeParse({
      channels: ["instagram_business"],
      copy: "Hello community",
      scheduledFor: new Date().toISOString(),
    });
    expect(result.success).toBe(true);
  });
});
