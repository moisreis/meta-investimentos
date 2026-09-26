import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import type { PositionPerformanceResponseDTO } from "@/services/position-performance/dto/position-performance-response.dto"
import type { PositionResponseDTO } from "@/services/position/dto/position-response.dto"

import type { PositionPerformanceLookups } from "../types/position-performance-list.types"

// Input resolved by the position performance loader.
export interface BuildPositionPerformanceLookupsInput {
  performances: PositionPerformanceResponseDTO[]
  positions: PositionResponseDTO[]
  portfolios: PortfolioResponseDTO[]
  funds: FundResponseDTO[]
}

// Empty lookups used before the loader resolves.
export const EMPTY_POSITION_PERFORMANCE_LOOKUPS: PositionPerformanceLookups =
  {
    rows: {},
    positionOptions: [],
    calculationOptions: [],
  }

/**
 * @summary
 * Builds the lookups of the position performance screen.
 *
 * @remarks
 * Resolves each performance row to its position display
 * data, derives the position options offered by the
 * filters from the positions that actually hold
 * performance records, and builds the calculation
 * options offered by the confirm dialog from every
 * position of the user. Options are ordered by label.
 *
 * @explanation
 * Use this helper in loaders that need the lookup
 * records consumed by the position performance datatable
 * columns, filters and calculate dialog.
 *
 * @param input - The loaded position performance list.
 *
 * @returns The position performance lookups.
 *
 * @example
 * const LOOKUPS = BuildPositionPerformanceLookups(LOADED);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildPositionPerformanceLookups(
  input: BuildPositionPerformanceLookupsInput
): PositionPerformanceLookups {
  const PORTFOLIO_BY_ID = Object.fromEntries(
    input.portfolios.map((portfolio) => [
      portfolio.id,
      portfolio,
    ])
  )
  const FUND_BY_ID = Object.fromEntries(
    input.funds.map((fund) => [fund.id, fund])
  )
  const POSITION_BY_ID = Object.fromEntries(
    input.positions.map((position) => [position.id, position])
  )

  const SEEN_POSITIONS = new Set<string>()

  const ROWS: PositionPerformanceLookups["rows"] = {}

  for (const performance of input.performances) {
    const POSITION = POSITION_BY_ID[performance.positionId]

    SEEN_POSITIONS.add(performance.positionId)

    ROWS[performance.id] = {
      fundName:
        FUND_BY_ID[POSITION?.fundId ?? ""]?.name ?? "Fundo",
      portfolioName:
        PORTFOLIO_BY_ID[POSITION?.portfolioId ?? ""]?.name ??
        "Carteira",
      portfolioAcronym:
        PORTFOLIO_BY_ID[POSITION?.portfolioId ?? ""]?.acronym ??
        "",
    }
  }

  const POSITION_OPTIONS = [...SEEN_POSITIONS]
    .map((positionId) => ({
      value: positionId,
      label:
        FUND_BY_ID[POSITION_BY_ID[positionId]?.fundId ?? ""]
          ?.name ?? "Fundo",
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"))

  const CALCULATION_OPTIONS = input.positions
    .map((position) => {
      const FUND_NAME =
        FUND_BY_ID[position.fundId]?.name ?? "Fundo"
      const PORTFOLIO_NAME =
        PORTFOLIO_BY_ID[position.portfolioId]?.name ?? "Carteira"

      return {
        value: position.id,
        label: `${FUND_NAME} · ${PORTFOLIO_NAME}`,
      }
    })
    .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"))

  return {
    rows: ROWS,
    positionOptions: POSITION_OPTIONS,
    calculationOptions: CALCULATION_OPTIONS,
  }
}
