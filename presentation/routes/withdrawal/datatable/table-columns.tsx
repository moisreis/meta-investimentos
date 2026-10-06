"use client"

import type { ColumnHelper } from "@tanstack/react-table"
import {
  IconCheck,
  IconRotateClockwise,
} from "@tabler/icons-react"

import { EntityStateBadge } from "@/presentation/parts/datatable/columns/entity-state-badge"
import type { EntityColumnDef } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { CreateEntitySelectColumn } from "@/presentation/parts/datatable/pinned-columns/entity-table-selectable-column"
import { EntityLookupCell } from "@/presentation/parts/datatable/columns/entity-lookup-cell"
import { EntityTableRowMenuDropdown } from "@/presentation/parts/datatable/row-menus/entity-table-row-menu-dropdown"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatCnpj } from "@/presentation/presenters/cnpj.presenter"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatDate } from "@/presentation/presenters/date.presenter"
import { FormatQuotaQuantity } from "@/presentation/presenters/quota-quantity.presenter"
import type { WithdrawalRow } from "@/presentation/types/withdrawal-row.types"

import { WITHDRAWAL_DATATABLE } from "../settings/labels.settings"
import type { WithdrawalRowLookup } from "../types/withdrawal-list.types"

export interface WithdrawalTableColumnOptions {
  rowFor: (withdrawalId: string) => WithdrawalRowLookup | null
  onReverse: (withdrawal: WithdrawalRow) => void
}

/**
 * @summary
 * Builds the column definitions of the withdrawal
 * datatable.
 *
 * @remarks
 * Renders a selectable list with row actions: the
 * selection column is pinned to the start, the
 * portfolio and fund columns resolve their names
 * through `rowFor` and render them through the shared
 * lookup cell, with the portfolio acronym and the
 * masked CNPJ below the respective name, the date
 * column uses the date presenter, the amount and
 * quota columns render the decimal strings aligned to
 * the end and the status column turns the reversal
 * state into an `Ativo` or `Estornado` badge. The
 * actions column is pinned to the end and offers the
 * reverse action while the row is still active,
 * since a reversed withdrawal can no longer be
 * reversed again.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The row lookup resolver and action callbacks.
 *
 * @returns The withdrawal column definitions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export function CreateWithdrawalTableColumns(
  columnHelper: ColumnHelper<EntityTableFeatures, WithdrawalRow>,
  options: WithdrawalTableColumnOptions
): EntityColumnDef<WithdrawalRow>[] {
  return [
    CreateEntitySelectColumn(columnHelper),

    columnHelper.accessor((row) => options.rowFor(row.id), {
      id: "portfolio",
      header: WITHDRAWAL_DATATABLE.COLUMN_PORTFOLIO,
      size: 180,
      meta: { fluid: true },
      cell: ({ getValue }) => (
        <EntityLookupCell
          title={getValue()?.portfolioName}
          subtitle={getValue()?.portfolioAcronym}
        />
      ),
    }),

    columnHelper.accessor((row) => options.rowFor(row.id), {
      id: "fund",
      header: WITHDRAWAL_DATATABLE.COLUMN_FUND,
      size: 220,
      meta: { fluid: true },
      cell: ({ getValue }) => (
        <EntityLookupCell
          title={getValue()?.fundName}
          subtitle={
            getValue()?.fundCnpj
              ? FormatCnpj(getValue().fundCnpj)
              : undefined
          }
        />
      ),
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

    columnHelper.accessor("quotaValue", {
      header: WITHDRAWAL_DATATABLE.COLUMN_QUOTA_VALUE,
      size: 150,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatCurrency(info.getValue()),
    }),

    columnHelper.accessor("reversedAt", {
      id: "status",
      header: WITHDRAWAL_DATATABLE.COLUMN_STATUS,
      size: 110,
      meta: { align: "center", fluid: true },
      enableSorting: false,
      cell: ({ getValue }) => (
        <EntityStateBadge
          matched={getValue() === null}
          matchedLabel={WITHDRAWAL_DATATABLE.STATUS_ACTIVE_LABEL}
          unmatchedLabel={
            WITHDRAWAL_DATATABLE.STATUS_REVERSED_LABEL
          }
          matchedIcon={<IconCheck aria-hidden="true" />}
          unmatchedIcon={
            <IconRotateClockwise aria-hidden="true" />
          }
        />
      ),
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
          label={WITHDRAWAL_DATATABLE.ROW_ACTIONS_LABEL}
          actions={[
            ...(row.original.reversedAt
              ? []
              : [
                  {
                    key: "reverse",
                    label:
                      WITHDRAWAL_DATATABLE.ROW_REVERSE_LABEL,
                    onSelect: () =>
                      options.onReverse(row.original),
                  },
                ]),
          ]}
        />
      ),
    }),
  ]
}
