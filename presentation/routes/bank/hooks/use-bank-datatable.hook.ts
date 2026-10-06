"use client"

import { useCallback, useMemo } from "react"
import {
  ColumnHelper,
  createColumnHelper,
  useTable,
} from "@tanstack/react-table"

import { ENTITY_TABLE_FEATURES } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { ENTITY_TABLE_DEFAULT_PAGE_SIZE } from "@/presentation/parts/datatable/settings/entity-table-labels.settings"
import { useEntityAddDialog } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import { useEntityEditDialog } from "@/presentation/parts/hooks/use-entity-edit-dialog.hook"
import type { BankRow } from "@/presentation/types/bank-row.types"

import { CreateBankTableColumns } from "../datatable/table-columns"
import type { BankRowSummary } from "../types/bank-list.types"
import { useBankBulkDelete } from "./use-bank-bulk-delete.hook"
import { useBankRowActions } from "./use-bank-row-actions.hook"

// Column helper bound to the entity table features.
const COLUMN_HELPER: ColumnHelper<EntityTableFeatures, BankRow> =
  createColumnHelper<EntityTableFeatures, BankRow>()

/**
 * @summary
 * Coordinates the bank datatable instance.
 *
 * @remarks
 * Creates the shared table instance used by the toolbar,
 * the datatable and the pagination, wiring the row actions,
 * the add/edit dialogs and the bulk delete flow into the
 * column definitions.
 * The pagination starts at twenty rows per page; it is seeded
 * through `initialState` so the slice stays mutable — the
 * `state` option would treat it as controlled and ignore
 * every page and page-size change.
 *
 * @param banks - The rows rendered by the datatable.
 * @param summaries - The derived per-row account counts.
 *
 * @returns The shared table and the dialog flows.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useBankDatatable(
  banks: BankRow[],
  summaries: Record<string, BankRowSummary> | null = null
) {
  const addDialog = useEntityAddDialog()
  const editDialog = useEntityEditDialog<BankRow>()
  const rowActions = useBankRowActions()
  const bulkDelete = useBankBulkDelete()

  const summaryFor = useCallback(
    (bankId: string) => summaries?.[bankId] ?? null,
    [summaries]
  )

  const COLUMNS = useMemo(
    () =>
      CreateBankTableColumns(COLUMN_HELPER, {
        onEdit: editDialog.handleOpen,
        onDelete: rowActions.handleDelete,
        summaryFor,
      }),
    [editDialog.handleOpen, rowActions.handleDelete, summaryFor]
  )

  const TABLE = useTable({
    features: ENTITY_TABLE_FEATURES,
    columns: COLUMNS,
    data: banks,
    getRowId: (row) => row.id,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: ENTITY_TABLE_DEFAULT_PAGE_SIZE,
      },
    },
  })

  return {
    table: TABLE,
    rowActions,
    bulkDelete,
    addDialog,
    editDialog,
  }
}

export { useBankDatatable }
