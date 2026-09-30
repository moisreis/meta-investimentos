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
import type { PositionRow } from "@/presentation/types/position-row.types"

import { POSITION_DATATABLE } from "../settings/labels.settings"
import type { PositionRowLookup } from "../types/position-list.types"

export interface PositionTableColumnOptions {
  rowFor: (positionId: string) => PositionRowLookup | null
  onView: (position: PositionRow) => void
  onDelete: (position: PositionRow) => void
}

/**
 * @summary
 * Builds the column definitions of the position
 * datatable.
 *
 * @remarks
 * Renders a selectable list with row actions: the
 * selection column is pinned to the start, the
 * portfolio and fund columns resolve their names
 * through `rowFor` and render them through the shared
 * lookup cell, with the portfolio acronym and the
 * masked CNPJ below the respective name, the opening
 * date column uses the date presenter and the initial
 * balance column renders the nullable decimal string
 * through the currency presenter aligned to the end.
 * The actions column is pinned to the end and offers a
 * view and a delete action for each row.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The row lookup resolver, and the view and
 *                  delete callbacks.
 *
 * @returns The position column definitions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export function CreatePositionTableColumns(
  columnHelper: ColumnHelper<EntityTableFeatures, PositionRow>,
  options: PositionTableColumnOptions
): ColumnDef<EntityTableFeatures, PositionRow, any>[] {
  return [
    CreateEntitySelectColumn(columnHelper),

    columnHelper.accessor((row) => options.rowFor(row.id), {
      id: "portfolio",
      header: POSITION_DATATABLE.COLUMN_PORTFOLIO,
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
      header: POSITION_DATATABLE.COLUMN_FUND,
      size: 220,
      meta: { fluid: true },
      cell: (info) => {
        const LOOKUP = info.getValue()

        return (
          <EntityLookupCell
            title={LOOKUP?.fundName}
            subtitle={
              LOOKUP?.fundCnpj
                ? FormatCnpj(LOOKUP.fundCnpj)
                : undefined
            }
          />
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
          label={POSITION_DATATABLE.ROW_ACTIONS_LABEL}
          actions={[
            {
              key: "view",
              label: POSITION_DATATABLE.ROW_VIEW_LABEL,
              onSelect: () => options.onView(row.original),
            },
            {
              key: "delete",
              label: POSITION_DATATABLE.ROW_DELETE_LABEL,
              variant: "destructive",
              onSelect: () => options.onDelete(row.original),
            },
          ]}
        />
      ),
    }),
  ]
}
