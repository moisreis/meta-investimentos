"use client"

import type {
  ColumnDef,
  ColumnHelper,
} from "@tanstack/react-table"

import { EntityLookupCell } from "@/presentation/parts/datatable/columns/entity-lookup-cell"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatPercentage } from "@/presentation/presenters/percentage.presenter"
import type { PortfolioHolding } from "@/presentation/types/portfolio-holding.types"

import { PORTFOLIO_POSITIONS } from "../../settings/labels.settings"

/**
 * @summary
 * Builds the read-only column definitions of the positions
 * datatable.
 *
 * @remarks
 * Renders one row per holding of the portfolio: the fund
 * column resolves the name and the custodian bank through
 * the shared lookup cell, the bank column names the
 * institution with its code, and the weight and invested
 * value columns render the decimal strings aligned to the
 * end. The fund and bank columns are not sortable, because
 * alphabetical order has no meaning for them.
 *
 * @param columnHelper - The entity column helper.
 *
 * @returns The positions column definitions. The broad third
 *   generic of `ColumnDef` mirrors the application datatable:
 *   TanStack types the columns option of a table as a list of
 *   unknown-valued defs, and only the framework `any` bridges
 *   the differing accessor value types of a single list.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function CreatePortfolioPositionsColumns(
  columnHelper: ColumnHelper<
    EntityTableFeatures,
    PortfolioHolding
  >
): ColumnDef<EntityTableFeatures, PortfolioHolding, any>[] {
  return [
    columnHelper.accessor("fundName", {
      id: "fund",
      header: PORTFOLIO_POSITIONS.COLUMN_FUND,
      size: 280,
      meta: { fluid: true },
      enableSorting: false,
      cell: (info) => (
        <EntityLookupCell
          title={info.getValue()}
          subtitle={info.row.original.bankName}
        />
      ),
    }),

    columnHelper.accessor("bankName", {
      id: "bank",
      header: PORTFOLIO_POSITIONS.COLUMN_BANK,
      size: 220,
      meta: { fluid: true },
      enableSorting: false,
      cell: (info) => (
        <EntityLookupCell
          title={`${info.getValue()} (${info.row.original.bankCode})`}
        />
      ),
    }),

    columnHelper.accessor("weight", {
      id: "weight",
      header: PORTFOLIO_POSITIONS.COLUMN_WEIGHT,
      size: 120,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatPercentage(info.getValue()),
    }),

    columnHelper.accessor("investedValue", {
      id: "invested",
      header: PORTFOLIO_POSITIONS.COLUMN_INVESTED,
      size: 160,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatCurrency(info.getValue()),
    }),
  ]
}