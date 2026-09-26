import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"

import type { PortfolioPerformanceLookups } from "../types/portfolio-performance-list.types"

// Input resolved by the performance list loader.
export interface BuildPortfolioPerformanceLookupsInput {
  performances: PortfolioPerformanceResponseDTO[]
  portfolios: PortfolioResponseDTO[]
}

// Empty lookups used before the loader resolves.
export const EMPTY_PORTFOLIO_PERFORMANCE_LOOKUPS: PortfolioPerformanceLookups =
  {
    rows: {},
    portfolioOptions: [],
  }

/**
 * @summary
 * Builds the lookups of the performance datatable.
 *
 * @remarks
 * Resolves each performance row to its portfolio display
 * data, and derives the portfolio options offered by the
 * filters from the portfolios that actually hold
 * performance records. Options are ordered by label.
 *
 * @explanation
 * Use this helper in loaders that need the lookup
 * records consumed by the performance datatable columns
 * and filters.
 *
 * @param input - The loaded performance list.
 *
 * @returns The performance lookups.
 *
 * @example
 * const LOOKUPS = BuildPortfolioPerformanceLookups(LOADED);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildPortfolioPerformanceLookups(
  input: BuildPortfolioPerformanceLookupsInput
): PortfolioPerformanceLookups {
  const PORTFOLIO_BY_ID = Object.fromEntries(
    input.portfolios.map((portfolio) => [
      portfolio.id,
      portfolio,
    ])
  )

  const SEEN_PORTFOLIOS = new Set<string>()

  const ROWS: PortfolioPerformanceLookups["rows"] = {}

  for (const performance of input.performances) {
    const PORTFOLIO = PORTFOLIO_BY_ID[performance.portfolioId]

    SEEN_PORTFOLIOS.add(performance.portfolioId)

    ROWS[performance.id] = {
      portfolioName: PORTFOLIO?.name ?? "Carteira",
      portfolioAcronym: PORTFOLIO?.acronym ?? "",
    }
  }

  const PORTFOLIO_OPTIONS = [...SEEN_PORTFOLIOS]
    .map((portfolioId) => ({
      value: portfolioId,
      label: PORTFOLIO_BY_ID[portfolioId]?.name ?? "Carteira",
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"))

  return {
    rows: ROWS,
    portfolioOptions: PORTFOLIO_OPTIONS,
  }
}
