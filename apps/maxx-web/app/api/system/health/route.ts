import { NextRequest, NextResponse } from "next/server";
import { isFederationMachineAuthorized } from "@/lib/system/machine-auth";
import { FEDERATION, MAXX_FEDERATION_VERSION } from "@/lib/system/federation";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isFederationMachineAuthorized(request)) {
    return NextResponse.json({ error: "Machine authentication required." }, { status: 401 });
  }

  return NextResponse.json({
    status: "ready",
    service: "maxx-migrations-federation",
    version: MAXX_FEDERATION_VERSION,
    canonicalBackend: FEDERATION.canonicalBackend,
    icm: FEDERATION.icm.method,
    timestamp: new Date().toISOString(),
  });
}
