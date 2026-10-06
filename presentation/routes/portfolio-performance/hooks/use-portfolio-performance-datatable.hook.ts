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
import type { PortfolioPerformanceRow } from "@/presentation/types/portfolio-performance-row.types"

import { CreatePortfolioPerformanceTableColumns } from "../datatable/table-columns"
import { EMPTY_PORTFOLIO_PERFORMANCE_LOOKUPS } from "../helpers/build-portfolio-performance-lookups.helper"
import type { PortfolioPerformanceLookups } from "../types/portfolio-performance-list.types"
import { usePortfolioPerformanceRowActions } from "./use-portfolio-performance-row-actions.hook"

// Column helper bound to the entity table features.
const COLUMN_HELPER: ColumnHelper<
  EntityTableFeatures,
  PortfolioPerformanceRow
> = createColumnHelper<
  EntityTableFeatures,
  PortfolioPerformanceRow
>()

/**
 * @summary
 * Coordinates the portfolio performance datatable
 * instance.
 *
 * @remarks
 * Creates the shared table instance used by the
 * datatable and the pagination, wiring the portfolio
 * name resolution into the column definitions. The
 * pagination starts at twenty rows per page; it is seeded
 * through `initialState` so the slice stays mutable.
 *
 * @param performances - The rows rendered by the table.
 * @param lookups - The performance lookups.
 *
 * @returns The shared table instance and row actions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function usePortfolioPerformanceDatatable(
  performances: PortfolioPerformanceRow[],
  lookups: PortfolioPerformanceLookups = EMPTY_PORTFOLIO_PERFORMANCE_LOOKUPS
) {
  const rowActions = usePortfolioPerformanceRowActions()

  const rowFor = useCallback(
    (performanceId: string) =>
      lookups.rows[performanceId] ?? null,
    [lookups]
  )

  const COLUMNS = useMemo(
    () =>
      CreatePortfolioPerformanceTableColumns(COLUMN_HELPER, {
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
      pagination: {
        pageIndex: 0,
        pageSize: ENTITY_TABLE_DEFAULT_PAGE_SIZE,
      },
    },
  })

  return { table: TABLE, rowActions }
}

export { usePortfolioPerformanceDatatable }
