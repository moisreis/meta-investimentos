import { RequireSessionUser } from "@/lib/auth/require-session"
import { AuditLogContainer } from "@/presentation/composition/audit-log.container"
import type { AuditLogResponseDTO } from "@/services/audit-log/dto/audit-log-response.dto"

import { BuildAuditLogRowSummaries } from "./build-audit-log-row-summaries.helper"
import type { AuditLogRowSummary } from "../types/audit-log-list.types"

export interface LoadSessionAuditLogsOutput {
  auditLogs: AuditLogResponseDTO[]
  summaries: Record<string, AuditLogRowSummary>
}

/**
 * @summary
 * Resolves the session user, the system audit trail and
 * the acting users present in it.
 *
 * @remarks
 * Lists every audit log under the session guard and hydrates
 * the distinct acting users in a single batched query.
 * Returns null when there is no active session.
 *
 * @explanation
 * Use this helper from the audit log page loader so session
 * resolution, audit listing and actor hydration stay in a
 * single composition point.
 *
 * @returns The audit logs and their summaries, or null.
 *
 * @example
 * const BUNDLE = await LoadSessionAuditLogs();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function LoadSessionAuditLogs(): Promise<LoadSessionAuditLogsOutput | null> {
  const USER = await RequireSessionUser()

  if (!USER) return null

  const { list: LIST_LOGS, listUsers: LIST_USERS } =
    AuditLogContainer()

  const LOGS = await LIST_LOGS.execute()

  const ACTOR_IDS = Array.from(
    new Set(
      LOGS.map((log) => log.userId).filter((id): id is string =>
        Boolean(id)
      )
    )
  )

  const USERS = await LIST_USERS.execute({
    userIds: ACTOR_IDS,
  })

  return {
    auditLogs: LOGS,
    summaries: BuildAuditLogRowSummaries(LOGS, USERS),
  }
}
