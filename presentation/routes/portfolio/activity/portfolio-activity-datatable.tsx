"use client"

import { IconArrowDownRight } from "@tabler/icons-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/ui/card"
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
 * Composes the shared card frame with the read-only activity
 * datatable, built from the window-filtered rows through the
 * section hook. An empty window swaps the datatable for the
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
    <section className="flex w-full flex-col gap-4 pb-6">
      <Card size="sm" className="gap-0 p-0">
        <CardHeader className="border-b bg-sidebar p-3">
          <CardTitle>{PORTFOLIO_ACTIVITY.TITLE}</CardTitle>
          <CardDescription>
            {PORTFOLIO_ACTIVITY.DESCRIPTION}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {hasRows ? (
            <EntityDatatable table={table} />
          ) : (
            <EntityEmptyTable
              icon={IconArrowDownRight}
              title={PORTFOLIO_ACTIVITY.EMPTY_TITLE}
              description={PORTFOLIO_ACTIVITY.EMPTY_DESCRIPTION}
            />
          )}
        </CardContent>
      </Card>
    </section>
  )
}

export { PortfolioActivityDatatable }