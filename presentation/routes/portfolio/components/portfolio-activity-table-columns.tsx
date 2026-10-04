"use client"

import type { ColumnHelper } from "@tanstack/react-table"

import { EntityStateBadge } from "@/presentation/parts/datatable/columns/entity-state-badge"
import type { EntityColumnDef } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { EntityLookupCell } from "@/presentation/parts/datatable/columns/entity-lookup-cell"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatDate } from "@/presentation/presenters/date.presenter"
import { FormatQuotaQuantity } from "@/presentation/presenters/quota-quantity.presenter"
import type { PortfolioActivityRow } from "@/presentation/types/portfolio-activity-row.types"

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
 * meaning for them.
 *
 * @param columnHelper - The entity column helper.
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
  >
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
          matchedIcon={PORTFOLIO_ACTIVITY.TYPE_APPLICATION_ICON}
          unmatchedIcon={PORTFOLIO_ACTIVITY.TYPE_WITHDRAWAL_ICON}
        />
      ),
    }),
  ]
}
