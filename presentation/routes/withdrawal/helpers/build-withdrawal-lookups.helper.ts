import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import type { PositionResponseDTO } from "@/services/position/dto/position-response.dto"
import type { WithdrawalResponseDTO } from "@/services/withdrawal/dto/withdrawal-response.dto"

import type { WithdrawalLookups } from "../types/withdrawal-list.types"

// Input resolved by the withdrawal list loader.
export interface BuildWithdrawalLookupsInput {
  withdrawals: WithdrawalResponseDTO[]
  portfolios: PortfolioResponseDTO[]
  funds: FundResponseDTO[]
  positions: PositionResponseDTO[]
}

// Empty lookups used before the loader resolves.
export const EMPTY_WITHDRAWAL_LOOKUPS: WithdrawalLookups = {
  rows: {},
  portfolioOptions: [],
  fundOptions: [],
}

/**
 * @summary
 * Builds the lookups of the withdrawal datatable.
 *
 * @remarks
 * Resolves each withdrawal row to its portfolio and
 * fund display data through the position join, and
 * derives the portfolio and fund options offered by the
 * filters from the portfolios and funds that actually
 * hold withdrawals. Options are ordered by label.
 *
 * @explanation
 * Use this helper in loaders that need the lookup
 * records consumed by the withdrawal datatable columns
 * and filters.
 *
 * @param input - The loaded withdrawal list.
 *
 * @returns The withdrawal lookups.
 *
 * @example
 * const LOOKUPS = BuildWithdrawalLookups(LOADED);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildWithdrawalLookups(
  input: BuildWithdrawalLookupsInput
): WithdrawalLookups {
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

  const ROWS: WithdrawalLookups["rows"] = {}

  for (const withdrawal of input.withdrawals) {
    const POSITION = POSITION_BY_ID[withdrawal.positionId]

    if (!POSITION) continue

    const PORTFOLIO = PORTFOLIO_BY_ID[POSITION.portfolioId]
    const FUND = FUND_BY_ID[POSITION.fundId]

    SEEN_PORTFOLIOS.add(POSITION.portfolioId)
    SEEN_FUNDS.add(POSITION.fundId)

    ROWS[withdrawal.id] = {
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
