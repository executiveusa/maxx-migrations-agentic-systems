export interface Organization {
  id: string;
  name: string;
  slug: string;
  missionFocus: string;
  plan: "sovereign_install" | "sovereign_install_plus_partner";
  createdAt: string;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  avatarInitial: string;
}
