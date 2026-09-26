import { RequireSessionUser } from "@/lib/auth/require-session"
import { PositionPerformanceContainer } from "@/presentation/composition/position-performance.container"
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import type { PositionResponseDTO } from "@/services/position/dto/position-response.dto"
import type { PositionPerformanceResponseDTO } from "@/services/position-performance/dto/position-performance-response.dto"

// Data resolved by the position performance loader.
export interface LoadedPositionPerformanceList {
  performances: PositionPerformanceResponseDTO[]
  positions: PositionResponseDTO[]
  portfolios: PortfolioResponseDTO[]
  funds: FundResponseDTO[]
}

/**
 * @summary
 * Resolves the session user, the user portfolios, the
 * registered funds, the positions held across those
 * portfolios, and the performance records calculated
 * across those positions.
 *
 * @remarks
 * Derives the acting user from the session, lists the
 * user portfolios and every fund, delegates the position
 * query to the bulk lookup use case and the performance
 * query to its bulk counterpart. Returns null when there
 * is no active session.
 *
 * @explanation
 * Use this helper from the page loader so the session
 * resolution and the registry listing stay in a single
 * composition point.
 *
 * @returns The loaded position performance list, or
 *          `null`.
 *
 * @example
 * const LOADED = await LoadPositionPerformances();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function LoadPositionPerformances(): Promise<LoadedPositionPerformanceList | null> {
  const USER = await RequireSessionUser()

  if (!USER) return null

  const {
    list: LIST_PORTFOLIOS,
    listAll: LIST_PERFORMANCES,
    listFunds: LIST_FUNDS,
    listPositions: LIST_POSITIONS,
  } = PositionPerformanceContainer()

  const PORTFOLIOS = await LIST_PORTFOLIOS.execute({
    userId: USER.id,
  })
  const FUNDS = await LIST_FUNDS.execute({})
  const POSITIONS = await LIST_POSITIONS.execute({
    portfolioIds: PORTFOLIOS.map((portfolio) => portfolio.id),
  })
  const PERFORMANCES = await LIST_PERFORMANCES.execute({
    positionIds: POSITIONS.map((position) => position.id),
  })

  return {
    performances: PERFORMANCES,
    positions: POSITIONS,
    portfolios: PORTFOLIOS,
    funds: FUNDS,
  }
}
