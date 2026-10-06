import type { AuditActionToken } from "./shared-audit-actions.settings"
import type { AuditEntityName } from "./shared-audit-entities.settings"

/**
 * @summary
 * What a completed action tells the header notification.
 *
 * @remarks
 * A server action records what it did in the audit log and
 * hands this payload back with its success result, so the
 * browser can raise the notification without a second
 * request to find out what just happened.
 *
 * The values are the recorded tokens rather than finished
 * sentences: the notification resolves them through the same
 * tables the audit log screen uses, which is what keeps a
 * single wording for each act.
 *
 * @explanation
 * Use as the `audit` member of a successful action result.
 * It crosses the server boundary, so `at` is an ISO 8601
 * string rather than a `Date`.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export interface AuditNotification {
  // Recorded action token, such as `CREATED`.
  action: AuditActionToken

  // Canonical stored name of the touched kind, such as
  // `Portfolio`.
  entity: AuditEntityName

  // Name of the touched record, when the action knows it. A
  // deletion does not, because the row is already gone, and
  // the notification then names the entity type alone.
  entityName?: string | null

  // ISO 8601 instant the entry was recorded at.
  at: string
}
