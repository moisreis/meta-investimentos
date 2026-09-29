/**
 * @summary
 * Audit log row rendered by the presentation layer.
 *
 * @remarks
 * Projects the audit log read model onto the fields
 * the screens actually render. Every money and quota
 * value stays a decimal string so the presenters are
 * the only place that formats it.
 *
 * @explanation
 * Use this type in tables, dialogs, forms and hooks.
 * The route loader maps the response DTO into it, so
 * no view file depends on the service layer.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export interface AuditLogRow {
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
