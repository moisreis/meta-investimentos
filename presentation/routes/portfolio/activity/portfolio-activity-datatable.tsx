"use client"

import { IconArrowDownRight } from "@tabler/icons-react"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { PortfolioActivityRow } from "@/presentation/types/portfolio-activity-row.types"

import { usePortfolioActivityTable } from "./hooks/use-portfolio-activity-table.hook"
import { PORTFOLIO_ACTIVITY } from "../settings/labels.settings"

/**
 * Props of the recent activity section.
 */
export interface PortfolioActivityDatatableProps {
  // The activity rows inside the selected window.
  rows: readonly PortfolioActivityRow[]
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
 *
 * @returns The recent activity section.
 *
 * @example
 * <PortfolioActivityDatatable rows={ROWS} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function PortfolioActivityDatatable({
  rows,
}: PortfolioActivityDatatableProps) {
  const { hasRows, table } = usePortfolioActivityTable(rows)

  return (
    <section
      className="flex w-full flex-col gap-4 border-b border-border px-4 py-6 last:border-b-0 sm:px-6"
      aria-labelledby="portfolio-activity-title"
    >
      <div className="flex flex-col gap-1">
        <h2
          id="portfolio-activity-title"
          className="text-base font-medium text-foreground"
        >
          {PORTFOLIO_ACTIVITY.TITLE}
        </h2>
        <p className="text-xs text-muted-foreground">
          {PORTFOLIO_ACTIVITY.DESCRIPTION}
        </p>
      </div>

      {hasRows ? (
        <EntityDatatable table={table} />
      ) : (
        <EntityEmptyTable
          icon={IconArrowDownRight}
          title={PORTFOLIO_ACTIVITY.EMPTY_TITLE}
          description={PORTFOLIO_ACTIVITY.EMPTY_DESCRIPTION}
        />
      )}
    </section>
  )
}

export { PortfolioActivityDatatable }
