"use client"

import { useMemo } from "react"
import {
  createColumnHelper,
  useTable,
} from "@tanstack/react-table"

import { ENTITY_TABLE_FEATURES } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { ENTITY_TABLE_DEFAULT_PAGE_SIZE } from "@/presentation/parts/datatable/settings/entity-table-labels.settings"
import { useEntityAddDialog } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import { useEntityEditDialog } from "@/presentation/parts/hooks/use-entity-edit-dialog.hook"
import type { BenchmarkHistoryRow } from "@/presentation/types/benchmark-history-row.types"

import { CreateBenchmarkHistoryTableColumns } from "../datatable/table-columns"
import { useBenchmarkHistoryRowActions } from "./use-benchmark-history-row-actions.hook"

// Column helper bound to the entity table features.
const COLUMN_HELPER = createColumnHelper<
  EntityTableFeatures,
  BenchmarkHistoryRow
>()

/**
 * @summary
 * Coordinates the benchmark history datatable instance.
 *
 * @remarks
 * Creates the shared table instance used by the toolbar, the
 * datatable and the pagination. Rows start sorted by date
 * descending so the newest rate appears first.
 *
 * The row actions, the add dialog and the edit dialog are wired
 * into the column definitions, so the table is the single
 * source of what each row can do.
 *
 * @param history - The rows rendered by the datatable.
 *
 * @returns The shared table instance and the dialog flows.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function useBenchmarkHistoryDatatable(
  history: BenchmarkHistoryRow[]
) {
  const addDialog = useEntityAddDialog()
  const editDialog = useEntityEditDialog<BenchmarkHistoryRow>()
  const rowActions = useBenchmarkHistoryRowActions()

  const COLUMNS = useMemo(
    () =>
      CreateBenchmarkHistoryTableColumns(COLUMN_HELPER, {
        onEdit: editDialog.handleOpen,
        onDelete: rowActions.handleDelete,
      }),
    [editDialog.handleOpen, rowActions.handleDelete]
  )

  const TABLE = useTable({
    features: ENTITY_TABLE_FEATURES,
    columns: COLUMNS,
    data: history,
    getRowId: (row) => row.id,
    initialState: {
      sorting: [{ id: "date", desc: true }],
      pagination: {
        pageIndex: 0,
        pageSize: ENTITY_TABLE_DEFAULT_PAGE_SIZE,
      },
    },
  })

  return {
    table: TABLE,
    rowActions,
    addDialog,
    editDialog,
  }
}

export { useBenchmarkHistoryDatatable }
