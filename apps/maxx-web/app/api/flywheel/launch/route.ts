import { NextRequest, NextResponse } from "next/server";
import { createProjectSchema } from "@/lib/validation/project";
import { getStore } from "@/lib/data/store";
import { launchFlywheelSession } from "@/lib/integrations/flywheel/vps-bridge";
import type { FlywheelProject, ProjectType } from "@/lib/types/project";
import type { Bead, FlywheelSession } from "@/lib/types/bead";

const DEFAULT_BEAD_TEMPLATES: Record<ProjectType, string[]> = {
  website_build: ["Crawl existing site + asset inventory", "Rebuild pages in Maxx", "QA + launch"],
  ghl_migration: ["Export GHL data", "Map fields to Maxx schema", "Import + validate", "Client walkthrough"],
  social_content: ["Draft content calendar", "Generate post copy + assets", "Schedule + review"],
  crm_setup: ["Configure pipeline stages", "Import contacts", "Configure workflows"],
  other: ["Define scope", "Execute", "Review"],
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid project." }, { status: 400 });
  }

  const store = getStore();
  const agency = store.agencies.find((a) => a.id === parsed.data.organizationId);
  if (!agency) {
    return NextResponse.json({ error: "Unknown agency." }, { status: 404 });
  }

  const now = new Date().toISOString();
  const projectId = `proj_${Date.now()}`;

  const project: FlywheelProject = {
    id: projectId,
    organizationId: parsed.data.organizationId,
    name: parsed.data.name,
    description: parsed.data.description,
    repoUrl: parsed.data.repoUrl || undefined,
    projectType: parsed.data.projectType,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  const beadTitles = DEFAULT_BEAD_TEMPLATES[parsed.data.projectType];
  const newBeads: Bead[] = beadTitles.map((title, index) => ({
    id: `bead_${Date.now()}_${index}`,
    organizationId: parsed.data.organizationId,
    projectId,
    title,
    status: "open",
    dependsOn: index === 0 ? [] : [`bead_${Date.now()}_${index - 1}`],
    beadOrder: index + 1,
    createdAt: now,
    updatedAt: now,
  }));

  store.flywheelProjects = [project, ...store.flywheelProjects];
  store.beads = [...newBeads, ...store.beads];

  const launchResult = await launchFlywheelSession({
    organizationSlug: agency.slug,
    projectId,
    beadIds: newBeads.map((b) => b.id),
  });

  const session: FlywheelSession = {
    id: `fsess_${Date.now()}`,
    organizationId: parsed.data.organizationId,
    projectId,
    beadId: newBeads[0]?.id,
    model: "claude-sonnet-5",
    status: launchResult.success ? "running" : "awaiting_approval",
    tokensUsed: 0,
    costUsd: 0,
    startedAt: now,
  };
  store.flywheelSessions = [session, ...store.flywheelSessions];

  return NextResponse.json(
    { project, beads: newBeads, session, launch: launchResult },
    { status: 201 },
  );
}
