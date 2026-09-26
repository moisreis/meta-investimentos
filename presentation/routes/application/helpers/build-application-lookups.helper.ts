import type { ApplicationResponseDTO } from "@/services/application/dto/application-response.dto"
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import type { PositionResponseDTO } from "@/services/position/dto/position-response.dto"

import type { ApplicationLookups } from "../types/application-list.types"

// Input resolved by the application list loader.
export interface BuildApplicationLookupsInput {
  applications: ApplicationResponseDTO[]
  portfolios: PortfolioResponseDTO[]
  funds: FundResponseDTO[]
  positions: PositionResponseDTO[]
}

// Empty lookups used before the loader resolves.
export const EMPTY_APPLICATION_LOOKUPS: ApplicationLookups = {
  rows: {},
  portfolioOptions: [],
  fundOptions: [],
}

/**
 * @summary
 * Builds the lookups of the application datatable.
 *
 * @remarks
 * Resolves each application row to its portfolio and
 * fund display data through the position join, and
 * derives the portfolio and fund options offered by the
 * filters from the portfolios and funds that actually
 * hold applications. Options are ordered by label.
 *
 * @explanation
 * Use this helper in loaders that need the lookup
 * records consumed by the application datatable columns
 * and filters.
 *
 * @param input - The loaded application list.
 *
 * @returns The application lookups.
 *
 * @example
 * const LOOKUPS = BuildApplicationLookups(LOADED);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildApplicationLookups(
  input: BuildApplicationLookupsInput
): ApplicationLookups {
  const POSITION_BY_ID = Object.fromEntries(
    input.positions.map((position) => [position.id, position])
  )
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

  const ROWS: ApplicationLookups["rows"] = {}

  for (const application of input.applications) {
    const POSITION = POSITION_BY_ID[application.positionId]

    if (!POSITION) continue

    const PORTFOLIO = PORTFOLIO_BY_ID[POSITION.portfolioId]
    const FUND = FUND_BY_ID[POSITION.fundId]

    SEEN_PORTFOLIOS.add(POSITION.portfolioId)
    SEEN_FUNDS.add(POSITION.fundId)

    ROWS[application.id] = {
      portfolioId: POSITION.portfolioId,
      portfolioName: PORTFOLIO?.name ?? "Carteira",
      portfolioAcronym: PORTFOLIO?.acronym ?? "",
      fundId: POSITION.fundId,
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
