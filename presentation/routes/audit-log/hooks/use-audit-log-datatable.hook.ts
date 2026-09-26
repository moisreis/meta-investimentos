"use client"

import { useCallback, useMemo } from "react"
import {
  createColumnHelper,
  useTable,
} from "@tanstack/react-table"

import { ENTITY_TABLE_FEATURES } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { AuditLogResponseDTO } from "@/services/audit-log/dto/audit-log-response.dto"

import { CreateAuditLogTableColumns } from "../datatable/table-columns"
import type { AuditLogRowSummary } from "../types/audit-log-list.types"

// Column helper bound to the entity table features.
const COLUMN_HELPER = createColumnHelper<
  EntityTableFeatures,
  AuditLogResponseDTO
>()

/**
 * @summary
 * Coordinates the audit log datatable instance.
 *
 * @remarks
 * Creates the shared table instance used by the toolbar, the
 * datatable and the pagination. Rows start sorted by creation
 * date descending so the newest activity appears first.
 *
 * @param auditLogs - The rows rendered by the datatable.
 * @param summaries - Derived per-row data (acting user
 * display) keyed by audit log id.
 *
 * @returns The table instance.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useAuditLogDatatable(
  auditLogs: AuditLogResponseDTO[],
  summaries: Record<string, AuditLogRowSummary> | null = null
) {
  const summaryFor = useCallback(
    (auditLogId: string) => summaries?.[auditLogId] ?? null,
    [summaries]
  )

  const COLUMNS = useMemo(
    () =>
      CreateAuditLogTableColumns(COLUMN_HELPER, {
        summaryFor,
      }),
    [summaryFor]
  )

  const TABLE = useTable({
    features: ENTITY_TABLE_FEATURES,
    columns: COLUMNS,
    data: auditLogs,
    getRowId: (row) => row.id,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  })

  return {
    table: TABLE,
  }
}

export { useAuditLogDatatable }
