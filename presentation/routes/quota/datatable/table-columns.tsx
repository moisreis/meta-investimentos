"use client"

import type { ColumnHelper } from "@tanstack/react-table"

import type { EntityColumnDef } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { EntityLookupCell } from "@/presentation/parts/datatable/columns/entity-lookup-cell"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatCnpj } from "@/presentation/presenters/cnpj.presenter"
import { FormatDate } from "@/presentation/presenters/date.presenter"
import type { QuotaRow } from "@/presentation/types/quota-row.types"

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
 * fund name through `fundFor` and renders it through the
 * shared lookup cell, with the masked CNPJ below the
 * name, the date column uses the date presenter and the
 * price column renders the decimal string through the
 * currency presenter aligned to the end. No selection or
 * actions columns, since quotas come from the CVM import
 * only.
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
  columnHelper: ColumnHelper<EntityTableFeatures, QuotaRow>,
  options: QuotaTableColumnOptions
): EntityColumnDef<QuotaRow>[] {
  return [
    columnHelper.accessor((row) => options.fundFor(row.id), {
      id: "fund",
      header: QUOTA_DATATABLE.COLUMN_FUND,
      size: 260,
      meta: { fluid: true },
      cell: (info) => {
        const LOOKUP = info.getValue()

        return (
          <EntityLookupCell
            title={LOOKUP?.name}
            subtitle={
              LOOKUP?.cnpj ? FormatCnpj(LOOKUP.cnpj) : undefined
            }
          />
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
