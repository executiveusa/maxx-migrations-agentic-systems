import type { Metadata } from "next";
import { ProjectLauncherView } from "@/components/projects/ProjectLauncherView";
import { getStore } from "@/lib/data/store";

export const metadata: Metadata = { title: "Projects" };
export const dynamic = "force-dynamic";

export default function ProjectsPage() {
  const { agencies, flywheelProjects } = getStore();
  return <ProjectLauncherView agencies={agencies} projects={flywheelProjects} />;
}
