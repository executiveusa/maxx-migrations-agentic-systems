import assert from "node:assert/strict";
import test from "node:test";
import {
  CROWN_OFFER,
  safeEvidenceUrl,
  prepareAudit,
  prepareProposal,
  artifactDigest,
} from "../../lib/offers/crown-core.mjs";

const auditInput = {
  business_name: "Crown & Core",
  sources: [{ id: "site", url: "https://crownandcore.com/" }],
  findings: [
    {
      observation: "Booking workflow needs independent testing",
      recommendation:
        "Complete an owner-authorized, non-PHI booking handoff walkthrough",
      evidence_refs: ["site"],
      priority: "high",
    },
    {
      observation: "Impact not yet measured",
      recommendation: "Request consented baseline funnel figures",
      evidence_refs: [],
      priority: "medium",
    },
  ],
};
test("offer is never sellable or priced without approval", () => {
  assert.equal(CROWN_OFFER.sellable, false);
  assert.equal(CROWN_OFFER.price, null);
  assert.equal(CROWN_OFFER.external_execution_enabled, false);
  assert.equal(CROWN_OFFER.next_offers.length, 3);
});
test("public HTTPS source is accepted without claiming verification", () => {
  const artifact = prepareAudit(auditInput);
  assert.equal(artifact.findings[0].evidence_status, "DOCUMENTED_NOT_VERIFIED");
  assert.equal(artifact.findings[0].confidence, "unverified");
  assert.equal(artifact.sources[0].independent_verification, false);
  assert.equal(artifact.external_side_effects, 0);
  assert.equal(artifact.price, null);
});
test("empty evidence produces no fabricated findings", () => {
  const artifact = prepareAudit({
    business_name: "Crown & Core",
    sources: [],
    findings: [],
  });
  assert.deepEqual(artifact.findings, []);
  assert.match(artifact.summary, /No verified findings/);
});
test("findings without refs are explicitly hypotheses", () => {
  const a = prepareAudit({
    ...auditInput,
    findings: [
      {
        observation: "A possible issue",
        recommendation: "Measure it",
        priority: "low",
      },
    ],
  });
  assert.equal(a.findings[0].evidence_status, "HYPOTHESIS");
});
test("wrong tenant input is rejected", () => {
  assert.throws(
    () => prepareAudit({ ...auditInput, business_name: "Other client" }),
    /authorized/
  );
});
test("duplicate source identifiers are rejected", () => {
  assert.throws(
    () =>
      prepareAudit({
        ...auditInput,
        sources: [auditInput.sources[0], auditInput.sources[0]],
      }),
    /duplicate/
  );
});
test("unknown evidence references are rejected", () => {
  assert.throws(
    () =>
      prepareAudit({
        ...auditInput,
        findings: [
          {
            observation: "Claim",
            recommendation: "Do",
            evidence_refs: ["unseen"],
          },
        ],
      }),
    /unknown/
  );
});
test("private and local URLs are rejected", () => {
  for (const url of [
    "http://127.0.0.1/",
    "https://127.0.0.1/",
    "https://localhost/",
    "https://service.internal/",
    "file:///etc/passwd",
    "https://user:pw@example.com/",
  ]) {
    assert.equal(safeEvidenceUrl(url), false, url);
  }
});
test("source limit is enforced", () => {
  const sources = Array.from({ length: 16 }, (_, i) => ({
    id: "s" + i,
    url: "https://example.com/",
  }));
  assert.throws(() => prepareAudit({ ...auditInput, sources }), /bounded/);
});
test("finding limit is enforced", () => {
  const findings = Array.from({ length: 11 }, () => ({
    observation: "X",
    recommendation: "Y",
  }));
  assert.throws(() => prepareAudit({ ...auditInput, findings }), /bounded/);
});
test("priority ordering is deterministic", () => {
  const a = prepareAudit({
    ...auditInput,
    findings: [
      { observation: "Low", recommendation: "Measure", priority: "low" },
      { observation: "High", recommendation: "Measure", priority: "high" },
    ],
  });
  assert.equal(a.findings[0].observation, "High");
});
test("hash is canonical across key order", () => {
  assert.equal(
    artifactDigest({ b: 2, a: { z: 1, y: 2 } }),
    artifactDigest({ a: { y: 2, z: 1 }, b: 2 })
  );
});
test("a draft or rejected audit cannot be converted to a proposal", () => {
  const a = prepareAudit(auditInput);
  assert.throws(
    () => prepareProposal({ kind: "audit", status: "draft", artifact: a }),
    /reviewed/
  );
  assert.throws(
    () => prepareProposal({ kind: "audit", status: "rejected", artifact: a }),
    /reviewed/
  );
});
test("reviewed audit produces unpriced and bounded internal proposal", () => {
  const a = prepareAudit(auditInput);
  const p = prepareProposal({
    kind: "audit",
    status: "reviewed",
    artifact: a,
    id: "audit-test",
    payload_hash: artifactDigest(a),
  });
  assert.equal(p.kind, "proposal");
  assert.equal(p.price, null);
  assert.equal(p.tax, null);
  assert.equal(p.guarantee, null);
  assert.equal(p.external_side_effects, 0);
  assert.equal(p.source_audit_id, "audit-test");
  assert.equal(p.priority_actions.length, 2);
});
test("arbitrary offer cannot be laundered into proposal", () => {
  assert.throws(
    () =>
      prepareProposal({
        kind: "audit",
        status: "reviewed",
        artifact: { offer_id: "bad" },
      }),
    /reviewed/
  );
});
