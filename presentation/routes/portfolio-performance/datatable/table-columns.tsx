"use client"

import type {
  ColumnDef,
  ColumnHelper,
} from "@tanstack/react-table"

import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatDate } from "@/presentation/presenters/date.presenter"
import { FormatPercentage } from "@/presentation/presenters/percentage.presenter"
import { FormatQuotaQuantity } from "@/presentation/presenters/quota-quantity.presenter"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"

import { PORTFOLIO_PERFORMANCE_DATATABLE } from "../settings/labels.settings"
import type { PortfolioPerformanceRowLookup } from "../types/portfolio-performance-list.types"

export interface PortfolioPerformanceTableColumnOptions {
  rowFor: (
    performanceId: string
  ) => PortfolioPerformanceRowLookup | null
}

/**
 * @summary
 * Builds the column definitions of the performance
 * datatable.
 *
 * @remarks
 * Renders a read-only list: the portfolio column
 * resolves its name through `rowFor`, the date column
 * uses the date presenter and the patrimony, quotas and
 * daily return columns render the decimal strings
 * aligned to the end. No selection or actions columns,
 * since performances are produced by the calculation
 * flow instead of manual edits.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The row lookup resolver.
 *
 * @returns The performance column definitions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function CreatePortfolioPerformanceTableColumns(
  columnHelper: ColumnHelper<
    EntityTableFeatures,
    PortfolioPerformanceResponseDTO
  >,
  options: PortfolioPerformanceTableColumnOptions
): ColumnDef<
  EntityTableFeatures,
  PortfolioPerformanceResponseDTO,
  any
>[] {
  return [
    columnHelper.accessor((row) => options.rowFor(row.id), {
      id: "portfolio",
      header: PORTFOLIO_PERFORMANCE_DATATABLE.COLUMN_PORTFOLIO,
      size: 220,
      meta: { fluid: true },
      cell: (info) => {
        const LOOKUP = info.getValue()

        if (!LOOKUP) {
          return <span className="text-muted-foreground">—</span>
        }

        return (
          <div className="min-w-0">
            <p className="truncate font-medium">
              {LOOKUP.portfolioName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {LOOKUP.portfolioAcronym}
            </p>
          </div>
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
  ]
}
