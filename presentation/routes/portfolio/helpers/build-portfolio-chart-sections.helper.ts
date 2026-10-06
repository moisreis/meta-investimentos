import type { DateRange } from "react-day-picker"

import type { CheckingAccountResponseDTO } from "@/services/checking-account/dto/checking-account-response.dto"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"
import type { PortfolioBankAccountView } from "@/presentation/types/portfolio-checking.types"
import type { PortfolioHolding } from "@/presentation/types/portfolio-holding.types"
import type { PortfolioChartSection } from "../types/portfolio-chart-section.types"

import { BuildPortfolioAnnualCharts } from "./build-portfolio-annual-charts.helper"
import { BuildPortfolioCharts } from "./build-portfolio-charts.helper"
import { BuildPortfolioCheckingCharts } from "./build-portfolio-checking-charts.helper"
import { BuildPortfolioDistributionCharts } from "./build-portfolio-distribution-charts.helper"
import { BuildPortfolioNormCharts } from "./build-portfolio-norm-charts.helper"
import type { NormPortfolioAllocation } from "@/presentation/types/norms-portfolio.types"

import { PORTFOLIO_CHART_SECTIONS } from "../settings/labels.settings"

/**
 * Inputs of the portfolio chart sections builder.
 */
export interface BuildPortfolioChartSectionsInput {
  // Daily snapshots of the portfolio, feeding the windowed
  // performance charts and the annual monthly charts.
  performances: readonly PortfolioPerformanceResponseDTO[]
  // Holdings of the portfolio, feeding the distributions.
  holdings: readonly PortfolioHolding[]
  // Allocation bounds of the norms bound to the portfolio,
  // feeding the norm allocation chart.
  normAllocations: readonly NormPortfolioAllocation[]
  // Bank accounts of the portfolio, feeding the checking
  // charts.
  bankAccounts: readonly PortfolioBankAccountView[]
  // Daily balance snapshots of the portfolio bank accounts,
  // feeding the checking charts.
  balances: readonly CheckingAccountResponseDTO[]
  // The selected window, which clamps the performance and the
  // checking evolution charts.
  dateRange: DateRange | undefined
  // The calendar year the annual charts describe.
  year: number
}

/**
 * @summary
 * Builds the chart sections of the portfolio detail screen.
 *
 * @remarks
 * Groups the charts into their titled sections: the windowed
 * performance, the holdings distributions, the norm
 * allocations, the checking accounts and the annual monthly
 * history.
 *
 * Two sections feature a chart full width. The performance
 * section features its patrimony chart, the headline of the
 * screen. The norms section features its only chart, because
 * its category labels are norm names and half a row is where
 * a name starts getting truncated.
 *
 * A section whose models are
 * empty is dropped, so neither an empty ring nor an empty
 * frame is ever rendered, and the sections read in render
 * order.
 *
 * @explanation
 * Use this helper from the overview hook. It is a pure
 * composition point: every chart is built by its own helper,
 * so the section titles and the render order live next to the
 * charts they order.
 *
 * @param input - The records and the window the charts are
 *   derived from.
 *
 * @returns The chart sections, in render order.
 *
 * @example
 * const SECTIONS = BuildPortfolioChartSections({
 *   performances,
 *   holdings,
 *   normAllocations,
 *   bankAccounts,
 *   balances,
 *   dateRange,
 *   year,
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function BuildPortfolioChartSections(
  input: BuildPortfolioChartSectionsInput
): PortfolioChartSection[] {
  const SECTIONS: PortfolioChartSection[] = [
    {
      id: "performance",
      title: PORTFOLIO_CHART_SECTIONS.PERFORMANCE_TITLE,
      featured: true,
      models: BuildPortfolioCharts(
        input.performances,
        input.dateRange
      ),
    },
    {
      id: "distributions",
      title: PORTFOLIO_CHART_SECTIONS.DISTRIBUTIONS_TITLE,
      models: BuildPortfolioDistributionCharts(input.holdings),
    },
    {
      id: "norms",
      title: PORTFOLIO_CHART_SECTIONS.NORMS_TITLE,
      featured: true,
      models: BuildPortfolioNormCharts(input.normAllocations),
    },
    {
      id: "checking",
      title: PORTFOLIO_CHART_SECTIONS.CHECKING_TITLE,
      models: BuildPortfolioCheckingCharts(
        input.balances,
        input.bankAccounts,
        input.dateRange
      ),
    },
    {
      id: "annual",
      title: PORTFOLIO_CHART_SECTIONS.ANNUAL_TITLE,
      models: BuildPortfolioAnnualCharts(
        input.performances,
        input.year
      ),
    },
  ]

  return SECTIONS.filter((section) => section.models.length > 0)
}
