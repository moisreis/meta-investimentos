"use client"

import { useCallback, useMemo } from "react"
import {
  createColumnHelper,
  useTable,
} from "@tanstack/react-table"

import { ENTITY_TABLE_FEATURES } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { PositionPerformanceResponseDTO } from "@/services/position-performance/dto/position-performance-response.dto"

import { CreatePositionPerformanceTableColumns } from "../datatable/table-columns"
import { EMPTY_POSITION_PERFORMANCE_LOOKUPS } from "../helpers/build-position-performance-lookups.helper"
import type { PositionPerformanceLookups } from "../types/position-performance-list.types"

// Column helper bound to the entity table features.
const COLUMN_HELPER = createColumnHelper<
  EntityTableFeatures,
  PositionPerformanceResponseDTO
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
 * @returns The shared table instance.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function usePositionPerformanceDatatable(
  performances: PositionPerformanceResponseDTO[],
  lookups: PositionPerformanceLookups = EMPTY_POSITION_PERFORMANCE_LOOKUPS
) {
  const rowFor = useCallback(
    (performanceId: string) =>
      lookups.rows[performanceId] ?? null,
    [lookups]
  )

  const COLUMNS = useMemo(
    () =>
      CreatePositionPerformanceTableColumns(COLUMN_HELPER, {
        rowFor,
      }),
    [rowFor]
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

  return { table: TABLE }
}

export { usePositionPerformanceDatatable }
