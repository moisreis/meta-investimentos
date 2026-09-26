import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import type { PositionResponseDTO } from "@/services/position/dto/position-response.dto"

import type { PositionLookups } from "../types/position-list.types"

// Input resolved by the position list loader.
export interface BuildPositionLookupsInput {
  positions: PositionResponseDTO[]
  portfolios: PortfolioResponseDTO[]
  funds: FundResponseDTO[]
}

// Empty lookups used before the loader resolves.
export const EMPTY_POSITION_LOOKUPS: PositionLookups = {
  rows: {},
  portfolioOptions: [],
  fundOptions: [],
}

/**
 * @summary
 * Builds the lookups of the position datatable.
 *
 * @remarks
 * Resolves each position row to its portfolio and fund
 * display data, and derives the portfolio and fund
 * options offered by the filters from the portfolios and
 * funds that actually hold positions. Options are
 * ordered by label.
 *
 * @explanation
 * Use this helper in loaders that need the lookup
 * records consumed by the position datatable columns and
 * filters.
 *
 * @param input - The loaded position list.
 *
 * @returns The position lookups.
 *
 * @example
 * const LOOKUPS = BuildPositionLookups(LOADED);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildPositionLookups(
  input: BuildPositionLookupsInput
): PositionLookups {
  const PORTFOLIO_BY_ID = Object.fromEntries(
    input.portfolios.map((portfolio) => [
      portfolio.id,
      portfolio,
    ])
  )
  const FUND_BY_ID = Object.fromEntries(
    input.funds.map((fund) => [fund.id, fund])
  )

  const SEEN_PORTFOLIOS = new Set<string>()
  const SEEN_FUNDS = new Set<string>()

  const ROWS: PositionLookups["rows"] = {}

  for (const position of input.positions) {
    const PORTFOLIO = PORTFOLIO_BY_ID[position.portfolioId]
    const FUND = FUND_BY_ID[position.fundId]

    SEEN_PORTFOLIOS.add(position.portfolioId)
    SEEN_FUNDS.add(position.fundId)

    ROWS[position.id] = {
      portfolioName: PORTFOLIO?.name ?? "Carteira",
      portfolioAcronym: PORTFOLIO?.acronym ?? "",
      fundName: FUND?.name ?? "Fundo",
      fundCnpj: FUND?.cnpj ?? "",
    }
  }

  const PORTFOLIO_OPTIONS = [...SEEN_PORTFOLIOS]
    .map((portfolioId) => ({
      value: portfolioId,
      label: PORTFOLIO_BY_ID[portfolioId]?.name ?? "Carteira",
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"))

  const FUND_OPTIONS = [...SEEN_FUNDS]
    .map((fundId) => ({
      value: fundId,
      label: FUND_BY_ID[fundId]?.name ?? "Fundo",
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"))

  return {
    rows: ROWS,
    portfolioOptions: PORTFOLIO_OPTIONS,
    fundOptions: FUND_OPTIONS,
  }
}
