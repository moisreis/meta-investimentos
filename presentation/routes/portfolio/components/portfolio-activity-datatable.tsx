"use client"

import { IconArrowDownRight } from "@tabler/icons-react"

import { SharedDatatableSection } from "@/presentation/parts/datatable/layout/shared-datatable-section"
import type { PortfolioActivityRow } from "@/presentation/types/portfolio-activity-row.types"
import type { PortfolioActivityRowActionsModel } from "../hooks/use-portfolio-activity-row-actions.hook"

import { usePortfolioActivityTable } from "../hooks/use-portfolio-activity-table.hook"
import { PORTFOLIO_ACTIVITY } from "../settings/labels.settings"

/**
 * Props of the recent activity section.
 */
export interface PortfolioActivityDatatableProps {
  // The activity rows inside the selected window.
  rows: readonly PortfolioActivityRow[]
  // Row actions (reverse) from the parent detail page.
  rowActions: PortfolioActivityRowActionsModel
}

/**
 * @summary
 * Renders the recent activity section of the portfolio
 * detail screen.
 *
 * @remarks
 * Renders the read-only activity datatable, built from the
 * window-filtered rows through the section hook, under one
 * quiet heading. An empty window swaps the datatable for the
 * shared empty state, so a period without movements explains
 * itself instead of presenting an empty frame.
 *
 * @param props - Props of the recent activity section.
 * @param props.rows - The activity rows inside the selected
 *   window.
 * @param props.rowActions - Row actions (reverse) handler.
 *
 * @returns The recent activity section.
 *
 * @example
 * <PortfolioActivityDatatable
 *   rows={ROWS}
 *   rowActions={ACTIONS}
 * />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function PortfolioActivityDatatable({
  rows,
  rowActions,
}: PortfolioActivityDatatableProps) {
  const { hasRows, table } = usePortfolioActivityTable(
    rows,
    rowActions
  )

  return (
    <SharedDatatableSection
      titleId="portfolio-activity-title"
      title={PORTFOLIO_ACTIVITY.TITLE}
      description={PORTFOLIO_ACTIVITY.DESCRIPTION}
      table={table}
      hasRows={hasRows}
      emptyIcon={IconArrowDownRight}
      emptyTitle={PORTFOLIO_ACTIVITY.EMPTY_TITLE}
      emptyDescription={PORTFOLIO_ACTIVITY.EMPTY_DESCRIPTION}
    />
  )
}

export { PortfolioActivityDatatable }
