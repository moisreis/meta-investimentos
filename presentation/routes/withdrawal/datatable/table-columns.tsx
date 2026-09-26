"use client"

import type {
  ColumnDef,
  ColumnHelper,
} from "@tanstack/react-table"

import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatDate } from "@/presentation/presenters/date.presenter"
import { FormatQuotaQuantity } from "@/presentation/presenters/quota-quantity.presenter"
import type { WithdrawalResponseDTO } from "@/services/withdrawal/dto/withdrawal-response.dto"

import { WITHDRAWAL_DATATABLE } from "../settings/labels.settings"
import type { WithdrawalRowLookup } from "../types/withdrawal-list.types"

export interface WithdrawalTableColumnOptions {
  rowFor: (withdrawalId: string) => WithdrawalRowLookup | null
}

/**
 * @summary
 * Builds the column definitions of the withdrawal
 * datatable.
 *
 * @remarks
 * Renders a read-only list: the portfolio and fund
 * columns resolve their names through `rowFor`, the date
 * column uses the date presenter and the amount and
 * quota columns render the decimal strings aligned to
 * the end. No selection or actions columns, since
 * withdrawals are recorded inside the portfolio
 * screens.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The row lookup resolver.
 *
 * @returns The withdrawal column definitions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function CreateWithdrawalTableColumns(
  columnHelper: ColumnHelper<
    EntityTableFeatures,
    WithdrawalResponseDTO
  >,
  options: WithdrawalTableColumnOptions
): ColumnDef<EntityTableFeatures, WithdrawalResponseDTO, any>[] {
  return [
    columnHelper.accessor((row) => options.rowFor(row.id), {
      id: "portfolio",
      header: WITHDRAWAL_DATATABLE.COLUMN_PORTFOLIO,
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
      header: WITHDRAWAL_DATATABLE.COLUMN_FUND,
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
      header: WITHDRAWAL_DATATABLE.COLUMN_DATE,
      size: 130,
      meta: { fluid: true },
      cell: (info) => FormatDate(info.getValue()),
    }),

    columnHelper.accessor("amount", {
      header: WITHDRAWAL_DATATABLE.COLUMN_AMOUNT,
      size: 150,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatCurrency(info.getValue()),
    }),

    columnHelper.accessor("quotas", {
      header: WITHDRAWAL_DATATABLE.COLUMN_QUOTAS,
      size: 150,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatQuotaQuantity(info.getValue()),
    }),
  ]
}
