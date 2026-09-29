"use client"

import { IconChartDonut } from "@tabler/icons-react"

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
 * Renders the read-only positions datatable, built from the
 * holdings through the section hook, under one quiet heading.
 * Like the distributions, the section ignores the
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
    <section
      className="flex w-full flex-col gap-4 border-b border-border px-4 py-6 last:border-b-0 sm:px-6"
      aria-labelledby="portfolio-positions-title"
    >
      <div className="flex flex-col gap-1">
        <h2
          id="portfolio-positions-title"
          className="text-base font-medium text-foreground"
        >
          {PORTFOLIO_POSITIONS.TITLE}
        </h2>
        <p className="text-xs text-muted-foreground">
          {PORTFOLIO_POSITIONS.DESCRIPTION}
        </p>
      </div>

      {hasRows ? (
        <EntityDatatable table={table} />
      ) : (
        <EntityEmptyTable
          icon={IconChartDonut}
          title={PORTFOLIO_POSITIONS.EMPTY_TITLE}
          description={PORTFOLIO_POSITIONS.EMPTY_DESCRIPTION}
        />
      )}
    </section>
  )
}

export { PortfolioPositionsDatatable }
