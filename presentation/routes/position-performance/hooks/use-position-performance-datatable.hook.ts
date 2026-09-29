"use client"

import { useCallback, useMemo } from "react"
import {
  ColumnHelper,
  createColumnHelper,
  useTable,
} from "@tanstack/react-table"

import { ENTITY_TABLE_FEATURES } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { PositionPerformanceRow } from "@/presentation/types/position-performance-row.types"

import { CreatePositionPerformanceTableColumns } from "../datatable/table-columns"
import { EMPTY_POSITION_PERFORMANCE_LOOKUPS } from "../helpers/build-position-performance-lookups.helper"
import type { PositionPerformanceLookups } from "../types/position-performance-list.types"
import { usePositionPerformanceRowActions } from "./use-position-performance-row-actions.hook"

// Column helper bound to the entity table features.
const COLUMN_HELPER: ColumnHelper<
  EntityTableFeatures,
  PositionPerformanceRow
> = createColumnHelper<
  EntityTableFeatures,
  PositionPerformanceRow
>()

/**
 * @summary
 * Coordinates the position performance datatable
 * instance.
 *
 * @remarks
 * Creates the shared table instance used by the
 * datatable and the pagination, wiring the position
 * resolution into the column definitions. The pagination
 * starts at ten rows per page; it is seeded through
 * `initialState` so the slice stays mutable.
 *
 * @param performances - The rows rendered by the table.
 * @param lookups - The position performance lookups.
 *
 * @returns The shared table instance and row actions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function usePositionPerformanceDatatable(
  performances: PositionPerformanceRow[],
  lookups: PositionPerformanceLookups = EMPTY_POSITION_PERFORMANCE_LOOKUPS
) {
  const rowActions = usePositionPerformanceRowActions()

  const rowFor = useCallback(
    (performanceId: string) => lookups.rows[performanceId] ?? null,
    [lookups]
  )

  const COLUMNS = useMemo(
    () =>
      CreatePositionPerformanceTableColumns(COLUMN_HELPER, {
        rowFor,
        onDelete: rowActions.handleDelete,
      }),
    [rowFor, rowActions.handleDelete]
  )

  const TABLE = useTable({
    features: ENTITY_TABLE_FEATURES,
    columns: COLUMNS,
    data: performances,
    getRowId: (row) => row.id,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  })

  return { table: TABLE, rowActions }
}

export { usePositionPerformanceDatatable }