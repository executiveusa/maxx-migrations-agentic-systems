export type ProjectType = "website_build" | "ghl_migration" | "social_content" | "crm_setup" | "other";

export type ProjectStatus = "planned" | "active" | "blocked" | "completed" | "archived";

export interface FlywheelProject {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  repoUrl?: string;
  projectType: ProjectType;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}
