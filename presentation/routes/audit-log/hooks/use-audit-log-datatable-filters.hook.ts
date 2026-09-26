"use client"

import { useMemo, useState } from "react"

import type { AuditLogResponseDTO } from "@/services/audit-log/dto/audit-log-response.dto"

import type { AuditLogRowSummary } from "../types/audit-log-list.types"

interface UseAuditLogDatatableFiltersInput {
  auditLogs: AuditLogResponseDTO[]
  summaries: Record<string, AuditLogRowSummary> | null
}

/**
 * @summary
 * Handles the query filter of the audit log datatable.
 *
 * @remarks
 * Narrows the rows by the entity, action, entity id, changes
 * payload and the acting user name of each log.
 *
 * @param auditLogs - The rows rendered by the datatable.
 * @param summaries - Derived per-row data keyed by log id.
 *
 * @returns The query state and the filtered rows.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useAuditLogDatatableFilters({
  auditLogs,
  summaries,
}: UseAuditLogDatatableFiltersInput) {
  const [QUERY, setQuery] = useState("")

  const FILTERED = useMemo(() => {
    const NORMALIZED = QUERY.trim().toLowerCase()

    if (!NORMALIZED) return auditLogs

    return auditLogs.filter((log) => {
      const ACTOR = summaries?.[log.id]?.actor

      return [
        log.entity,
        log.entityId,
        log.action,
        log.changes ? JSON.stringify(log.changes) : "",
        ACTOR?.firstName ?? "",
        ACTOR?.lastName ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(NORMALIZED)
    })
  }, [auditLogs, summaries, QUERY])

  return {
    query: QUERY,
    onQueryChange: setQuery,
    filteredAuditLogs: FILTERED,
  }
}

export { useAuditLogDatatableFilters }
