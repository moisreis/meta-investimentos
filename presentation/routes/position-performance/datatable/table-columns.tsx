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
import type { PositionPerformanceResponseDTO } from "@/services/position-performance/dto/position-performance-response.dto"

import { POSITION_PERFORMANCE_DATATABLE } from "../settings/labels.settings"
import type { PositionPerformanceRowLookup } from "../types/position-performance-list.types"

export interface PositionPerformanceTableColumnOptions {
  rowFor: (
    performanceId: string
  ) => PositionPerformanceRowLookup | null
}

/**
 * @summary
 * Builds the column definitions of the position
 * performance datatable.
 *
 * @remarks
 * Renders a read-only list: the position column resolves
 * its fund and portfolio display data through `rowFor`,
 * the date column uses the date presenter and the
 * patrimony, quotas and daily return columns render the
 * decimal strings aligned to the end. No selection or
 * actions columns, since performances are produced by
 * the calculation flow instead of manual edits.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The row lookup resolver.
 *
 * @returns The position performance column definitions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function CreatePositionPerformanceTableColumns(
  columnHelper: ColumnHelper<
    EntityTableFeatures,
    PositionPerformanceResponseDTO
  >,
  options: PositionPerformanceTableColumnOptions
): ColumnDef<
  EntityTableFeatures,
  PositionPerformanceResponseDTO,
  any
>[] {
  return [
    columnHelper.accessor((row) => options.rowFor(row.id), {
      id: "position",
      header: POSITION_PERFORMANCE_DATATABLE.COLUMN_POSITION,
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
              {LOOKUP.fundName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {LOOKUP.portfolioAcronym || LOOKUP.portfolioName}
            </p>
          </div>
        )
      },
    }),

    columnHelper.accessor("date", {
      header: POSITION_PERFORMANCE_DATATABLE.COLUMN_DATE,
      size: 130,
      meta: { fluid: true },
      cell: (info) => FormatDate(info.getValue()),
    }),

    columnHelper.accessor("patrimony", {
      header: POSITION_PERFORMANCE_DATATABLE.COLUMN_PATRIMONY,
      size: 160,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatCurrency(info.getValue()),
    }),

    columnHelper.accessor("quotasHeld", {
      header: POSITION_PERFORMANCE_DATATABLE.COLUMN_QUOTAS,
      size: 130,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatQuotaQuantity(info.getValue()),
    }),

    columnHelper.accessor("returnDaily", {
      header: POSITION_PERFORMANCE_DATATABLE.COLUMN_RETURN_DAILY,
      size: 130,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatPercentage(info.getValue()),
    }),
  ]
}
