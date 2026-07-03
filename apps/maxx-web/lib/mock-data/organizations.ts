import type { Organization, OrganizationMember } from "@/lib/types/organizations";

export const currentOrganization: Organization = {
  id: "org_riverside_mutual_aid",
  name: "Riverside Mutual Aid Kitchen",
  slug: "riverside-mutual-aid",
  missionFocus: "Emergency food access and community resilience",
  plan: "sovereign_install_plus_partner",
  createdAt: "2025-11-03T00:00:00.000Z",
};

export const organizationMembers: OrganizationMember[] = [
  { id: "member_1", organizationId: currentOrganization.id, name: "Dana Okafor", email: "dana@riversidemutualaid.org", role: "owner", avatarInitial: "D" },
  { id: "member_2", organizationId: currentOrganization.id, name: "Miguel Santos", email: "miguel@riversidemutualaid.org", role: "admin", avatarInitial: "M" },
  { id: "member_3", organizationId: currentOrganization.id, name: "Priya Nair", email: "priya@riversidemutualaid.org", role: "member", avatarInitial: "P" },
];
