"use client";

import { FormEvent, useState } from "react";

type ReceiptState = {
  submission?: { id: string; status: string };
  proposals?: Array<{
    id: string;
    status: string;
    action_type: string;
    result?: unknown;
  }>;
  proof?: {
    sideEffects: number;
    pendingApproval: boolean;
    rejectedWithoutSideEffect: boolean;
    executedExactlyOnce: boolean;
  };
  error?: string;
};

export function ClientZeroReviewConsole() {
  const [submissionId, setSubmissionId] = useState("");
  const [receiptToken, setReceiptToken] = useState("");
  const [state, setState] = useState<ReceiptState | null>(null);
  const [busy, setBusy] = useState(false);

  async function loadReceipt(event?: FormEvent) {
    event?.preventDefault();
    if (!submissionId || !receiptToken) return;
    setBusy(true);
    try {
      const response = await fetch(
        `/api/intake/${encodeURIComponent(submissionId)}?receipt=${encodeURIComponent(receiptToken)}`,
        { cache: "no-store" },
      );
      setState(await response.json());
    } finally {
      setBusy(false);
    }
  }

  async function review(proposalId: string, decision: "approve" | "reject") {
    setBusy(true);
    try {
      const response = await fetch(`/api/intake/actions/${proposalId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      const result = await response.json();
      if (!response.ok) {
        setState((current) => ({ ...(current ?? {}), error: result.error ?? "Review failed." }));
        return;
      }
      await loadReceipt();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={loadReceipt} className="grid gap-4 rounded-xl border border-border bg-surface p-5 md:grid-cols-[1fr_1fr_auto]">
        <label className="space-y-2 text-sm">
          <span className="text-muted">Submission ID</span>
          <input
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-text"
            value={submissionId}
            onChange={(event) => setSubmissionId(event.target.value)}
            placeholder="UUID from intake receipt"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-muted">Receipt token</span>
          <input
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-text"
            value={receiptToken}
            onChange={(event) => setReceiptToken(event.target.value)}
            placeholder="Opaque receipt token"
          />
        </label>
        <button
          className="self-end rounded-md bg-accent px-4 py-2 font-medium text-bg disabled:opacity-50"
          disabled={busy || !submissionId || !receiptToken}
          type="submit"
        >
          {busy ? "Checking…" : "Load proof"}
        </button>
      </form>

      {state?.error ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
          {state.error}
        </div>
      ) : null}

      {state?.proof ? (
        <div className="grid gap-4 md:grid-cols-4">
          <Proof label="Side effects" value={String(state.proof.sideEffects)} />
          <Proof label="Pending approval" value={state.proof.pendingApproval ? "YES" : "NO"} />
          <Proof label="Rejected safely" value={state.proof.rejectedWithoutSideEffect ? "PASS" : "—"} />
          <Proof label="Exactly once" value={state.proof.executedExactlyOnce ? "PASS" : "—"} />
        </div>
      ) : null}

      <div className="space-y-4">
        {(state?.proposals ?? []).map((proposal) => (
          <article key={proposal.id} className="rounded-xl border border-border bg-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">{proposal.action_type}</p>
                <h3 className="mt-1 font-medium text-text">{proposal.id}</h3>
                <p className="mt-2 text-sm text-muted">Status: {proposal.status}</p>
              </div>
              {proposal.status === "proposed" ? (
                <div className="flex gap-2">
                  <button
                    disabled={busy}
                    className="rounded-md border border-border px-3 py-2 text-sm"
                    onClick={() => review(proposal.id, "reject")}
                  >
                    Reject
                  </button>
                  <button
                    disabled={busy}
                    className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-bg"
                    onClick={() => review(proposal.id, "approve")}
                  >
                    Approve + execute
                  </button>
                </div>
              ) : null}
            </div>
            {proposal.result ? (
              <pre className="mt-4 overflow-auto rounded-md bg-bg p-3 text-xs text-muted">
                {JSON.stringify(proposal.result, null, 2)}
              </pre>
            ) : null}
          </article>
        ))}
      </div>

      {submissionId ? (
        <a
          className="inline-flex rounded-md border border-border px-4 py-2 text-sm text-text"
          href={`/api/intake/${encodeURIComponent(submissionId)}/export`}
        >
          Export authorized ICM evidence bundle
        </a>
      ) : null}
    </div>
  );
}

function Proof({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-2 text-xl font-semibold text-text">{value}</div>
    </div>
  );
}
