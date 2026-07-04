"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ButtonEl } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";
import { StatusPill } from "@/components/ui/StatusPill";
import { useToast } from "@/components/ui/Toast";
import { createProjectSchema, type CreateProjectInput } from "@/lib/validation/project";
import type { Organization } from "@/lib/types/organizations";
import type { FlywheelProject } from "@/lib/types/project";

const PROJECT_TYPE_LABELS: Record<string, string> = {
  website_build: "Website build",
  ghl_migration: "GHL migration",
  social_content: "Social content",
  crm_setup: "CRM setup",
  other: "Other",
};

interface ProjectLauncherViewProps {
  agencies: Organization[];
  projects: FlywheelProject[];
}

export function ProjectLauncherView({ agencies, projects }: ProjectLauncherViewProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectInput>({ resolver: zodResolver(createProjectSchema) });

  async function onSubmit(data: CreateProjectInput) {
    setSubmitting(true);
    const res = await fetch("/api/flywheel/launch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSubmitting(false);
    if (!res.ok) {
      pushToast("Could not launch project. Check the form and try again.", "error");
      return;
    }
    const { launch } = await res.json();
    pushToast(
      launch.success
        ? "Project launched — agent session running."
        : "Project created — agent launch needs the flywheel VPS connected (see Settings → Integrations).",
      launch.success ? "success" : "info",
    );
    router.push("/app/command-center");
    router.refresh();
  }

  return (
    <>
      <PageHeader
        eyebrow="Flywheel"
        title="Launch a project"
        description="Pick an agency, name the work, and go — this creates a bead set and starts an agent session."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Field label="Agency" error={errors.organizationId?.message}>
              <Select {...register("organizationId")} defaultValue="">
                <option value="" disabled>
                  Choose an agency
                </option>
                {agencies.map((agency) => (
                  <option key={agency.id} value={agency.id}>
                    {agency.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Project name" error={errors.name?.message}>
              <Input placeholder="Client site rebuild" {...register("name")} />
            </Field>

            <Field label="Description" error={errors.description?.message} hint="Optional">
              <Textarea placeholder="What is this project?" {...register("description")} />
            </Field>

            <Field label="Project type" error={errors.projectType?.message}>
              <Select {...register("projectType")} defaultValue="other">
                {Object.entries(PROJECT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Repo URL" error={errors.repoUrl?.message} hint="Optional">
              <Input type="url" placeholder="https://github.com/..." {...register("repoUrl")} />
            </Field>

            <ButtonEl type="submit" disabled={submitting} className="w-full">
              {submitting ? "Launching…" : "Launch project"}
            </ButtonEl>
          </form>
        </Card>

        <div className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-text">Recent projects</h2>
          {projects.length === 0 ? (
            <Card className="text-sm text-muted">No projects yet — launch your first one.</Card>
          ) : (
            projects.map((project) => {
              const agency = agencies.find((a) => a.id === project.organizationId);
              return (
                <Card key={project.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-text">{project.name}</p>
                      <p className="text-xs text-muted">
                        {agency?.name} · {PROJECT_TYPE_LABELS[project.projectType]}
                      </p>
                      {project.description && (
                        <p className="mt-1 text-xs text-muted">{project.description}</p>
                      )}
                    </div>
                    <StatusPill status={project.status} />
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
