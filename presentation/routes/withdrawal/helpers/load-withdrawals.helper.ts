import { RequireSessionUser } from "@/lib/auth/require-session"
import { WithdrawalContainer } from "@/presentation/composition/withdrawal.container"
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import type { PositionResponseDTO } from "@/services/position/dto/position-response.dto"
import type { WithdrawalResponseDTO } from "@/services/withdrawal/dto/withdrawal-response.dto"

// Data resolved by the withdrawal list loader.
export interface LoadedWithdrawalList {
  withdrawals: WithdrawalResponseDTO[]
  portfolios: PortfolioResponseDTO[]
  funds: FundResponseDTO[]
  positions: PositionResponseDTO[]
}

/**
 * @summary
 * Resolves the session user, the user portfolios, the
 * registered funds, and the withdrawals recorded across
 * the positions of those portfolios.
 *
 * @remarks
 * Derives the acting user from the session, lists the
 * portfolios of that user and every fund, resolves the
 * positions of those portfolios, and delegates the
 * withdrawal query to the bulk lookup use case. Every read
 * goes through the container, so the delivery layer never
 * touches a repository. Returns null when there is no
 * active session.
 *
 * @explanation
 * Use this helper from the page loader so the session
 * resolution and the registry listing stay in a single
 * composition point.
 *
 * @returns The loaded withdrawal list, or `null`.
 *
 * @example
 * const LOADED = await LoadWithdrawals();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function LoadWithdrawals(): Promise<LoadedWithdrawalList | null> {
  const USER = await RequireSessionUser()

  if (!USER) return null

  const {
    listAllPositions: LIST_ALL_POSITIONS,
    listAllWithdrawals: LIST_ALL_WITHDRAWALS,
    listFunds: LIST_FUNDS,
    listPortfolios: LIST_PORTFOLIOS,
  } = WithdrawalContainer()

  const PORTFOLIOS = await LIST_PORTFOLIOS.execute({
    userId: USER.id,
  })
  const FUNDS = await LIST_FUNDS.execute({})
  const POSITIONS = await LIST_ALL_POSITIONS.execute({
    portfolioIds: PORTFOLIOS.map((portfolio) => portfolio.id),
  })
  const WITHDRAWALS = await LIST_ALL_WITHDRAWALS.execute({
    positionIds: POSITIONS.map((position) => position.id),
  })

  return {
    withdrawals: WITHDRAWALS,
    portfolios: PORTFOLIOS,
    funds: FUNDS,
    positions: POSITIONS,
  }
}
