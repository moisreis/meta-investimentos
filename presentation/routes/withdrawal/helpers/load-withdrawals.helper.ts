import { RequireSessionUser } from "@/lib/auth/require-session"
import { PositionContainer } from "@/presentation/composition/position.container"
import { WithdrawalContainer } from "@/presentation/composition/withdrawal.container"
import { ToWithdrawalRows } from "@/presentation/mappers/withdrawal-row.mapper"
import { ToPortfolioRows } from "@/presentation/mappers/portfolio-row.mapper"
import { ToFundRows } from "@/presentation/mappers/fund-row.mapper"
import { ToPositionRows } from "@/presentation/mappers/position-row.mapper"
import { ToPositionWeightRows } from "@/presentation/mappers/position-weight-row.mapper"
import type { FundRow } from "@/presentation/types/fund-row.types"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"
import type { PositionRow } from "@/presentation/types/position-row.types"
import type { PositionWeightRow } from "@/presentation/types/position-weight-row.types"
import type { WithdrawalRow } from "@/presentation/types/withdrawal-row.types"

// Data resolved by the withdrawal list loader.
export interface LoadedWithdrawalList {
  withdrawals: WithdrawalRow[]
  portfolios: PortfolioRow[]
  funds: FundRow[]
  positions: PositionRow[]
  // Share each position holds of its portfolio, driving the
  // add dialog options.
  weights: PositionWeightRow[]
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
  const { listWeights: LIST_WEIGHTS } = PositionContainer()

  const PORTFOLIOS = await LIST_PORTFOLIOS.execute({
    userId: USER.id,
  })
  const PORTFOLIO_IDS = PORTFOLIOS.map(
    (portfolio) => portfolio.id
  )

  const [FUNDS, POSITIONS, WEIGHTS] = await Promise.all([
    LIST_FUNDS.execute({}),
    LIST_ALL_POSITIONS.execute({ portfolioIds: PORTFOLIO_IDS }),
    LIST_WEIGHTS.execute({ portfolioIds: PORTFOLIO_IDS }),
  ])

  const WITHDRAWALS = await LIST_ALL_WITHDRAWALS.execute({
    positionIds: POSITIONS.map((position) => position.id),
  })

  return {
    withdrawals: ToWithdrawalRows(WITHDRAWALS),
    portfolios: ToPortfolioRows(PORTFOLIOS),
    funds: ToFundRows(FUNDS),
    positions: ToPositionRows(POSITIONS),
    weights: ToPositionWeightRows(WEIGHTS),
  }
}
