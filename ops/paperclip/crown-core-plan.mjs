/* Paperclip is a task manager, not MACS's client data or approval database.
   Deterministic IDs in descriptions allow safe reconnection to existing work. */
export const CROWN_PROJECT_ID = "maxx:crown-and-core:paperclip-offer";
export const MARKER = "[project_id:" + CROWN_PROJECT_ID + "]";
export const PROJECT = Object.freeze({
  name: "Crown & Core — MACS Growth System",
  description: MARKER + " Prospective Crown & Core first tenant. Internal Vibe Audit before any commercial release. Reuses MAXX and old StarNet context; no client-authorized writes.",
  status: "planned",
  workspace: {
    name: "MAXX canonical backend — Crown & Core branch",
    repoUrl: "https://github.com/executiveusa/maxx-migrations-agentic-systems",
    repoRef: "feat/crown-core-paperclip-vibe-audit",
    isPrimary: true
  }
});
export const TASKS = Object.freeze([
  ["CC-P0","Verify source, deployment authority and existing services","todo","high","Inspect MAXX, Crown growth repo, Paperclip instance, legacy StarNet, client signature and credentials. Do not change production.",[]],
  ["CC-P1","Verify existing Paperclip company and manager adapter","todo","high","Reuse one verified MACS company and existing Instinct identity. Prove heartbeat and checkpoint; never invent authenticated adapter.",["CC-P0"]],
  ["CC-P2","Migrate StarNet knowledge into MAXX context map","todo","medium","Map each useful agent contract and past evidence KEEP/MERGE/PARK; preserve original StarNet branch and client context.",["CC-P0"]],
  ["CC-P3","Register canonical scoped Vibe Audit","backlog","high","Review MAXX offer manifest, bearer-gated MCP tools, RLS and current draft PR #39. Do not claim deployed endpoints.",["CC-P2"]],
  ["CC-P4","Prove real audit/review/proposal path in MACS staging","backlog","high","Use two real test tenants, independent reviewer, immutable receipts, no patient data or external effects.",["CC-P3"]],
  ["CC-P5","Prove three actual 600s manager runs and recovery","backlog","high","Check timed run IDs, checkpoint persistence, duplicate suppression, pause/resume and cross-party A2A evidence.",["CC-P1"]],
  ["CC-P6","Independent security and acceptance review","backlog","high","Independently reproduce auth, isolation, stale hash, self-review rejection, rate limits and rollback.",["CC-P4"]],
  ["CC-P7","Prepare new four-stage owner-facing offer","backlog","medium","Produce a clean unpriced Crown & Core Vibe Audit proposal; preserve historical unsigned 90-day agreement.",["CC-P3"]],
  ["CC-P8","Recover growth sources and repair CI without preview exposure","backlog","medium","Check Vercel preview suppression first; recover five missing source files from verified original ZIPs; no public deploy.",["CC-P0"]],
  ["CC-P9","Produce private branded proof assets and booking handoff","backlog","medium","Only rights-cleared clips and mobile pages; verify booking without real patient data; reuse Montage/Motion Master.",["CC-P7","CC-P8"]],
  ["CC-P10","Commercial evidence and bounded pilot acceptance","backlog","medium","Require one working private demo, independent signoff, owner pricing decision and real buyer feedback.",["CC-P5","CC-P6","CC-P7"]],
  ["CC-P11","Authorized sovereign release and MAXX Operations","backlog","low","BLOCKED until contract, legal/clinical/media rights, security and owner release approvals. No autonomous production changes.",["CC-P9","CC-P10"]]
].map(([id,title,status,priority,description,depends_on]) => ({
  id,title,status,priority,description,depends_on
})));
export const ROOT_TITLE = "CC-ROOT | Crown & Core — Complete MACS MAXX delivery";
