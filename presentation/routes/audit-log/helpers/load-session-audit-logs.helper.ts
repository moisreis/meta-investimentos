import { headers } from "next/headers"

import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { AuditLogRepository } from "@/infrastructure/audit-log/repositories/audit-log.repository"
import { UserRepository } from "@/infrastructure/user/repositories/user.repository"
import type { AuditLogResponseDTO } from "@/services/audit-log/dto/audit-log-response.dto"
import { ListAuditLogsUseCase } from "@/services/audit-log/use-cases/list-audit-logs.use-case"
import { ListUsersByIdsUseCase } from "@/services/user/use-cases/list-users-by-ids.use-case"

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
  const SESSION = await auth.api.getSession({
    headers: await headers(),
  })

  if (!SESSION?.user) return null

  const AUDIT_LOG_REPOSITORY = new AuditLogRepository(db)
  const LIST_USE_CASE = new ListAuditLogsUseCase(
    AUDIT_LOG_REPOSITORY
  )
  const LOGS = await LIST_USE_CASE.execute()

  const ACTOR_IDS = Array.from(
    new Set(
      LOGS.map((log) => log.userId).filter((id): id is string =>
        Boolean(id)
      )
    )
  )

  const USER_REPOSITORY = new UserRepository(db)
  const LIST_USERS_USE_CASE = new ListUsersByIdsUseCase(
    USER_REPOSITORY
  )
  const USERS = await LIST_USERS_USE_CASE.execute({
    userIds: ACTOR_IDS,
  })

  return {
    auditLogs: LOGS,
    summaries: BuildAuditLogRowSummaries(LOGS, USERS),
  }
}
