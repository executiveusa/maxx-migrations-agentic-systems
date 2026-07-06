export interface MigrationAuditRequest {
  id: string;
  organizationName: string;
  websiteUrl: string;
  contactName: string;
  email: string;
  phone: string | null;
  organizationType: string;
  missionFocus: string;
  currentTools: string | null;
  biggestProblem: string;
  budgetRange: string;
  desiredTimeline: string;
  status: "new_audit_request";
  source: "public_site";
  submittedAt: string;
}
