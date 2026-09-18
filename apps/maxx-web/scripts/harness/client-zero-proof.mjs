import process from "node:process";

const baseUrl = process.env.HARNESS_BASE_URL ?? "http://localhost:3000";
const payload = {
  schema_version: "1.0",
  answers: {
    company_name: { value: "MACS Client Zero Harness" },
    outcome_90: {
      value: "Prove durable intake and approval-gated exactly-once execution.",
    },
  },
  icm: {
    identity: [{ id: "company_name", value: "MACS Client Zero Harness" }],
  },
  ontology: {
    entities: ["Company"],
    relationships: [],
    states: [],
    events: ["IntakeSubmitted"],
  },
  open_questions: [],
  evidence: { harness: "scripts/harness/client-zero-proof.mjs" },
};

async function request(path, init) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

const submit = await request("/api/intake", {
  method: "POST",
  body: JSON.stringify(payload),
});

if (!submit.response.ok) {
  console.error(
    "Client Zero submit failed:",
    submit.response.status,
    submit.data
  );
  process.exit(1);
}

if (submit.data?.proposal?.sideEffectsBeforeApproval !== 0) {
  console.error("FAIL: side effect exists before approval.", submit.data);
  process.exit(1);
}

const { id: submissionId, receiptToken } = submit.data.submission;
const receipt = await request(
  `/api/intake/${submissionId}?receipt=${encodeURIComponent(receiptToken)}`
);

if (!receipt.response.ok) {
  console.error(
    "Receipt lookup failed:",
    receipt.response.status,
    receipt.data
  );
  process.exit(1);
}

if (
  receipt.data?.proof?.sideEffects !== 0 ||
  !receipt.data?.proof?.pendingApproval
) {
  console.error(
    "FAIL: proposal is not cleanly pending approval.",
    receipt.data
  );
  process.exit(1);
}

console.log("PASS capture:", submissionId);
console.log("PASS approval gate: zero side effects before human review.");
console.log(
  "NEXT: complete reject + approve/exactly-once checks from /app/client-zero with an authenticated operator."
);
