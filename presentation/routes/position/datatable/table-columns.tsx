"use client"

import type {
  ColumnDef,
  ColumnHelper,
} from "@tanstack/react-table"

import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatDate } from "@/presentation/presenters/date.presenter"
import type { PositionResponseDTO } from "@/services/position/dto/position-response.dto"

import { POSITION_DATATABLE } from "../settings/labels.settings"
import type { PositionRowLookup } from "../types/position-list.types"

export interface PositionTableColumnOptions {
  rowFor: (positionId: string) => PositionRowLookup | null
}

/**
 * @summary
 * Builds the column definitions of the position
 * datatable.
 *
 * @remarks
 * Renders a read-only list: the portfolio and fund
 * columns resolve their names through `rowFor`, the
 * opening date column uses the date presenter and the
 * initial balance column renders the nullable decimal
 * string through the currency presenter aligned to the
 * end. No selection or actions columns, since positions
 * are created inside the portfolio screens.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The row lookup resolver.
 *
 * @returns The position column definitions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function CreatePositionTableColumns(
  columnHelper: ColumnHelper<
    EntityTableFeatures,
    PositionResponseDTO
  >,
  options: PositionTableColumnOptions
): ColumnDef<EntityTableFeatures, PositionResponseDTO, any>[] {
  return [
    columnHelper.accessor((row) => options.rowFor(row.id), {
      id: "portfolio",
      header: POSITION_DATATABLE.COLUMN_PORTFOLIO,
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

    columnHelper.accessor((row) => options.rowFor(row.id), {
      id: "fund",
      header: POSITION_DATATABLE.COLUMN_FUND,
      size: 260,
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
              {LOOKUP.fundCnpj}
            </p>
          </div>
        )
      },
    }),

    columnHelper.accessor("createdAt", {
      header: POSITION_DATATABLE.COLUMN_OPENED_AT,
      size: 130,
      meta: { fluid: true },
      cell: (info) => FormatDate(info.getValue()),
    }),

    columnHelper.accessor("initialBalance", {
      header: POSITION_DATATABLE.COLUMN_INITIAL_BALANCE,
      size: 150,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatCurrency(info.getValue()),
    }),
  ]
}
