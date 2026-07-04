export type BeadStatus = "open" | "in_progress" | "blocked" | "completed" | "cancelled";

export interface Bead {
  id: string;
  organizationId: string;
  projectId: string;
  title: string;
  description?: string;
  status: BeadStatus;
  assignedAgent?: string;
  dependsOn: string[];
  beadOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type FlywheelSessionStatus = "running" | "completed" | "failed" | "awaiting_approval" | "stopped";

export interface FlywheelSession {
  id: string;
  organizationId: string;
  projectId: string;
  beadId?: string;
  model: string;
  status: FlywheelSessionStatus;
  prUrl?: string;
  tokensUsed: number;
  costUsd: number;
  startedAt: string;
  finishedAt?: string;
}
