export interface AuditLogEntry {
  id: string;
  organizationId: string;
  actorName: string;
  action: string;
  targetType: string;
  targetId: string;
  createdAt: string;
}
