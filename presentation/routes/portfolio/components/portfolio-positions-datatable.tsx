"use client"

import { IconChartDonut } from "@tabler/icons-react"

import { SharedDatatableSection } from "@/presentation/parts/datatable/layout/shared-datatable-section"
import type { PortfolioHolding } from "@/presentation/types/portfolio-holding.types"

import { usePortfolioPositionsTable } from "../hooks/use-portfolio-positions-table.hook"
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
    <SharedDatatableSection
      titleId="portfolio-positions-title"
      title={PORTFOLIO_POSITIONS.TITLE}
      description={PORTFOLIO_POSITIONS.DESCRIPTION}
      table={table}
      hasRows={hasRows}
      emptyIcon={IconChartDonut}
      emptyTitle={PORTFOLIO_POSITIONS.EMPTY_TITLE}
      emptyDescription={PORTFOLIO_POSITIONS.EMPTY_DESCRIPTION}
    />
  )
}

export { PortfolioPositionsDatatable }
