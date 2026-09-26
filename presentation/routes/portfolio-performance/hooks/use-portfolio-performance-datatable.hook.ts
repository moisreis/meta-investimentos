"use client"

import { useCallback, useMemo } from "react"
import {
  createColumnHelper,
  useTable,
} from "@tanstack/react-table"

import { ENTITY_TABLE_FEATURES } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"

import { CreatePortfolioPerformanceTableColumns } from "../datatable/table-columns"
import { EMPTY_PORTFOLIO_PERFORMANCE_LOOKUPS } from "../helpers/build-portfolio-performance-lookups.helper"
import type { PortfolioPerformanceLookups } from "../types/portfolio-performance-list.types"

// Column helper bound to the entity table features.
const COLUMN_HELPER = createColumnHelper<
  EntityTableFeatures,
  PortfolioPerformanceResponseDTO
>()

/**
 * @summary
 * Coordinates the performance datatable instance.
 *
 * @remarks
 * Creates the shared table instance used by the
 * datatable and the pagination, wiring the portfolio
 * name resolution into the column definitions. The
 * pagination starts at ten rows per page; it is seeded
 * through `initialState` so the slice stays mutable.
 *
 * @param performances - The rows rendered by the table.
 * @param lookups - The performance lookups.
 *
 * @returns The shared table instance.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function usePortfolioPerformanceDatatable(
  performances: PortfolioPerformanceResponseDTO[],
  lookups: PortfolioPerformanceLookups = EMPTY_PORTFOLIO_PERFORMANCE_LOOKUPS
) {
  const rowFor = useCallback(
    (performanceId: string) =>
      lookups.rows[performanceId] ?? null,
    [lookups]
  )

  const COLUMNS = useMemo(
    () =>
      CreatePortfolioPerformanceTableColumns(COLUMN_HELPER, {
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

export { usePortfolioPerformanceDatatable }
