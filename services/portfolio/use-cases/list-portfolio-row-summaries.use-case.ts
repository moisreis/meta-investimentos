import type { IBankAccount } from "@domain/bank-account/interfaces/bank-account.interface"
import type { IPosition } from "@domain/position/interfaces/position.interface"
import { EntityId } from "@/value-objects"

export interface ListPortfolioRowSummariesInput {
  portfolioIds: string[]
}

export interface PortfolioRowSummaryDTO {
  portfolioId: string
  fundCount: number
  bankAccountCount: number
}

// Count entry returned by both grouped count queries.
interface PortfolioRowCount {
  portfolioId: EntityId
  count: number
}

/**
 * @summary
 * Summarizes the holdings of a set of portfolios.
 *
 * @remarks
 * Runs two grouped queries in parallel — one over the
 * `position` rows and one over the `bank_account` rows —
 * so no rows are materialized. Because the `(portfolio,
 * fund)` pair is unique, the position count equals the
 * number of distinct funds held by each portfolio.
 *
 * @explanation
 * Use this use case whenever a loader needs per-row
 * derived tallies. Entities keep their own repository
 * contract; this service composes them into one payload.
 *
 * @example
 * const SUMMARIES = await LIST_SUMMARIES_USE_CASE.execute({
 *   portfolioIds: ["pf-1", "pf-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class ListPortfolioRowSummariesUseCase {
  constructor(
    private positionRepository: IPosition,
    private bankAccountRepository: IBankAccount
  ) {}

  /**
   * @summary
   * Tallies the funds and bank accounts of each portfolio.
   *
   * @remarks
   * Returns an entry only for portfolios that matched at
   * least one row; callers fall back to zero when a
   * portfolio is absent from the result.
   *
   * @explanation
   * Use this method to resolve the derived holdings counts
   * of a portfolio list in a single service call.
   *
   * @param input - Payload with the portfolio ids.
   *
   * @returns The per-portfolio holdings summaries.
   *
   * @example
   * const SUMMARIES = await LIST_SUMMARIES_USE_CASE.execute({
   *   portfolioIds: ["pf-1", "pf-2"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: ListPortfolioRowSummariesInput
  ): Promise<PortfolioRowSummaryDTO[]> {
    const IDS = input.portfolioIds.map((id) =>
      EntityId.create(id)
    )

    const [FUND_COUNTS, ACCOUNT_COUNTS] = await Promise.all([
      this.positionRepository.countByPortfolioIds(IDS),
      this.bankAccountRepository.countByPortfolioIds(IDS),
    ])

    const FUNDS_BY_PORTFOLIO = new Map(
      (FUND_COUNTS as PortfolioRowCount[]).map((entry) => [
        entry.portfolioId,
        entry.count,
      ])
    )

    const ACCOUNTS_BY_PORTFOLIO = new Map(
      (ACCOUNT_COUNTS as PortfolioRowCount[]).map((entry) => [
        entry.portfolioId,
        entry.count,
      ])
    )

    const PORTFOLIO_IDS = new Set<EntityId>([
      ...FUNDS_BY_PORTFOLIO.keys(),
      ...ACCOUNTS_BY_PORTFOLIO.keys(),
    ])

    return [...PORTFOLIO_IDS].map((portfolioId) => ({
      portfolioId: portfolioId as string,
      fundCount: FUNDS_BY_PORTFOLIO.get(portfolioId) ?? 0,
      bankAccountCount:
        ACCOUNTS_BY_PORTFOLIO.get(portfolioId) ?? 0,
    }))
  }
}
