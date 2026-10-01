"use client"

import { useMemo } from "react"
import {
  ColumnHelper,
  createColumnHelper,
  useTable,
} from "@tanstack/react-table"

import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { ENTITY_TABLE_FEATURES } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { useEntityAddDialog } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import { useEntityEditDialog } from "@/presentation/parts/hooks/use-entity-edit-dialog.hook"
import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"

import { CreateBenchmarkTableColumns } from "../datatable/table-columns"

// Column helper bound to the entity table features.
const COLUMN_HELPER: ColumnHelper<
  EntityTableFeatures,
  BenchmarkRow
> = createColumnHelper<EntityTableFeatures, BenchmarkRow>()

/**
 * @summary
 * Coordinates the benchmark datatable instance.
 *
 * @remarks
 * Creates the shared table instance used by the toolbar,
 * the datatable and the pagination, wiring the row edit
 * action and the add/edit dialogs into the column
 * definitions.
 * The pagination starts at ten rows per page; it is seeded
 * through `initialState` so the slice stays mutable — the
 * `state` option would treat it as controlled and ignore
 * every page and page-size change.
 *
 * @param benchmarks - The rows rendered by the datatable.
 *
 * @returns The shared table and the dialog flows.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function useBenchmarkDatatable(benchmarks: BenchmarkRow[]) {
  const addDialog = useEntityAddDialog()
  const editDialog = useEntityEditDialog<BenchmarkRow>()

  const COLUMNS = useMemo(
    () =>
      CreateBenchmarkTableColumns(COLUMN_HELPER, {
        onEdit: editDialog.handleOpen,
      }),
    [editDialog.handleOpen]
  )

  const TABLE = useTable({
    features: ENTITY_TABLE_FEATURES,
    columns: COLUMNS,
    data: benchmarks,
    getRowId: (row) => row.id,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  })

  return {
    table: TABLE,
    addDialog,
    editDialog,
  }
}

export { useBenchmarkDatatable }
