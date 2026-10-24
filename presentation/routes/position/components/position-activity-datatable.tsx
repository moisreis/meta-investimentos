"use client"

import { IconArrowDownRight } from "@tabler/icons-react"

import { SharedDatatableSection } from "@/presentation/parts/datatable/layout/shared-datatable-section"
import type { PortfolioActivityRow } from "@/presentation/types/portfolio-activity-row.types"
import type { PositionActivityRowActionsModel } from "../hooks/use-position-activity-row-actions.hook"

import { usePositionActivityTable } from "../hooks/use-position-activity-table.hook"
import { POSITION_ACTIVITY } from "../settings/labels.settings"

/**
 * Props of the recent activity section.
 */
export interface PositionActivityDatatableProps {
  // The activity rows inside the selected window.
  rows: readonly PortfolioActivityRow[]
  // Row actions (reverse) from the parent detail page.
  rowActions: PositionActivityRowActionsModel
}

/**
 * @summary
 * Renders the recent activity section of the position
 * detail screen.
 *
 * @remarks
 * Renders the activity datatable, built from the
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
 * <PositionActivityDatatable
 *   rows={ROWS}
 *   rowActions={ACTIONS}
 * />
 *
 * @author Moisés Reis
 *
 * @date 2026-10-21
 */
function PositionActivityDatatable({
  rows,
  rowActions,
}: PositionActivityDatatableProps) {
  const { hasRows, table } = usePositionActivityTable(
    rows,
    rowActions
  )

  return (
    <SharedDatatableSection
      titleId="position-activity-title"
      title={POSITION_ACTIVITY.TITLE}
      description={POSITION_ACTIVITY.DESCRIPTION}
      table={table}
      hasRows={hasRows}
      emptyIcon={IconArrowDownRight}
      emptyTitle={POSITION_ACTIVITY.EMPTY_TITLE}
      emptyDescription={POSITION_ACTIVITY.EMPTY_DESCRIPTION}
    />
  )
}

export { PositionActivityDatatable }
