import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/data/store";

export async function GET(request: NextRequest) {
  const { agencies, flywheelProjects, beads, flywheelSessions } = getStore();
  const organizationId = request.nextUrl.searchParams.get("organizationId");

  if (organizationId) {
    return NextResponse.json({
      projects: flywheelProjects.filter((p) => p.organizationId === organizationId),
      beads: beads.filter((b) => b.organizationId === organizationId),
      sessions: flywheelSessions.filter((s) => s.organizationId === organizationId),
    });
  }

  return NextResponse.json({ agencies, projects: flywheelProjects, beads, sessions: flywheelSessions });
}
