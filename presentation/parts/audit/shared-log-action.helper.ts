import { LogError } from "@/lib/log/logger"
import { AuditLogContainer } from "@/presentation/composition/audit-log.container"
import { ActionSuccess } from "@/presentation/presenters/action-result.presenter"

import type { ActionResult } from "@/presentation/presenters/action-result.presenter"
import type { AuditActionToken } from "./shared-audit-actions.settings"
import type { AuditEntityName } from "./shared-audit-entities.settings"
import type { AuditNotification } from "./shared-audit-notification.types"

/**
 * @summary
 * What an action reports after it changes something.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export interface LogActionInput {
  // Id of the user who performed the action, always taken
  // from the session and never from the payload.
  userId: string

  // Action token, as declared by the shared audit actions.
  action: AuditActionToken

  // Entity name, in its canonical stored spelling as
  // declared by the shared audit entities.
  entity: AuditEntityName

  // Id of the touched record. A bulk action passes the id of
  // the first record it touched and carries the rest in
  // `changes`, so the entry points at one real row.
  entityId: string

  // Name of the touched record, when the action knows it.
  entityName?: string | null

  // Field changes or a description of what happened.
  changes?: Record<string, unknown> | null
}

/**
 * @summary
 * Records a completed action in the audit log and returns
 * the notification the browser raises for it.
 *
 * @remarks
 * The entry is a side effect of work that has already
 * succeeded, so a failure here is logged and swallowed:
 * losing the trail must not undo the record the user just
 * created, edited or deleted. The notification is returned
 * either way, because telling the user their action landed
 * does not depend on the trail being written.
 *
 * @explanation
 * Use right before a mutation action returns its success
 * result, so the entry carries the id the use case
 * generated. One call then covers both halves of the
 * requirement: the durable audit row and the live
 * notification, which travel together in the same result so
 * they cannot disagree about what happened.
 *
 * @param input - The recorded act and the record it touched.
 *
 * @returns The payload the header notification renders.
 *
 * @example
 * const AUDIT = await LogAction({
 *   userId: USER.id,
 *   action: "CREATED",
 *   entity: "Bank",
 *   entityId: BANK.id,
 *   entityName: BANK.name,
 * })
 *
 * return ActionSuccess(BANK, AUDIT)
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
async function LogAction(
  input: LogActionInput
): Promise<AuditNotification> {
  const AT = new Date().toISOString()

  try {
    const { create: CREATE_AUDIT_LOG } = AuditLogContainer()

    const ENTRY = await CREATE_AUDIT_LOG.execute({
      entity: input.entity,
      entityId: input.entityId,
      action: input.action,
      changes: input.changes ?? null,
      userId: input.userId,
    })

    return {
      action: input.action,
      entity: input.entity,
      entityName: input.entityName ?? null,
      at: ENTRY.createdAt,
    }
  } catch (cause) {
    LogError(
      "LogAction",
      `failed to record the ${input.action} of ${input.entity}.`,
      cause
    )

    return {
      action: input.action,
      entity: input.entity,
      entityName: input.entityName ?? null,
      at: AT,
    }
  }
}

export { LogAction, ActionAudited }

/**
 * @summary
 * Records a completed action and reports it as the action's
 * own success result.
 *
 * @remarks
 * This is the single line a mutation action ends on in place
 * of its plain success return: the audit row is written and
 * the payload the header notification needs rides along in the
 * result, so the two halves of reporting an action cannot
 * drift apart. An action that changes nothing keeps
 * `ActionSuccess` instead, because there is nothing to record.
 *
 * The audit write is best effort for the same reason `LogAction`
 * is: the record the user just created is not unwritten
 * because its trail failed.
 *
 * @explanation
 * Use at the end of a create, update, delete, reverse, generate,
 * calculate or import action, once the work it reports has
 * already succeeded.
 *
 * @param data - The payload the action returns to its caller.
 * @param input - What was done, to which record, by whom.
 *
 * @returns The successful result carrying the notification.
 *
 * @example
 * return ActionAudited(BANK, {
 *   userId: USER.id,
 *   action: "CREATED",
 *   entity: "Bank",
 *   entityId: BANK.id,
 *   entityName: BANK.name,
 * })
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
async function ActionAudited<T>(
  data: T,
  input: LogActionInput
): Promise<ActionResult<T>> {
  const AUDIT = await LogAction(input)

  return ActionSuccess(data, AUDIT)
}
