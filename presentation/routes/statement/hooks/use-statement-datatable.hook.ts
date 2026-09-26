"use client"

import { useCallback, useMemo } from "react"
import {
  createColumnHelper,
  useTable,
} from "@tanstack/react-table"

import { ENTITY_TABLE_FEATURES } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { StatementResponseDTO } from "@/services/statement/dto/statement-response.dto"

import { CreateStatementTableColumns } from "../datatable/table-columns"
import { useStatementBulkDelete } from "./use-statement-bulk-delete.hook"
import { useStatementGenerateDialog } from "./use-statement-generate-dialog.hook"
import { useStatementRowActions } from "./use-statement-row-actions.hook"
import type { StatementRowSummary } from "../types/statement-list.types"

// Column helper bound to the entity table features.
const COLUMN_HELPER = createColumnHelper<
  EntityTableFeatures,
  StatementResponseDTO
>()

/**
 * @summary
 * Coordinates the statement datatable instance.
 *
 * @remarks
 * Creates the shared table instance used by the toolbar, the
 * datatable and the pagination, wiring the row actions, the
 * generate dialog and the bulk delete flow into the column
 * definitions. Rows start sorted by period descending so the
 * newest report appears first.
 *
 * @param statements - The rows rendered by the datatable.
 * @param summaries - Derived per-row data (portfolio display
 * plus the generator) keyed by statement id.
 *
 * @returns The table instance plus the action flows.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useStatementDatatable(
  statements: StatementResponseDTO[],
  summaries: Record<string, StatementRowSummary> | null = null
) {
  const rowActions = useStatementRowActions()
  const bulkDelete = useStatementBulkDelete()
  const generateDialog = useStatementGenerateDialog()

  const summaryFor = useCallback(
    (statementId: string) => summaries?.[statementId] ?? null,
    [summaries]
  )

  const COLUMNS = useMemo(
    () =>
      CreateStatementTableColumns(COLUMN_HELPER, {
        onView: rowActions.handleView,
        onDelete: rowActions.handleDelete,
        summaryFor,
      }),
    [rowActions.handleDelete, rowActions.handleView, summaryFor]
  )

  const TABLE = useTable({
    features: ENTITY_TABLE_FEATURES,
    columns: COLUMNS,
    data: statements,
    getRowId: (row) => row.id,
    initialState: {
      sorting: [{ id: "period", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  })

  return {
    table: TABLE,
    rowActions,
    bulkDelete,
    generateDialog,
  }
}

export { useStatementDatatable }
