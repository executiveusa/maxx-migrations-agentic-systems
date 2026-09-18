import { NextRequest, NextResponse } from "next/server";
import { isFederationMachineAuthorized } from "@/lib/system/machine-auth";
import { FEDERATION, MAXX_FEDERATION_VERSION } from "@/lib/system/federation";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isFederationMachineAuthorized(request)) {
    return NextResponse.json({ error: "Machine authentication required." }, { status: 401 });
  }

  return NextResponse.json({
    version: MAXX_FEDERATION_VERSION,
    ...FEDERATION,
    motionGate: {
      requiredBeforeWalkPass: true,
      definition:
        "At least one intended path must move from a real surface through its transport to the canonical owner and produce observable evidence.",
      evidenceMinimum: ["reachable transport", "truthful result or truthful failure", "recorded proof"],
    },
    machineSurfaces: {
      api: ["GET /api/system/health", "GET /api/system/manifest", "POST /api/system/route"],
      cli: "apps/maxx-web/cli/maxx-migrations.mjs",
      mcp: "apps/maxx-web/mcp/maxx-migrations-server.mjs",
    },
  });
}
