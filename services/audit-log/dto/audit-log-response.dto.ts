/**
 * @summary
 * Represents the shape of the audit log response.
 *
 * @remarks
 * This DTO is the format of the response for audit log
 * queries. All ids are strings and the creation date is
 * an ISO 8601 string.
 *
 * @explanation
 * Use this DTO when exposing an audit log entry to the
 * consumers of the service layer.
 *
 * @example
 * const RESPONSE = TO_RESPONSE_DTO(AUDIT_LOG_ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export interface AuditLogResponseDTO {
  id: string
  // Name of the audited entity type.
  entity: string
  // Identifier of the audited entity instance.
  entityId: string
  // Action performed on the entity.
  action: string
  // Recorded field changes, or null when not captured.
  changes: Record<string, unknown> | null
  // Identifier of the acting user, or null for system logs.
  userId: string | null
  createdAt: string
}
