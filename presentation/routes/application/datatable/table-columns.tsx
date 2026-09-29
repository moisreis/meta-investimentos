"use client"

import type {
  ColumnDef,
  ColumnHelper,
} from "@tanstack/react-table"

import { CreateEntitySelectColumn } from "@/presentation/parts/datatable/pinned-columns/entity-table-selectable-column"
import { EntityLookupCell } from "@/presentation/parts/datatable/columns/entity-lookup-cell"
import { EntityTableRowMenuDropdown } from "@/presentation/parts/datatable/row-menus/entity-table-row-menu-dropdown"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatCnpj } from "@/presentation/presenters/cnpj.presenter"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatDate } from "@/presentation/presenters/date.presenter"
import { FormatQuotaQuantity } from "@/presentation/presenters/quota-quantity.presenter"
import { Badge } from "@/presentation/ui/badge"
import type { ApplicationRow } from "@/presentation/types/application-row.types"

import { APPLICATION_DATATABLE } from "../settings/labels.settings"
import type { ApplicationRowLookup } from "../types/application-list.types"

export interface ApplicationTableColumnOptions {
  rowFor: (applicationId: string) => ApplicationRowLookup | null
  onEdit: (application: ApplicationRow) => void
  onReverse: (application: ApplicationRow) => void
  onDelete: (application: ApplicationRow) => void
}

/**
 * @summary
 * Builds the column definitions of the application
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
 * actions column is pinned to the end and offers edit,
 * reverse and delete actions for each row; the reverse
 * action is only offered while the row is still active,
 * since a reversed application can no longer be
 * reversed again.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The row lookup resolver and action callbacks.
 *
 * @returns The application column definitions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export function CreateApplicationTableColumns(
  columnHelper: ColumnHelper<EntityTableFeatures, ApplicationRow>,
  options: ApplicationTableColumnOptions
): ColumnDef<EntityTableFeatures, ApplicationRow, any>[] {
  return [
    CreateEntitySelectColumn(columnHelper),

    columnHelper.accessor((row) => options.rowFor(row.id), {
      id: "portfolio",
      header: APPLICATION_DATATABLE.COLUMN_PORTFOLIO,
      size: 180,
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

    columnHelper.accessor((row) => options.rowFor(row.id), {
      id: "fund",
      header: APPLICATION_DATATABLE.COLUMN_FUND,
      size: 220,
      meta: { fluid: true },
      cell: (info) => {
        const LOOKUP = info.getValue()

        return (
          <EntityLookupCell
            title={LOOKUP?.fundName}
            subtitle={
              LOOKUP?.fundCnpj ? FormatCnpj(LOOKUP.fundCnpj) : undefined
            }
          />
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

    columnHelper.accessor("reversedAt", {
      id: "status",
      header: APPLICATION_DATATABLE.COLUMN_STATUS,
      size: 110,
      meta: { align: "center", fluid: true },
      enableSorting: false,
      cell: (info) => {
        const IS_REVERSED = info.getValue() !== null

        return (
          <Badge variant={IS_REVERSED ? "destructive" : "default"}>
            {IS_REVERSED
              ? APPLICATION_DATATABLE.STATUS_REVERSED_LABEL
              : APPLICATION_DATATABLE.STATUS_ACTIVE_LABEL}
          </Badge>
        )
      },
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
          label={APPLICATION_DATATABLE.ROW_ACTIONS_LABEL}
          actions={[
            {
              key: "edit",
              label: APPLICATION_DATATABLE.ROW_EDIT_LABEL,
              onSelect: () => options.onEdit(row.original),
            },
            ...(row.original.reversedAt
              ? []
              : [
                  {
                    key: "reverse",
                    label: APPLICATION_DATATABLE.ROW_REVERSE_LABEL,
                    separatorBefore: true,
                    onSelect: () => options.onReverse(row.original),
                  },
                ]),
            {
              key: "delete",
              label: APPLICATION_DATATABLE.ROW_DELETE_LABEL,
              variant: "destructive",
              separatorBefore: true,
              onSelect: () => options.onDelete(row.original),
            },
          ]}
        />
      ),
    }),
  ]
}