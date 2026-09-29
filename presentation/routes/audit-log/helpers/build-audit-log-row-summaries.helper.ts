import type {
  AuditLogActor,
  AuditLogRowSummary,
} from "../types/audit-log-list.types"

import type { AuditLogRow } from "@/presentation/types/audit-log-row.types"
import type { UserRow } from "@/presentation/types/user-row.types"
/**
 * @summary
 * Composes the derived data of the audit log rows.
 *
 * @remarks
 * Resolves the acting user display data per log through
 * the user id column. Logs without an actor resolve to
 * `null` for the summary. Summaries are keyed by log id.
 *
 * @explanation
 * Use this helper in the page loader to build the summary
 * record consumed by the datatable.
 *
 * @param auditLogs - The audit log rows.
 * @param users - The acting users used for lookups.
 *
 * @returns The summaries keyed by audit log id.
 *
 * @example
 * const SUMMARIES = BuildAuditLogRowSummaries(
 *   LOGS,
 *   USERS
 * );
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildAuditLogRowSummaries(
  auditLogs: AuditLogRow[],
  users: UserRow[]
): Record<string, AuditLogRowSummary> {
  const USERS_BY_ID = new Map(
    users.map((user) => [user.id, user])
  )

  return Object.fromEntries(
    auditLogs.map((log) => {
      const ACTOR = log.userId
        ? USERS_BY_ID.get(log.userId)
        : undefined

      const SUMMARY_ACTOR: AuditLogActor | null = ACTOR
        ? {
            firstName: ACTOR.firstName,
            lastName: ACTOR.lastName,
            image: ACTOR.image,
          }
        : null

      return [
        log.id,
        {
          actor: SUMMARY_ACTOR,
        },
      ]
    })
  )
}
