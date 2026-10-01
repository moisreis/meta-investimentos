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
import type { PortfolioActivityRow } from "@/presentation/types/portfolio-activity-row.types"

import { CreatePortfolioActivityColumns } from "../components/portfolio-activity-table-columns"

// Column helper bound to the entity table features.
const COLUMN_HELPER: ColumnHelper<
  EntityTableFeatures,
  PortfolioActivityRow
> = createColumnHelper<
  EntityTableFeatures,
  PortfolioActivityRow
>()

interface UsePortfolioActivityTableOutput {
  // Whether the window holds at least one movement. The
  // section gates the datatable on it, so the friendly
  // empty state replaces the "no rows" row of the table.
  hasRows: boolean
  // The shared table instance of the section.
  table: EntityTable<PortfolioActivityRow>
}

/**
 * @summary
 * Coordinates the recent activity datatable of the portfolio
 * detail screen.
 *
 * @remarks
 * Creates the shared table instance used by the datatable
 * and the pagination over the window-filtered rows. The
 * columns are read-only and built once, and the pagination
 * starts at ten rows per page. The rows are never mutated,
 * so the same table instance serves every window the user
 * picks by swapping the data the hook is called with.
 *
 * @param rows - The activity rows inside the selected window.
 *
 * @returns The table instance and the row gate.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function usePortfolioActivityTable(
  rows: readonly PortfolioActivityRow[]
): UsePortfolioActivityTableOutput {
  const COLUMNS = useMemo(
    () => CreatePortfolioActivityColumns(COLUMN_HELPER),
    []
  )

  const TABLE = useTable({
    features: ENTITY_TABLE_FEATURES,
    columns: COLUMNS,
    data: rows,
    getRowId: (row) => row.id,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  })

  const HAS_ROWS =
    TABLE.getPrePaginatedRowModel().rows.length > 0

  return { hasRows: HAS_ROWS, table: TABLE }
}

export { usePortfolioActivityTable }
