"use client"

import type {
  ColumnDef,
  ColumnHelper,
} from "@tanstack/react-table"

import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatDate } from "@/presentation/presenters/date.presenter"
import { FormatQuotaQuantity } from "@/presentation/presenters/quota-quantity.presenter"
import type { ApplicationResponseDTO } from "@/services/application/dto/application-response.dto"

import { APPLICATION_DATATABLE } from "../settings/labels.settings"
import type { ApplicationRowLookup } from "../types/application-list.types"

export interface ApplicationTableColumnOptions {
  rowFor: (applicationId: string) => ApplicationRowLookup | null
}

/**
 * @summary
 * Builds the column definitions of the application
 * datatable.
 *
 * @remarks
 * Renders a read-only list: the portfolio and fund
 * columns resolve their names through `rowFor`, the date
 * column uses the date presenter and the amount and
 * quota columns render the decimal strings aligned to
 * the end. No selection or actions columns, since
 * applications are recorded inside the portfolio
 * screens.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The row lookup resolver.
 *
 * @returns The application column definitions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function CreateApplicationTableColumns(
  columnHelper: ColumnHelper<
    EntityTableFeatures,
    ApplicationResponseDTO
  >,
  options: ApplicationTableColumnOptions
): ColumnDef<
  EntityTableFeatures,
  ApplicationResponseDTO,
  any
>[] {
  return [
    columnHelper.accessor((row) => options.rowFor(row.id), {
      id: "portfolio",
      header: APPLICATION_DATATABLE.COLUMN_PORTFOLIO,
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
      header: APPLICATION_DATATABLE.COLUMN_FUND,
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

    columnHelper.accessor("date", {
      header: APPLICATION_DATATABLE.COLUMN_DATE,
      size: 130,
      meta: { fluid: true },
      cell: (info) => FormatDate(info.getValue()),
    }),

    columnHelper.accessor("amount", {
      header: APPLICATION_DATATABLE.COLUMN_AMOUNT,
      size: 150,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatCurrency(info.getValue()),
    }),

    columnHelper.accessor("quotas", {
      header: APPLICATION_DATATABLE.COLUMN_QUOTAS,
      size: 150,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatQuotaQuantity(info.getValue()),
    }),
  ]
}
