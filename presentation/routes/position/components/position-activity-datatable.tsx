"use client"

import { IconArrowDownRight } from "@tabler/icons-react"

import { SharedDatatableSection } from "@/presentation/parts/datatable/layout/shared-datatable-section"
import type { PortfolioActivityRow } from "@/presentation/types/portfolio-activity-row.types"

import { usePositionActivityTable } from "../hooks/use-position-activity-table.hook"
import { POSITION_ACTIVITY } from "../settings/labels.settings"

/**
 * Props of the recent activity section.
 */
export interface PositionActivityDatatableProps {
  // The activity rows inside the selected window.
  rows: readonly PortfolioActivityRow[]
}

/**
 * @summary
 * Renders the recent activity section of the position
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
 *
 * @returns The recent activity section.
 *
 * @example
 * <PositionActivityDatatable rows={ROWS} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function PositionActivityDatatable({
  rows,
}: PositionActivityDatatableProps) {
  const { hasRows, table } = usePositionActivityTable(rows)

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
