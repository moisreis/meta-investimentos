"use client"

import type {
  ColumnDef,
  ColumnHelper,
} from "@tanstack/react-table"

import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatDate } from "@/presentation/presenters/date.presenter"
import type { QuotaResponseDTO } from "@/services/quota/dto/quota-response.dto"

import { QUOTA_DATATABLE } from "../settings/labels.settings"
import type { QuotaFundLookup } from "../types/quota-list.types"

export interface QuotaTableColumnOptions {
  fundFor: (quotaId: string) => QuotaFundLookup | null
}

/**
 * @summary
 * Builds the column definitions of the quota datatable.
 *
 * @remarks
 * Renders a read-only list: the fund column resolves the
 * fund name and cnpj through `fundFor`, the date column
 * uses the date presenter and the price column renders
 * the decimal string through the currency presenter
 * aligned to the end. No selection or actions columns,
 * since quotas come from the CVM import only.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The fund lookup resolver.
 *
 * @returns The quota column definitions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function CreateQuotaTableColumns(
  columnHelper: ColumnHelper<
    EntityTableFeatures,
    QuotaResponseDTO
  >,
  options: QuotaTableColumnOptions
): ColumnDef<EntityTableFeatures, QuotaResponseDTO, any>[] {
  return [
    columnHelper.accessor((row) => options.fundFor(row.id), {
      id: "fund",
      header: QUOTA_DATATABLE.COLUMN_FUND,
      size: 260,
      meta: { fluid: true },
      cell: (info) => {
        const LOOKUP = info.getValue()

        if (!LOOKUP) {
          return <span className="text-muted-foreground">—</span>
        }

        return (
          <div className="min-w-0">
            <p className="truncate font-medium">{LOOKUP.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {LOOKUP.cnpj}
            </p>
          </div>
        )
      },
    }),

    columnHelper.accessor("date", {
      header: QUOTA_DATATABLE.COLUMN_DATE,
      size: 130,
      meta: { fluid: true },
      cell: (info) => FormatDate(info.getValue()),
    }),

    columnHelper.accessor("price", {
      header: QUOTA_DATATABLE.COLUMN_PRICE,
      size: 150,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatCurrency(info.getValue()),
    }),
  ]
}
