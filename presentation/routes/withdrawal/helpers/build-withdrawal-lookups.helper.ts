import { FormatCnpjOptional } from "@/presentation/presenters/cnpj.presenter"
import type { FundRow } from "@/presentation/types/fund-row.types"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"
import type { PositionRow } from "@/presentation/types/position-row.types"
import type { WithdrawalRow } from "@/presentation/types/withdrawal-row.types"

import type { WithdrawalLookups } from "../types/withdrawal-list.types"

// Input resolved by the withdrawal list loader.
export interface BuildWithdrawalLookupsInput {
  withdrawals: WithdrawalRow[]
  portfolios: PortfolioRow[]
  funds: FundRow[]
  positions: PositionRow[]
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
      description:
        PORTFOLIO_BY_ID[portfolioId]?.acronym ?? "",
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"))

  const FUND_OPTIONS = [...SEEN_FUNDS]
    .map((fundId) => ({
      value: fundId,
      label: FUND_BY_ID[fundId]?.name ?? "Fundo",
      description: FormatCnpjOptional(FUND_BY_ID[fundId]?.cnpj),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"))

  return {
    rows: ROWS,
    portfolioOptions: PORTFOLIO_OPTIONS,
    fundOptions: FUND_OPTIONS,
  }
}
