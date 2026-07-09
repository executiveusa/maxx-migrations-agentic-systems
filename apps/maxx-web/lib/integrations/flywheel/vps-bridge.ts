import { isIntegrationConfigured } from "@/lib/data/mode";

/**
 * Thin client for the Hostinger VPS flywheel engine (AgentMail + bv + Claude
 * Code sessions). Requires FLYWHEEL_VPS_URL and FLYWHEEL_VPS_SECRET — until
 * both are set this reports setup_required instead of silently no-op'ing,
 * matching the pattern in lib/integrations/telephony/twilio-provider.ts.
 */

export interface LaunchSessionRequest {
  organizationSlug: string;
  projectId: string;
  beadIds: string[];
}

export interface LaunchSessionResult {
  success: boolean;
  status: "launched" | "setup_required" | "failed";
  message: string;
}

function isFlywheelVpsConfigured(): boolean {
  return isIntegrationConfigured("FLYWHEEL_VPS_URL") && isIntegrationConfigured("FLYWHEEL_VPS_SECRET");
}

export async function launchFlywheelSession(request: LaunchSessionRequest): Promise<LaunchSessionResult> {
  if (!isFlywheelVpsConfigured()) {
    return {
      success: false,
      status: "setup_required",
      message:
        "Flywheel VPS not connected. Add FLYWHEEL_VPS_URL and FLYWHEEL_VPS_SECRET in Settings → Integrations, and bootstrap the Hostinger VPS per docs/deployment/FLYWHEEL_VPS_SETUP.md.",
    };
  }

  const baseUrl = process.env.FLYWHEEL_VPS_URL;
  const secret = process.env.FLYWHEEL_VPS_SECRET;

  try {
    const response = await fetch(`${baseUrl}/launch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const body = await response.text();
      return { success: false, status: "failed", message: `Flywheel VPS error: ${body}` };
    }

    return { success: true, status: "launched", message: "Agent session launched on the flywheel VPS." };
  } catch (error) {
    return {
      success: false,
      status: "failed",
      message: `Flywheel VPS request failed: ${error instanceof Error ? error.message : "unknown error"}`,
    };
  }
}

export async function stopFlywheelSession(sessionId: string): Promise<LaunchSessionResult> {
  if (!isFlywheelVpsConfigured()) {
    return {
      success: false,
      status: "setup_required",
      message: "Flywheel VPS not connected — nothing to stop remotely; marking session stopped locally only.",
    };
  }

  const baseUrl = process.env.FLYWHEEL_VPS_URL;
  const secret = process.env.FLYWHEEL_VPS_SECRET;

  try {
    const response = await fetch(`${baseUrl}/stop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      const body = await response.text();
      return { success: false, status: "failed", message: `Flywheel VPS error: ${body}` };
    }

    return { success: true, status: "launched", message: "Session stop requested on the flywheel VPS." };
  } catch (error) {
    return {
      success: false,
      status: "failed",
      message: `Flywheel VPS request failed: ${error instanceof Error ? error.message : "unknown error"}`,
    };
  }
}
