import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { CommandCenterView } from "@/components/command-center/CommandCenterView";
import { getStore } from "@/lib/data/store";

export const metadata: Metadata = { title: "Mission Control" };
export const dynamic = "force-dynamic";

export default function CommandCenterPage() {
  const { agencies, flywheelProjects, beads, flywheelSessions } = getStore();
  return (
    <>
      <PageHeader
        eyebrow="Mission control"
        title="All 6 agencies, one view"
        description="Every agency's active projects, running agents, and spend — at a glance. Click a card to focus."
        actions={<Button href="/app/projects">Launch a project</Button>}
      />
      <CommandCenterView
        agencies={agencies}
        projects={flywheelProjects}
        beads={beads}
        sessions={flywheelSessions}
      />
    </>
  );
}
