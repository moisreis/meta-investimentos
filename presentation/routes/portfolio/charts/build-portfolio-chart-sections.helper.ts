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
 * performance, the holdings distributions, the checking
 * accounts and the annual monthly history. The performance
 * section features its patrimony chart full width, because it
 * is the headline of the screen. A section whose models are
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
      description: PORTFOLIO_CHART_SECTIONS.PERFORMANCE_DESCRIPTION,
      featured: true,
      models: BuildPortfolioCharts(
        input.performances,
        input.dateRange
      ),
    },
    {
      id: "distributions",
      title: PORTFOLIO_CHART_SECTIONS.DISTRIBUTIONS_TITLE,
      description: PORTFOLIO_CHART_SECTIONS.DISTRIBUTIONS_DESCRIPTION,
      models: BuildPortfolioDistributionCharts(input.holdings),
    },
    {
      id: "checking",
      title: PORTFOLIO_CHART_SECTIONS.CHECKING_TITLE,
      description: PORTFOLIO_CHART_SECTIONS.CHECKING_DESCRIPTION,
      models: BuildPortfolioCheckingCharts(
        input.balances,
        input.bankAccounts,
        input.dateRange
      ),
    },
    {
      id: "annual",
      title: PORTFOLIO_CHART_SECTIONS.ANNUAL_TITLE,
      description: PORTFOLIO_CHART_SECTIONS.ANNUAL_DESCRIPTION,
      models: BuildPortfolioAnnualCharts(
        input.performances,
        input.year
      ),
    },
  ]

  return SECTIONS.filter((section) => section.models.length > 0)
}