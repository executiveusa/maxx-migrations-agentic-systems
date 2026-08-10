"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const starters = ["Leads fall through", "Too many tools", "Manual follow-up"];

function mergeIntakeAnswers(next: Record<string, string>) {
  try {
    const current = JSON.parse(localStorage.getItem("maxx_answers") || "{}");
    localStorage.setItem("maxx_answers", JSON.stringify({ ...current, ...next }));
  } catch {
    localStorage.setItem("maxx_answers", JSON.stringify(next));
  }
}

export function AuditCommand() {
  const router = useRouter();
  const [problem, setProblem] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = problem.trim();
    if (!value) return;
    router.push(`/audit?problem=${encodeURIComponent(value)}`);
  }

  return (
    <form onSubmit={submit} className="mt-10 max-w-2xl" aria-label="Start the Vibe Audit">
      <label htmlFor="homepage-problem" className="block text-xs font-bold uppercase tracking-[0.14em] text-accent">
        What is the biggest thing slowing your business down?
      </label>
      <div className="mt-4 flex items-center gap-3 border-y border-text py-3">
        <span aria-hidden className="text-xl text-accent">→</span>
        <input
          id="homepage-problem"
          value={problem}
          onChange={(event) => setProblem(event.target.value)}
          placeholder="Tell us in plain language"
          className="min-w-0 flex-1 bg-transparent px-1 py-3 text-base text-text outline-none placeholder:text-muted md:text-lg"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-bold text-white transition-transform duration-150 active:scale-[0.98]"
        >
          Start
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2" aria-label="Common starting points">
        {starters.map((starter) => (
          <button
            key={starter}
            type="button"
            onClick={() => setProblem(starter)}
            className="rounded-full border border-border px-3 py-2 text-xs text-muted transition-colors duration-150 hover:border-accent hover:text-text"
          >
            {starter}
          </button>
        ))}
      </div>
    </form>
  );
}

export function AuditPreIntake() {
  const searchParams = useSearchParams();
  const initialProblem = searchParams.get("problem") ?? "";
  const [step, setStep] = useState(0);
  const [problem, setProblem] = useState(initialProblem);
  const [outcome, setOutcome] = useState("");
  const [company, setCompany] = useState("");

  const fields = useMemo(
    () => [
      {
        label: "What is the biggest thing slowing the business down?",
        value: problem,
        setValue: setProblem,
        placeholder: "Example: inbound leads wait too long for a response",
      },
      {
        label: "What would a good 90-day result look like?",
        value: outcome,
        setValue: setOutcome,
        placeholder: "Example: every qualified lead gets a response in under 5 minutes",
      },
      {
        label: "What company or website should we inspect?",
        value: company,
        setValue: setCompany,
        placeholder: "Company name or website URL",
      },
    ],
    [company, outcome, problem],
  );

  const current = fields[step];
  const done = step === fields.length - 1;

  function advance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!current || !current.value.trim()) return;

    if (!done) {
      setStep((value) => value + 1);
      return;
    }

    mergeIntakeAnswers({
      bottleneck: problem.trim(),
      outcome_90: outcome.trim(),
      company_name: company.trim(),
    });
    window.location.assign("/intake/");
  }

  if (!current) return null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.12em] text-muted">
        <span>Vibe Audit intake</span>
        <span>{step + 1} / {fields.length}</span>
      </div>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-border" aria-hidden>
        <div className="h-full bg-accent transition-[width] duration-200" style={{ width: `${((step + 1) / fields.length) * 100}%` }} />
      </div>

      <form onSubmit={advance} className="mt-12">
        <label htmlFor="audit-answer" className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-text md:text-6xl">
          {current.label}
        </label>
        <input
          id="audit-answer"
          autoFocus
          value={current.value}
          onChange={(event) => current.setValue(event.target.value)}
          placeholder={current.placeholder}
          className="mt-10 w-full border-0 border-b border-text bg-transparent px-0 py-5 text-xl text-text outline-none placeholder:text-muted/70 focus:border-accent md:text-2xl"
        />
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-md text-sm leading-6 text-muted">
            We use the full intake behind the scenes, but only ask one unresolved decision at a time. Facts we can inspect ourselves stay out of your way.
          </p>
          <button
            type="submit"
            className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition-transform duration-150 active:scale-[0.98]"
          >
            {done ? "Continue to full intake" : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
