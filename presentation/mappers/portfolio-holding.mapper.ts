import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"
import type { PositionWeightRow } from "@/presentation/types/position-weight-row.types"
import type { PortfolioHolding } from "@/presentation/types/portfolio-holding.types"

/**
 * @summary
 * Resolves the holdings of a portfolio from its registry
 * rows.
 *
 * @remarks
 * Joins the weight rows with the fund and bank registries,
 * so every holding carries the fund name, the custodian name
 * and its code next to the money it holds. A weight row whose
 * fund or bank is missing from its registry is dropped, since
 * a holding with no name cannot be labeled.
 *
 * The registries are all loaded in full, because the weights
 * and the registries may resolve in any order and the holding
 * count of a portfolio is small next to the registry size.
 *
 * @explanation
 * Use this mapper in the portfolio detail loader. Resolving
 * the names here is what keeps the distribution chart
 * builders pure, so they group and format but never look a
 * name up.
 *
 * @param weights - The weight rows of the portfolio.
 * @param funds - The fund registry, in any order.
 * @param banks - The bank registry, in any order.
 *
 * @returns The resolved holdings, in weight row order.
 *
 * @example
 * const HOLDINGS = BuildPortfolioHoldings(
 *   WEIGHTS, FUNDS, BANKS);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function BuildPortfolioHoldings(
  weights: readonly PositionWeightRow[],
  funds: readonly FundResponseDTO[],
  banks: readonly BankResponseDTO[]
): PortfolioHolding[] {
  const FUNDS = new Map(funds.map((fund) => [fund.id, fund]))
  const BANKS = new Map(banks.map((bank) => [bank.id, bank]))

  return weights.flatMap((weight) => {
    const FUND = FUNDS.get(weight.fundId)
    const BANK = FUND ? BANKS.get(FUND.bankId) : undefined

    if (!FUND || !BANK) return []

    return [
      {
        positionId: weight.positionId,
        fundId: FUND.id,
        fundName: FUND.name,
        bankId: BANK.id,
        bankName: BANK.name,
        bankCode: BANK.code,
        weight: weight.weight,
        investedValue: weight.investedValue,
      },
    ]
  })
}