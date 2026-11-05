import { createHash } from "node:crypto";

/* Product logic only. MAXX/Supabase owns persistence and identity. No external fetches. */
export const CROWN_OFFER = Object.freeze({
  schema_version: "1.0",
  offer_id: "maxx-vibe-audit-v1",
  provider: "MACS Digital Media",
  display_name: "Vibe Audit",
  tenant_key: "crown-and-core",
  availability: "internal_draft",
  sellable: false,
  publicly_visible: false,
  price: null,
  currency: "USD",
  pricing_status: "requires_owner_approval",
  external_execution_enabled: false,
  requires_human_approval: true,
  next_offers: [
    { id: "vibe-rescue-sprint", status: "future_requires_approval" },
    { id: "sovereign-launch", status: "future_requires_approval" },
    { id: "maxx-operations", status: "future_requires_approval" }
  ]
});

function plain(value) {
  if (Array.isArray(value)) return value.map(plain);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, plain(value[key])]));
  }
  return value;
}

export function artifactDigest(value) {
  return createHash("sha256").update(JSON.stringify(plain(value))).digest("hex");
}

export function safeEvidenceUrl(value) {
  try {
    const u = new URL(value);
    const host = u.hostname.toLowerCase();
    return u.protocol === "https:" && !u.username && !u.password &&
      host !== "localhost" && !host.endsWith(".local") && !host.endsWith(".internal") &&
      !/^\d{1,3}(\.\d{1,3}){3}$/.test(host) &&
      !host.startsWith("[") && !host.includes(":") &&
      !host.endsWith(".test") && host.includes(".");
  } catch {
    return false;
  }
}

const RANK = { high: 0, medium: 1, low: 2 };
function text(value, max = 500) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) {
    throw new TypeError("A required text field is missing or too long.");
  }
  return value.trim();
}

export function prepareAudit(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new TypeError("Invalid audit input.");
  }
  const business = text(input.business_name, 120);
  if (business !== "Crown & Core") {
    throw new TypeError("Only the authorized Crown & Core configuration is supported.");
  }
  if (!Array.isArray(input.sources) || input.sources.length > 15) {
    throw new TypeError("Sources must be a bounded array.");
  }
  const seen = new Set();
  const sources = input.sources.map((s) => {
    const id = text(s.id, 60);
    const url = text(s.url, 1200);
    if (!safeEvidenceUrl(url) || seen.has(id)) throw new TypeError("Invalid or duplicate evidence source.");
    seen.add(id);
    return {
      id, url,
      retrieved_at: s.retrieved_at || null,
      provenance: "caller_supplied_unverified",
      independent_verification: false
    };
  });
  if (!Array.isArray(input.findings) || input.findings.length > 10) {
    throw new TypeError("Findings must be a bounded array.");
  }
  const findings = input.findings.map((f, index) => {
    const evidenceRefs = Array.isArray(f.evidence_refs) ? f.evidence_refs : [];
    if (evidenceRefs.length > 5 || evidenceRefs.some((v) => typeof v !== "string" || !seen.has(v))) {
      throw new TypeError("Finding references an unknown evidence source.");
    }
    const priority = f.priority || "medium";
    if (!Object.hasOwn(RANK, priority)) throw new TypeError("Unknown priority.");
    return {
      id: "finding-" + String(index + 1).padStart(2, "0"),
      observation: text(f.observation, 800),
      recommendation: text(f.recommendation, 800),
      priority,
      evidence_refs: evidenceRefs,
      confidence: "unverified",
      evidence_status: evidenceRefs.length ? "DOCUMENTED_NOT_VERIFIED" : "HYPOTHESIS"
    };
  }).sort((a, b) => RANK[a.priority] - RANK[b.priority]);
  return {
    schema_version: "1.0",
    offer_id: CROWN_OFFER.offer_id,
    kind: "audit",
    subject: { business_name: business },
    objectives: ["Website and conversion readiness", "Responsible, evidence-based marketing", "Prioritize bounded next steps"],
    sources, findings,
    summary: findings.length
      ? "Internal preaudit draft. All observations require independent source validation before external use."
      : "No verified findings. Collect and independently validate evidence before recommending changes.",
    approvals_required: ["client_scope", "independent_evidence_review", "owner_commercial_terms"],
    limitations: [
      "No client agreement or account access verified",
      "No patient data, clinical outcome, revenue or booking claims",
      "No website changes, campaigns, payments or external communications authorized",
      "Evidence URLs alone do not independently verify statements"
    ],
    price: null,
    external_side_effects: 0,
    review_status: "DRAFT"
  };
}

export function prepareProposal(reviewedAudit) {
  if (!reviewedAudit || reviewedAudit.kind !== "audit" ||
      reviewedAudit.status !== "reviewed" ||
      reviewedAudit.artifact?.offer_id !== CROWN_OFFER.offer_id) {
    throw new TypeError("A reviewed Crown & Core audit is required.");
  }
  const findings = reviewedAudit.artifact.findings || [];
  return {
    schema_version: "1.0",
    offer_id: CROWN_OFFER.offer_id,
    kind: "proposal",
    subject: { business_name: "Crown & Core" },
    source_audit_id: reviewedAudit.id,
    source_audit_digest: reviewedAudit.payload_hash,
    title: "Crown & Core — Vibe Audit follow-up",
    status: "INTERNAL_DRAFT",
    priority_actions: findings.slice(0, 3).map((f) => ({
      finding_id: f.id,
      recommendation: f.recommendation,
      evidence_status: f.evidence_status,
      acceptance: "Evidence reviewed and bounded owner-approved acceptance criteria established"
    })),
    commercial_next_step: "Vibe Rescue Sprint — possible next step, subject to owner/client agreement",
    excludes: [
      "Unapproved medical or device claims",
      "Advertising, outreach, publishing or booking modifications",
      "A signed agreement, promised ROI, pricing or scope authorization"
    ],
    price: null,
    tax: null,
    payment_terms: null,
    guarantee: null,
    external_side_effects: 0,
    approvals_required: ["owner_price_and_terms", "client_scope_and_signature", "independent_review"]
  };
}
