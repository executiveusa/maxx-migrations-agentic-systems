import type { Organization } from "@/lib/types/organizations";
import type { FlywheelProject } from "@/lib/types/project";
import type { Bead, FlywheelSession } from "@/lib/types/bead";

/**
 * The 6 agencies in the Maxx flywheel collective. These mirror the
 * maxx_organizations rows seeded by
 * supabase/migrations/20260101000001_maxx_flywheel_core.sql — same names
 * and slugs, so swapping this file for a live Supabase query is a
 * contained change through getStore().
 */
export const agencies: Organization[] = [
  { id: "org_pauli_effect", name: "The Pauli Effect", slug: "pauli-effect", missionFocus: "Hub agency — multi-agency command center admin", plan: "sovereign_install_plus_partner", createdAt: "2026-07-04T00:00:00.000Z" },
  { id: "org_afromations", name: "Afromations", slug: "afromations", missionFocus: "Digital media and brand storytelling", plan: "sovereign_install", createdAt: "2026-07-04T00:00:00.000Z" },
  { id: "org_macs_digital", name: "Macs Digital Media", slug: "macs-digital-media", missionFocus: "Digital media agency", plan: "sovereign_install", createdAt: "2026-07-04T00:00:00.000Z" },
  { id: "org_kupuri_media", name: "Kupuri Media", slug: "kupuri-media", missionFocus: "Digital media agency — Mexico", plan: "sovereign_install", createdAt: "2026-07-04T00:00:00.000Z" },
  { id: "org_cheggie_media", name: "Cheggie Media", slug: "cheggie-media", missionFocus: "Digital media agency — Serbia", plan: "sovereign_install", createdAt: "2026-07-04T00:00:00.000Z" },
  { id: "org_myweblane", name: "MyWebLane", slug: "myweblane", missionFocus: "Digital media agency — India", plan: "sovereign_install", createdAt: "2026-07-04T00:00:00.000Z" },
];

export const flywheelProjects: FlywheelProject[] = [
  { id: "proj_1", organizationId: "org_afromations", name: "Brand site rebuild", description: "Full landing page rebuild off legacy WordPress.", projectType: "website_build", status: "active", createdAt: "2026-07-01T00:00:00.000Z", updatedAt: "2026-07-03T00:00:00.000Z" },
  { id: "proj_2", organizationId: "org_macs_digital", name: "Client GHL migration", description: "Migrate a mid-size client off GoHighLevel into Maxx CRM.", projectType: "ghl_migration", status: "active", createdAt: "2026-06-28T00:00:00.000Z", updatedAt: "2026-07-04T00:00:00.000Z" },
  { id: "proj_3", organizationId: "org_kupuri_media", name: "Q3 social campaign", description: "Content calendar + scheduled posts for Q3.", projectType: "social_content", status: "planned", createdAt: "2026-07-02T00:00:00.000Z", updatedAt: "2026-07-02T00:00:00.000Z" },
];

export const beads: Bead[] = [
  { id: "bead_1", organizationId: "org_afromations", projectId: "proj_1", title: "Crawl legacy site + asset inventory", status: "completed", assignedAgent: "agent_migration", dependsOn: [], beadOrder: 1, createdAt: "2026-07-01T00:00:00.000Z", updatedAt: "2026-07-01T12:00:00.000Z" },
  { id: "bead_2", organizationId: "org_afromations", projectId: "proj_1", title: "Rewrite copy in Afromations voice", status: "in_progress", assignedAgent: "agent_copy", dependsOn: ["bead_1"], beadOrder: 2, createdAt: "2026-07-02T00:00:00.000Z", updatedAt: "2026-07-03T00:00:00.000Z" },
  { id: "bead_3", organizationId: "org_macs_digital", projectId: "proj_2", title: "Map GHL export fields to Maxx schema", status: "in_progress", assignedAgent: "agent_import", dependsOn: [], beadOrder: 1, createdAt: "2026-06-28T00:00:00.000Z", updatedAt: "2026-07-04T00:00:00.000Z" },
];

export const flywheelSessions: FlywheelSession[] = [
  { id: "fsess_1", organizationId: "org_afromations", projectId: "proj_1", beadId: "bead_2", model: "claude-sonnet-5", status: "running", tokensUsed: 24500, costUsd: 0.42, startedAt: "2026-07-04T09:00:00.000Z" },
  { id: "fsess_2", organizationId: "org_macs_digital", projectId: "proj_2", beadId: "bead_3", model: "claude-sonnet-5", status: "awaiting_approval", prUrl: "https://github.com/example/repo/pull/12", tokensUsed: 41200, costUsd: 0.71, startedAt: "2026-07-04T07:30:00.000Z" },
];
