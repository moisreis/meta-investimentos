import { LoadPortfolioPerformances } from "../helpers/load-portfolio-performances.helper"
import { BuildPortfolioPerformanceLookups } from "../helpers/build-portfolio-performance-lookups.helper"
import type { PortfolioPerformanceListProps } from "../pages/list"
import type { PortfolioPerformanceRow } from "@/presentation/types/portfolio-performance-row.types"
import type { PortfolioPerformanceLookups } from "../types/portfolio-performance-list.types"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"
import { PortfolioPerformanceContainer } from "@/presentation/composition/portfolio-performance.container"

/**
 * @summary
 * Resolves the props for the portfolio performance list page.
 *
 * @remarks
 * Loads the calculated portfolio performances and their lookups.
 *
 * @returns The portfolio performance list props, or empty props when
 * there is no active session.
 *
 * @example
 * const PROPS = await LoadPortfolioPerformancePageProps();
 *
 * @author MoisAcs Reis
 *
 * @date 2026-09-27
 */
export async function LoadPortfolioPerformancePageProps(): Promise<PortfolioPerformanceListProps> {
  let data: PortfolioPerformanceRow[] | null = null
  let portfolios: PortfolioRow[] = []
  let lookups: PortfolioPerformanceLookups = { rows: {}, portfolioOptions: [] }

  const LOADED = await LoadPortfolioPerformances()

  if (LOADED) {
    const PERFORMANCES = LOADED.performances
    const PORTFOLIOS = LOADED.portfolios
    const LOOKUPS = BuildPortfolioPerformanceLookups({ performances: PERFORMANCES, portfolios: PORTFOLIOS })

    return { data: PERFORMANCES, portfolios: PORTFOLIOS, lookups: LOOKUPS }
  }

  return { data: null, portfolios: [], lookups: { rows: {}, portfolioOptions: [] } }
}