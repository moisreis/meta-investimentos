import { LoadPortfolioPerformances } from "../helpers/load-portfolio-performances.helper"
import { BuildPortfolioPerformanceLookups } from "../helpers/build-portfolio-performance-lookups.helper"
import type { PortfolioPerformanceListProps } from "../pages/list"

/**
 * @summary
 * Resolves the props for the portfolio performance list page.
 *
 * @remarks
 * Loads the calculated portfolio performances and their lookups.
 *
 * @returns The portfolio performance list props, or empty
 * props when there is no active session.
 *
 * @example
 * const PROPS = await LoadPortfolioPerformancePageProps();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export async function LoadPortfolioPerformancePageProps(): Promise<PortfolioPerformanceListProps> {
  const LOADED = await LoadPortfolioPerformances()

  if (LOADED) {
    const PERFORMANCES = LOADED.performances
    const PORTFOLIOS = LOADED.portfolios
    const LOOKUPS = BuildPortfolioPerformanceLookups({
      performances: PERFORMANCES,
      portfolios: PORTFOLIOS,
    })

    return {
      data: PERFORMANCES,
      portfolios: PORTFOLIOS,
      lookups: LOOKUPS,
    }
  }

  return {
    data: null,
    portfolios: [],
    lookups: { rows: {}, portfolioOptions: [] },
  }
}
