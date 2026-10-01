import { LoadSessionAuditLogs } from "../helpers/load-session-audit-logs.helper"
import type { AuditLogListProps } from "../pages/list"
import type { AuditLogRow } from "@/presentation/types/audit-log-row.types"
import type { AuditLogRowSummary } from "../types/audit-log-list.types"

/**
 * @summary
 * Resolves the props for the audit log list page.
 *
 * @remarks
 * Loads the session audit log rows and their display data.
 *
 * @returns The audit log list props, or empty props when
 * there is no active session.
 *
 * @example
 * const PROPS = await LoadAuditLogPageProps();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export async function LoadAuditLogPageProps(): Promise<AuditLogListProps> {
  let data: AuditLogRow[] | null = null
  let summaries: Record<string, AuditLogRowSummary> | null = null

  const BUNDLE = await LoadSessionAuditLogs()

  if (BUNDLE) {
    data = BUNDLE.auditLogs
    summaries = BUNDLE.summaries
  }

  return { data, summaries }
}
