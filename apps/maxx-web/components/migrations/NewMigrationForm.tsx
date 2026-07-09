"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ButtonEl } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { migrationJobSchema, type MigrationJobInput } from "@/lib/validation/migration-job";

export function NewMigrationForm() {
  const router = useRouter();
  const { pushToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MigrationJobInput>({ resolver: zodResolver(migrationJobSchema) });

  async function onSubmit(data: MigrationJobInput) {
    setSubmitting(true);
    const res = await fetch("/api/migrations/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSubmitting(false);
    if (!res.ok) {
      pushToast("Could not start migration. Check the URL and try again.", "error");
      return;
    }
    const { job } = await res.json();
    pushToast("Migration job created — crawl plan generated.", "success");
    router.push(`/app/migrations/${job.id}`);
  }

  return (
    <>
      <PageHeader
        eyebrow="Migration engine"
        title="Start a migration"
        description="Enter the URL of the site you want to migrate. We'll generate a crawl plan you can review before anything is rebuilt."
      />
      <Card className="max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Field label="Source website URL" error={errors.sourceUrl?.message}>
            <Input type="url" placeholder="https://" {...register("sourceUrl")} />
          </Field>
          <ButtonEl type="submit" disabled={submitting} className="w-full">
            {submitting ? "Creating job…" : "Generate crawl plan"}
          </ButtonEl>
        </form>
      </Card>
    </>
  );
}
