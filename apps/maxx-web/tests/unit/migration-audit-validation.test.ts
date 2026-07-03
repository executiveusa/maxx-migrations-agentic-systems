import { describe, expect, it } from "vitest";
import { migrationAuditSchema } from "@/lib/validation/migration-audit";

const validPayload = {
  organizationName: "Riverside Mutual Aid Kitchen",
  websiteUrl: "https://example.org",
  contactName: "Dana Okafor",
  email: "dana@example.org",
  organizationType: "nonprofit",
  missionFocus: "Emergency food access",
  biggestProblem: "Our current site cannot connect to our CRM at all.",
  budgetRange: "$5,000–$10,000",
  desiredTimeline: "1–3 months",
};

describe("migrationAuditSchema", () => {
  it("accepts a fully valid submission", () => {
    expect(migrationAuditSchema.safeParse(validPayload).success).toBe(true);
  });

  it("rejects an invalid website URL", () => {
    const result = migrationAuditSchema.safeParse({ ...validPayload, websiteUrl: "not-a-url" });
    expect(result.success).toBe(false);
  });

  it("rejects a biggest-problem answer that is too short", () => {
    const result = migrationAuditSchema.safeParse({ ...validPayload, biggestProblem: "short" });
    expect(result.success).toBe(false);
  });
});
