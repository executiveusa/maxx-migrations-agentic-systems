/**
 * Thin API bridge between the Maxx Command Center (Vercel) and the
 * Hostinger VPS flywheel engine. Runs on the VPS via `bun run server.ts`
 * (see ops/flywheel-vps-setup.sh). Protected by FLYWHEEL_VPS_SECRET —
 * the same value must be set in Vercel's env vars as FLYWHEEL_VPS_SECRET.
 *
 * This is a reference implementation, not yet wired to real Claude Code
 * session spawning — the TODOs mark where `bv`/AgentMail calls go once the
 * flywheel toolchain is installed (ops/flywheel-vps-setup.sh).
 */
import { Hono } from "hono";

const app = new Hono();
const SECRET = process.env.FLYWHEEL_VPS_SECRET;

app.use("*", async (c, next) => {
  const auth = c.req.header("Authorization");
  if (!SECRET || auth !== `Bearer ${SECRET}`) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
});

interface LaunchRequest {
  organizationSlug: string;
  projectId: string;
  beadIds: string[];
}

const activeSessions = new Map<string, { organizationSlug: string; projectId: string; status: string }>();

app.post("/launch", async (c) => {
  const body = await c.req.json<LaunchRequest>();
  const sessionId = `vps_${Date.now()}`;

  // TODO: shell out to the agency workspace (/opt/maxx-flywheel/<slug>),
  // load its bead set into `bv`, and start a Claude Code session with
  // AGENTS.md as context. See docs/deployment/FLYWHEEL_VPS_SETUP.md.
  activeSessions.set(sessionId, {
    organizationSlug: body.organizationSlug,
    projectId: body.projectId,
    status: "running",
  });

  return c.json({ sessionId, status: "launched" });
});

app.get("/status", (c) => {
  return c.json({ sessions: Array.from(activeSessions.entries()).map(([id, s]) => ({ id, ...s })) });
});

app.post("/stop", async (c) => {
  const body = await c.req.json<{ sessionId: string }>();
  const session = activeSessions.get(body.sessionId);
  if (!session) {
    return c.json({ error: "Session not found" }, 404);
  }
  // TODO: send a graceful stop signal to the running Claude Code session.
  activeSessions.set(body.sessionId, { ...session, status: "stopped" });
  return c.json({ sessionId: body.sessionId, status: "stopped" });
});

export default {
  port: process.env.PORT ? Number(process.env.PORT) : 3001,
  fetch: app.fetch,
};
