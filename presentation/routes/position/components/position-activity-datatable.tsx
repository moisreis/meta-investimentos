"use client"

import { IconArrowDownRight } from "@tabler/icons-react"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
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
    <section
      className="flex w-full flex-col gap-4 border-b border-border px-4 py-6 last:border-b-0 sm:px-6"
      aria-labelledby="position-activity-title"
    >
      <div className="flex flex-col gap-1">
        <h2
          id="position-activity-title"
          className="font-heading text-xs font-medium text-foreground uppercase"
        >
          {POSITION_ACTIVITY.TITLE}
        </h2>
        <p className="text-xs text-muted-foreground">
          {POSITION_ACTIVITY.DESCRIPTION}
        </p>
      </div>

      {hasRows ? (
        <EntityDatatable table={table} />
      ) : (
        <EntityEmptyTable
          icon={IconArrowDownRight}
          title={POSITION_ACTIVITY.EMPTY_TITLE}
          description={POSITION_ACTIVITY.EMPTY_DESCRIPTION}
        />
      )}
    </section>
  )
}

export { PositionActivityDatatable }
