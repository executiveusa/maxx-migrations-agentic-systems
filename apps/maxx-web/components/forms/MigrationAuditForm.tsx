"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  migrationAuditSchema,
  type MigrationAuditInput,
} from "@/lib/validation/migration-audit";

const budgetRanges = [
  "Under $5,000",
  "$5,000–$10,000",
  "$10,000–$25,000",
  "Not sure yet",
];

const timelines = ["ASAP", "1–3 months", "3–6 months", "Just exploring"];

export function MigrationAuditForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [persisted, setPersisted] = useState<"supabase" | "in_memory" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MigrationAuditInput>({
    resolver: zodResolver(migrationAuditSchema),
  });

  async function onSubmit(data: MigrationAuditInput) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/migrations/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      const body = await res.json();
      setResultMessage(body.message ?? "Migration audit request received.");
      setPersisted(body.persisted ?? null);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-accent bg-accent-soft p-8 text-center"
      >
        <h2 className="font-display text-2xl font-semibold">
          {persisted === "in_memory"
            ? "Request received (demo mode)"
            : "Thank you — your migration audit request is in."}
        </h2>
        <p className="mt-2 text-muted">{resultMessage}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6 rounded-2xl border border-border bg-surface p-8"
    >
      <Field
        label="Organization name"
        error={errors.organizationName?.message}
      >
        <input
          {...register("organizationName")}
          className="form-input"
          autoComplete="organization"
        />
      </Field>

      <Field label="Website URL" error={errors.websiteUrl?.message}>
        <input
          {...register("websiteUrl")}
          className="form-input"
          type="url"
          placeholder="https://"
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Contact name" error={errors.contactName?.message}>
          <input {...register("contactName")} className="form-input" autoComplete="name" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input
            {...register("email")}
            className="form-input"
            type="email"
            autoComplete="email"
          />
        </Field>
      </div>

      <Field label="Phone (optional)" error={errors.phone?.message}>
        <input {...register("phone")} className="form-input" type="tel" autoComplete="tel" />
      </Field>

      <Field label="Organization type" error={errors.organizationType?.message}>
        <select {...register("organizationType")} className="form-input" defaultValue="">
          <option value="" disabled>
            Select one
          </option>
          <option value="nonprofit">Nonprofit</option>
          <option value="social_purpose_business">Social-purpose business</option>
          <option value="community_organization">Community organization</option>
          <option value="agency_or_consultant">Agency or consultant</option>
          <option value="other">Other</option>
        </select>
      </Field>

      <Field label="Mission focus" error={errors.missionFocus?.message}>
        <input {...register("missionFocus")} className="form-input" />
      </Field>

      <Field label="Current tools (optional)" error={errors.currentTools?.message}>
        <input {...register("currentTools")} className="form-input" />
      </Field>

      <Field label="Biggest problem right now" error={errors.biggestProblem?.message}>
        <textarea {...register("biggestProblem")} className="form-input min-h-[100px]" />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Budget range" error={errors.budgetRange?.message}>
          <select {...register("budgetRange")} className="form-input" defaultValue="">
            <option value="" disabled>
              Select one
            </option>
            {budgetRanges.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Desired timeline" error={errors.desiredTimeline?.message}>
          <select {...register("desiredTimeline")} className="form-input" defaultValue="">
            <option value="" disabled>
              Select one
            </option>
            {timelines.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-xl bg-accent px-6 py-3 font-medium text-bg transition-opacity hover:bg-accent/90 disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting…" : "Start a Migration Audit"}
      </button>

      {status === "error" && (
        <p role="alert" className="text-sm text-red-400">
          Something went wrong submitting the form. Please try again or email
          us directly.
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-1">{children}</div>
      {error && (
        <span role="alert" className="mt-1 block text-sm text-red-400">
          {error}
        </span>
      )}
    </label>
  );
}
