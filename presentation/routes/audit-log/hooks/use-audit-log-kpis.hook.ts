"use client"

import { useCallback } from "react"

import type { EntityKpi } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { useEntityKpis } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import type { AuditLogResponseDTO } from "@/services/audit-log/dto/audit-log-response.dto"

import { AUDIT_LOG_KPI } from "../settings/labels.settings"

interface UseAuditLogKpisInput {
  auditLogs: AuditLogResponseDTO[]
}

// Duration in milliseconds of the recent window.
const RECENT_WINDOW_MS = 24 * 60 * 60 * 1000

// Tallies the data-driven audit log KPI cards.
function BuildAuditLogKpis(
  auditLogs: readonly AuditLogResponseDTO[]
): EntityKpi[] {
  const ENTITIES = new Set(auditLogs.map((log) => log.entity))
  const ACTIONS = new Set(auditLogs.map((log) => log.action))
  const CUTOFF = Date.now() - RECENT_WINDOW_MS
  const RECENT_COUNT = auditLogs.filter(
    (log) => new Date(log.createdAt).getTime() >= CUTOFF
  ).length

  return [
    {
      key: "total",
      title: AUDIT_LOG_KPI.TOTAL_TITLE,
      value: FormatCount(auditLogs.length),
      comparison: AUDIT_LOG_KPI.TOTAL_COMPARISON,
    },
    {
      key: "entities",
      title: AUDIT_LOG_KPI.ENTITIES_TITLE,
      value: FormatCount(ENTITIES.size),
      comparison: AUDIT_LOG_KPI.ENTITIES_COMPARISON,
    },
    {
      key: "actions",
      title: AUDIT_LOG_KPI.ACTIONS_TITLE,
      value: FormatCount(ACTIONS.size),
      comparison: AUDIT_LOG_KPI.ACTIONS_COMPARISON,
    },
    {
      key: "recent",
      title: AUDIT_LOG_KPI.RECENT_TITLE,
      value: FormatCount(RECENT_COUNT),
      comparison: AUDIT_LOG_KPI.RECENT_COMPARISON,
    },
  ]
}

/**
 * @summary
 * Builds the data-driven KPI cards of the audit log list.
 *
 * @remarks
 * Tallies the total entries, the distinct audited entities
 * and actions and the activities of the last 24 hours. All
 * values are formatted through the count presenter.
 *
 * @param auditLogs - The rows of the audit log list.
 *
 * @returns The audit log KPI list.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useAuditLogKpis({
  auditLogs,
}: UseAuditLogKpisInput): EntityKpi[] {
  const compute = useCallback(
    (items: readonly AuditLogResponseDTO[]) =>
      BuildAuditLogKpis(items),
    []
  )

  return useEntityKpis({ items: auditLogs, compute })
}

export { useAuditLogKpis }
