export type CrownSource = { id: string; url: string; retrieved_at?: string | null };
export type CrownFinding = { observation: string; recommendation: string; evidence_refs?: string[]; priority?: "high" | "medium" | "low" };
export type CrownAuditInput = {
  business_name: "Crown & Core"; sources: CrownSource[]; findings: CrownFinding[];
};
export type CrownArtifact = {
  schema_version: string; offer_id: string; kind: "audit" | "proposal";
  subject: { business_name: string }; external_side_effects: 0; price: null;
  findings?: Array<{id:string;observation:string;recommendation:string;priority:string;evidence_refs:string[];evidence_status:string}>;
  [key: string]: unknown;
};
export const CROWN_OFFER: Readonly<{
  schema_version:string; offer_id:string; provider:string; display_name:string;
  tenant_key:string; availability:string; sellable:false; publicly_visible:false;
  price:null; currency:string; pricing_status:string; external_execution_enabled:false;
  requires_human_approval:true;
  next_offers: ReadonlyArray<{id:string;status:string}>;
}>;
export function artifactDigest(value: unknown): string;
export function safeEvidenceUrl(value: string): boolean;
export function prepareAudit(input: CrownAuditInput): CrownArtifact;
export function prepareProposal(reviewedAudit: {
  id: string; kind: "audit"; status: "reviewed";
  payload_hash:string; artifact:CrownArtifact;
}): CrownArtifact;
