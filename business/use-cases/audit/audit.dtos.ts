/**
 * The public representation of a notification derived from the audit
 * trail.
 *
 * A notification mirrors an `audit_log` row, exposing only the fields a
 * notification feed needs: what changed, on which entity, and when.
 * The `id` is the underlying audit log entry's identifier and the
 * `createdAt` is serialized in ISO 8601.
 */
export interface NotificationDto {
  /**
   * The unique identifier of the audit log entry.
   */
  id: string;

  /**
   * The audited entity name, e.g. `"Portfolio"`.
   */
  entity: string;

  /**
   * The unique identifier of the audited entity.
   */
  entityId: string;

  /**
   * The performed action, e.g. `"CREATED"`, `"UPDATED"`, `"DELETED"`.
   */
  action: string;

  /**
   * The ISO 8601 timestamp of the action.
   */
  createdAt: string;
}
