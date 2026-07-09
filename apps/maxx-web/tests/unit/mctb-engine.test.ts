import { describe, expect, it } from "vitest";
import { evaluateMissedCall, isStopMessage, renderTemplate } from "@/lib/integrations/telephony/mctb-engine";
import type { SmsOptOut, SmsTemplate } from "@/lib/types/telephony";

const template: SmsTemplate = {
  id: "tmpl_default",
  organizationId: "org_1",
  name: "Default",
  body: "Sorry we missed your call. This is {{organizationName}}. How can we help?",
};

const context = { organizationName: "Riverside Mutual Aid Kitchen", fromNumber: "+15035550199" };

describe("mctb-engine.evaluateMissedCall", () => {
  it("sends when configured, enabled, and not opted out", () => {
    const decision = evaluateMissedCall({
      fromNumber: "+15035550199",
      mctbEnabled: true,
      phoneConfigured: true,
      optOuts: [],
      template,
      context,
    });
    expect(decision.shouldSend).toBe(true);
    expect(decision.renderedBody).toContain("Riverside Mutual Aid Kitchen");
  });

  it("blocks a number that has opted out", () => {
    const optOuts: SmsOptOut[] = [
      { id: "optout_1", organizationId: "org_1", phoneNumber: "+15035550199", optedOutAt: new Date().toISOString() },
    ];
    const decision = evaluateMissedCall({
      fromNumber: "+15035550199",
      mctbEnabled: true,
      phoneConfigured: true,
      optOuts,
      template,
      context,
    });
    expect(decision.shouldSend).toBe(false);
    expect(decision.reason).toBe("opted_out");
  });

  it("blocks when the phone number is not configured", () => {
    const decision = evaluateMissedCall({
      fromNumber: "+15035550199",
      mctbEnabled: true,
      phoneConfigured: false,
      optOuts: [],
      template,
      context,
    });
    expect(decision.shouldSend).toBe(false);
    expect(decision.reason).toBe("not_configured");
  });

  it("blocks when MCTB is disabled for the organization", () => {
    const decision = evaluateMissedCall({
      fromNumber: "+15035550199",
      mctbEnabled: false,
      phoneConfigured: true,
      optOuts: [],
      template,
      context,
    });
    expect(decision.shouldSend).toBe(false);
    expect(decision.reason).toBe("mctb_disabled");
  });
});

describe("isStopMessage", () => {
  it("recognizes common opt-out keywords case-insensitively", () => {
    expect(isStopMessage("STOP")).toBe(true);
    expect(isStopMessage("  stop  ")).toBe(true);
    expect(isStopMessage("unsubscribe")).toBe(true);
    expect(isStopMessage("Yes please")).toBe(false);
  });
});

describe("renderTemplate", () => {
  it("substitutes template variables", () => {
    const rendered = renderTemplate(template, context);
    expect(rendered).toBe("Sorry we missed your call. This is Riverside Mutual Aid Kitchen. How can we help?");
  });
});
