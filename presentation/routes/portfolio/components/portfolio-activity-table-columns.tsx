"use client"

import type { ColumnHelper } from "@tanstack/react-table"
import {
  IconCircleArrowDown,
  IconCircleArrowUp,
} from "@tabler/icons-react"

import { EntityStateBadge } from "@/presentation/parts/datatable/columns/entity-state-badge"
import type { EntityColumnDef } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { EntityLookupCell } from "@/presentation/parts/datatable/columns/entity-lookup-cell"
import { EntityTableRowMenuDropdown } from "@/presentation/parts/datatable/row-menus/entity-table-row-menu-dropdown"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatDate } from "@/presentation/presenters/date.presenter"
import { FormatQuotaQuantity } from "@/presentation/presenters/quota-quantity.presenter"
import type { PortfolioActivityRow } from "@/presentation/types/portfolio-activity-row.types"
import type { PortfolioActivityRowActionsModel } from "../hooks/use-portfolio-activity-row-actions.hook"

import { PORTFOLIO_ACTIVITY } from "../settings/labels.settings"

/**
 * @summary
 * Builds the read-only column definitions of the recent
 * activity datatable.
 *
 * @remarks
 * Renders one row per movement of the portfolio inside the
 * selected window: the type badge tells an application from
 * a redemption at a glance, the fund column resolves the
 * name and the custodian bank through the shared lookup
 * cell, and the amount and quota columns render the decimal
 * strings aligned to the end. The type and the fund columns
 * are not sortable, because alphabetical order has no
 * meaning for them. The actions column offers a reverse
 * action for each row, delegating to the parent's row
 * actions hook which owns the confirm dialog and toast.
 *
 * @param columnHelper - The entity column helper.
 * @param rowActions - Row actions handler for reverse.
 *
 * @returns The activity column definitions. The broad third
 *   generic of `ColumnDef` mirrors the application datatable:
 *   TanStack types the columns option of a table as a list of
 *   unknown-valued defs, and only the framework `any` bridges
 *   the differing accessor value types of a single list.
 *
 * @author MoisAcs Reis
 *
 * @date 2026-09-28
 */
export function CreatePortfolioActivityColumns(
  columnHelper: ColumnHelper<
    EntityTableFeatures,
    PortfolioActivityRow
  >,
  rowActions: PortfolioActivityRowActionsModel
): EntityColumnDef<PortfolioActivityRow>[] {
  return [
    columnHelper.accessor("kind", {
      id: "kind",
      header: PORTFOLIO_ACTIVITY.COLUMN_TYPE,
      size: 120,
      meta: { fluid: true },
      enableSorting: false,
      cell: ({ getValue }) => (
        <EntityStateBadge
          matched={getValue() === "application"}
          matchedLabel={PORTFOLIO_ACTIVITY.TYPE_APPLICATION}
          unmatchedLabel={PORTFOLIO_ACTIVITY.TYPE_WITHDRAWAL}
          matchedIcon={<IconCircleArrowUp aria-hidden="true" />}
          unmatchedIcon={
            <IconCircleArrowDown aria-hidden="true" />
          }
        />
      ),
    }),

    columnHelper.accessor("date", {
      id: "date",
      header: PORTFOLIO_ACTIVITY.COLUMN_DATE,
      size: 130,
      meta: { fluid: true },
      cell: (info) => FormatDate(info.getValue()),
    }),

    columnHelper.accessor("fundName", {
      id: "fund",
      header: PORTFOLIO_ACTIVITY.COLUMN_FUND,
      size: 240,
      meta: { fluid: true },
      enableSorting: false,
      cell: (info) => (
        <EntityLookupCell
          title={info.getValue()}
          subtitle={info.row.original.bankName}
        />
      ),
    }),

    columnHelper.accessor("amount", {
      id: "amount",
      header: PORTFOLIO_ACTIVITY.COLUMN_AMOUNT,
      size: 150,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatCurrency(info.getValue()),
    }),

    columnHelper.accessor("quotas", {
      id: "quotas",
      header: PORTFOLIO_ACTIVITY.COLUMN_QUOTAS,
      size: 150,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatQuotaQuantity(info.getValue()),
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
          label={PORTFOLIO_ACTIVITY.ROW_ACTIONS_LABEL}
          actions={[
            {
              key: "reverse",
              label: PORTFOLIO_ACTIVITY.ROW_REVERSE_LABEL,
              onSelect: () =>
                rowActions.handleReverse(row.original),
            },
          ]}
        />
      ),
    }),
  ]
}
