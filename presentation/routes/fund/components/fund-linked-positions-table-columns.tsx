"use client"

import type { ColumnHelper } from "@tanstack/react-table"

import type { EntityColumnDef } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { EntityLookupCell } from "@/presentation/parts/datatable/columns/entity-lookup-cell"
import { EntityTableRowMenuDropdown } from "@/presentation/parts/datatable/row-menus/entity-table-row-menu-dropdown"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatPercentage } from "@/presentation/presenters/percentage.presenter"

import {
  FUND_DATATABLE,
  FUND_LINKED_POSITIONS,
} from "../settings/labels.settings"
import type { FundLinkedPositionRow } from "../types/fund-overview.types"

/**
 * Wiring of the linked positions column definitions.
 */
export interface FundLinkedPositionColumnOptions {
  // Opens the position detail screen of the row.
  onView: (position: FundLinkedPositionRow) => void
}

/**
 * @summary
 * Builds the read-only column definitions of the linked
 * positions datatable.
 *
 * @remarks
 * Renders one row per position of the session user that
 * holds the fund: the portfolio column resolves the name
 * through the shared lookup cell and the money columns
 * render the decimal strings aligned to the end. The
 * actions column offers the view menu item, so a row can
 * open the position detail screen it came from.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The column wiring.
 * @param options.onView - Opens the position detail.
 *
 * @returns The linked positions column definitions. The
 *   broad third generic of `ColumnDef` mirrors the
 *   position activity datatable: TanStack types the
 *   columns option of a table as a list of unknown-valued
 *   defs, and only the framework `any` bridges the
 *   differing accessor value types of a single list.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export function CreateFundLinkedPositionsColumns(
  columnHelper: ColumnHelper<
    EntityTableFeatures,
    FundLinkedPositionRow
  >,
  options: FundLinkedPositionColumnOptions
): EntityColumnDef<FundLinkedPositionRow>[] {
  return [
    columnHelper.accessor("portfolioName", {
      id: "portfolio",
      header: FUND_LINKED_POSITIONS.COLUMN_PORTFOLIO,
      size: 240,
      meta: { fluid: true },
      cell: (info) => (
        <EntityLookupCell title={info.getValue()} />
      ),
    }),

    columnHelper.accessor("allocation", {
      id: "allocation",
      header: FUND_LINKED_POSITIONS.COLUMN_ALLOCATION,
      size: 110,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatPercentage(info.getValue()),
    }),

    columnHelper.accessor("initialBalance", {
      id: "initialBalance",
      header: FUND_LINKED_POSITIONS.COLUMN_INITIAL_BALANCE,
      size: 140,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatCurrency(info.getValue()),
    }),

    columnHelper.display({
      id: "actions",
      enableSorting: false,
      enableHiding: false,
      size: 50,
      minSize: 50,
      maxSize: 50,
      meta: { pinned: "end", align: "center" },
      cell: ({ row }) => (
        <EntityTableRowMenuDropdown
          label={FUND_DATATABLE.ROW_ACTIONS_LABEL}
          actions={[
            {
              key: "view",
              label: FUND_DATATABLE.ROW_VIEW_LABEL,
              onSelect: () => options.onView(row.original),
            },
          ]}
        />
      ),
    }),
  ]
}
