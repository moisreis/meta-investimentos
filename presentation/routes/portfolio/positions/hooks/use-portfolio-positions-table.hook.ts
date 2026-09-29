"use client"

import { useMemo } from "react"
import {
  ColumnHelper,
  createColumnHelper,
  useTable,
} from "@tanstack/react-table"

import { ENTITY_TABLE_FEATURES } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type {
  EntityTable,
  EntityTableFeatures,
} from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { PortfolioHolding } from "@/presentation/types/portfolio-holding.types"

import { CreatePortfolioPositionsColumns } from "../datatable/table-columns"

// Column helper bound to the entity table features.
const COLUMN_HELPER: ColumnHelper<
  EntityTableFeatures,
  PortfolioHolding
> = createColumnHelper<EntityTableFeatures, PortfolioHolding>()

interface UsePortfolioPositionsTableOutput {
  // Whether the portfolio holds at least one position. The
  // section gates the datatable on it, so the friendly empty
  // state replaces the "no rows" row of the table.
  hasRows: boolean
  // The shared table instance of the section.
  table: EntityTable<PortfolioHolding>
}

/**
 * @summary
 * Coordinates the positions datatable of the portfolio
 * detail screen.
 *
 * @remarks
 * Creates the shared table instance used by the datatable
 * and the pagination over the holdings of the portfolio. The
 * columns are read-only and built once, and the pagination
 * starts at ten rows per page. The rows are never mutated,
 * so the same table instance serves the whole life of the
 * screen.
 *
 * @param holdings - The holdings of the portfolio.
 *
 * @returns The table instance and the row gate.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function usePortfolioPositionsTable(
  holdings: readonly PortfolioHolding[]
): UsePortfolioPositionsTableOutput {
  const COLUMNS = useMemo(
    () => CreatePortfolioPositionsColumns(COLUMN_HELPER),
    []
  )

  const TABLE = useTable({
    features: ENTITY_TABLE_FEATURES,
    columns: COLUMNS,
    data: holdings,
    getRowId: (row) => row.positionId,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  })

  const HAS_ROWS =
    TABLE.getPrePaginatedRowModel().rows.length > 0

  return { hasRows: HAS_ROWS, table: TABLE }
}

export { usePortfolioPositionsTable }