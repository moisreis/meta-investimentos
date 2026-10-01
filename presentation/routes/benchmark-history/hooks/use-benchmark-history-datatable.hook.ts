"use client"

import { useMemo } from "react"
import {
  createColumnHelper,
  useTable,
} from "@tanstack/react-table"

import { ENTITY_TABLE_FEATURES } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { BenchmarkHistoryRow } from "@/presentation/types/benchmark-history-row.types"

import { CreateBenchmarkHistoryTableColumns } from "../datatable/table-columns"

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
 * @param history - The rows rendered by the datatable.
 *
 * @returns The shared table instance.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function useBenchmarkHistoryDatatable(
  history: BenchmarkHistoryRow[]
) {
  const COLUMNS = useMemo(
    () => CreateBenchmarkHistoryTableColumns(COLUMN_HELPER),
    []
  )

  const TABLE = useTable({
    features: ENTITY_TABLE_FEATURES,
    columns: COLUMNS,
    data: history,
    getRowId: (row) => row.id,
    initialState: {
      sorting: [{ id: "date", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  })

  return {
    table: TABLE,
  }
}

export { useBenchmarkHistoryDatatable }
