"use client"

import { IconChartDonut } from "@tabler/icons-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/ui/card"
import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { PortfolioHolding } from "@/presentation/types/portfolio-holding.types"

import { usePortfolioPositionsTable } from "./hooks/use-portfolio-positions-table.hook"
import { PORTFOLIO_POSITIONS } from "../settings/labels.settings"

/**
 * Props of the positions section.
 */
export interface PortfolioPositionsDatatableProps {
  // The holdings of the portfolio.
  holdings: readonly PortfolioHolding[]
}

/**
 * @summary
 * Renders the positions section of the portfolio detail
 * screen.
 *
 * @remarks
 * Composes the shared card frame with the read-only positions
 * datatable, built from the holdings through the section
 * hook. Like the distributions, the section ignores the
 * selected window: a holding is a fact about the portfolio
 * today, so narrowing the date range must not change which
 * positions are listed. A portfolio without holdings swaps
 * the datatable for the shared empty state, so the missing
 * records explain themselves instead of presenting an empty
 * frame.
 *
 * @param props - Props of the positions section.
 * @param props.holdings - The holdings of the portfolio.
 *
 * @returns The positions section.
 *
 * @example
 * <PortfolioPositionsDatatable holdings={HOLDINGS} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function PortfolioPositionsDatatable({
  holdings,
}: PortfolioPositionsDatatableProps) {
  const { hasRows, table } = usePortfolioPositionsTable(holdings)

  return (
    <section className="flex w-full flex-col gap-4 pb-6">
      <Card size="sm" className="gap-0 p-0">
        <CardHeader className="border-b bg-sidebar p-3">
          <CardTitle>{PORTFOLIO_POSITIONS.TITLE}</CardTitle>
          <CardDescription>
            {PORTFOLIO_POSITIONS.DESCRIPTION}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {hasRows ? (
            <EntityDatatable table={table} />
          ) : (
            <EntityEmptyTable
              icon={IconChartDonut}
              title={PORTFOLIO_POSITIONS.EMPTY_TITLE}
              description={PORTFOLIO_POSITIONS.EMPTY_DESCRIPTION}
            />
          )}
        </CardContent>
      </Card>
    </section>
  )
}

export { PortfolioPositionsDatatable }