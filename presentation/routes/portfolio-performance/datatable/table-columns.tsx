"use client"

import type { ColumnHelper } from "@tanstack/react-table"

import type { EntityColumnDef } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { CreateEntitySelectColumn } from "@/presentation/parts/datatable/pinned-columns/entity-table-selectable-column"
import { EntityLookupCell } from "@/presentation/parts/datatable/columns/entity-lookup-cell"
import { EntityTableRowMenuDropdown } from "@/presentation/parts/datatable/row-menus/entity-table-row-menu-dropdown"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatDate } from "@/presentation/presenters/date.presenter"
import { FormatPercentage } from "@/presentation/presenters/percentage.presenter"
import { FormatQuotaQuantity } from "@/presentation/presenters/quota-quantity.presenter"
import type { PortfolioPerformanceRow } from "@/presentation/types/portfolio-performance-row.types"

import { PORTFOLIO_PERFORMANCE_DATATABLE } from "../settings/labels.settings"
import type { PortfolioPerformanceRowLookup } from "../types/portfolio-performance-list.types"

export interface PortfolioPerformanceTableColumnOptions {
  rowFor: (
    performanceId: string
  ) => PortfolioPerformanceRowLookup | null
  onDelete: (performance: PortfolioPerformanceRow) => void
}

/**
 * @summary
 * Builds the column definitions of the portfolio
 * performance datatable.
 *
 * @remarks
 * Renders a selectable list with row actions: the
 * selection column is pinned to the start, the
 * portfolio column resolves its name through `rowFor`
 * and renders it through the shared lookup cell, with
 * the portfolio acronym below the name, the date
 * column uses the date presenter and the patrimony,
 * quotas and daily return columns render the decimal
 * strings aligned to the end. The actions column is
 * pinned to the end and offers a delete action for each
 * row.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The row lookup resolver and delete callback.
 *
 * @returns The portfolio performance column definitions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export function CreatePortfolioPerformanceTableColumns(
  columnHelper: ColumnHelper<
    EntityTableFeatures,
    PortfolioPerformanceRow
  >,
  options: PortfolioPerformanceTableColumnOptions
): EntityColumnDef<PortfolioPerformanceRow>[] {
  return [
    CreateEntitySelectColumn(columnHelper),

    columnHelper.accessor((row) => options.rowFor(row.id), {
      id: "portfolio",
      header: PORTFOLIO_PERFORMANCE_DATATABLE.COLUMN_PORTFOLIO,
      size: 220,
      meta: { fluid: true },
      cell: (info) => {
        const LOOKUP = info.getValue()

        return (
          <EntityLookupCell
            title={LOOKUP?.portfolioName}
            subtitle={LOOKUP?.portfolioAcronym}
          />
        )
      },
    }),

    columnHelper.accessor("date", {
      header: PORTFOLIO_PERFORMANCE_DATATABLE.COLUMN_DATE,
      size: 130,
      meta: { fluid: true },
      cell: (info) => FormatDate(info.getValue()),
    }),

    columnHelper.accessor("patrimony", {
      header: PORTFOLIO_PERFORMANCE_DATATABLE.COLUMN_PATRIMONY,
      size: 160,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatCurrency(info.getValue()),
    }),

    columnHelper.accessor("quotasHeld", {
      header: PORTFOLIO_PERFORMANCE_DATATABLE.COLUMN_QUOTAS,
      size: 130,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatQuotaQuantity(info.getValue()),
    }),

    columnHelper.accessor("returnDaily", {
      header:
        PORTFOLIO_PERFORMANCE_DATATABLE.COLUMN_RETURN_DAILY,
      size: 130,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatPercentage(info.getValue()),
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
          label={
            PORTFOLIO_PERFORMANCE_DATATABLE.ROW_ACTIONS_LABEL
          }
          actions={[
            {
              key: "delete",
              label:
                PORTFOLIO_PERFORMANCE_DATATABLE.ROW_DELETE_LABEL,
              variant: "destructive",
              onSelect: () => options.onDelete(row.original),
            },
          ]}
        />
      ),
    }),
  ]
}
