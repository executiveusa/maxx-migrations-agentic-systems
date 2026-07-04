import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/data/store";
import { stopFlywheelSession } from "@/lib/integrations/flywheel/vps-bridge";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : undefined;
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required." }, { status: 400 });
  }

  const store = getStore();
  const session = store.flywheelSessions.find((s) => s.id === sessionId);
  if (!session) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  const stopResult = await stopFlywheelSession(sessionId);

  store.flywheelSessions = store.flywheelSessions.map((s) =>
    s.id === sessionId ? { ...s, status: "stopped", finishedAt: new Date().toISOString() } : s,
  );

  return NextResponse.json({ session: { ...session, status: "stopped" }, stop: stopResult });
}
