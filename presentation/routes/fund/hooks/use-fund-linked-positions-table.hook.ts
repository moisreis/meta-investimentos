"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
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
import type { FundLinkedPositionRow } from "../types/fund-overview.types"

import { CreateFundLinkedPositionsColumns } from "../components/fund-linked-positions-table-columns"

// Column helper bound to the entity table features.
const COLUMN_HELPER: ColumnHelper<
  EntityTableFeatures,
  FundLinkedPositionRow
> = createColumnHelper<
  EntityTableFeatures,
  FundLinkedPositionRow
>()

interface UseFundLinkedPositionsTableOutput {
  // Whether the fund holds at least one position of the
  // session user. The section gates the datatable on it,
  // so the friendly empty state replaces the "no rows"
  // row of the table.
  hasRows: boolean
  // The shared table instance of the section.
  table: EntityTable<FundLinkedPositionRow>
}

/**
 * @summary
 * Coordinates the linked positions datatable of the fund
 * detail screen.
 *
 * @remarks
 * Creates the shared table instance used by the datatable
 * and the pagination over the rows resolved by the loader.
 * The columns are read-only and built once, the view
 * action opens the position detail screen the row came
 * from, and the pagination starts at ten rows per page.
 *
 * @param rows - The positions linked to the fund.
 *
 * @returns The table instance and the row gate.
 *
 * @example
 * const { hasRows, table } = useFundLinkedPositionsTable(ROWS);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function useFundLinkedPositionsTable(
  rows: readonly FundLinkedPositionRow[]
): UseFundLinkedPositionsTableOutput {
  const ROUTER = useRouter()

  const COLUMNS = useMemo(
    () =>
      CreateFundLinkedPositionsColumns(COLUMN_HELPER, {
        onView: (position) =>
          ROUTER.push(`/position/${position.id}`),
      }),
    [ROUTER]
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

export { useFundLinkedPositionsTable }
