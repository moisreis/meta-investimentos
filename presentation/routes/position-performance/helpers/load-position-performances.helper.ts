import { RequireSessionUser } from "@/lib/auth/require-session"
import { PositionPerformanceContainer } from "@/presentation/composition/position-performance.container"
import { ToPositionPerformanceRows } from "@/presentation/mappers/position-performance-row.mapper"
import { ToPositionRows } from "@/presentation/mappers/position-row.mapper"
import { ToPortfolioRows } from "@/presentation/mappers/portfolio-row.mapper"
import { ToFundRows } from "@/presentation/mappers/fund-row.mapper"
import type { PositionPerformanceRow } from "@/presentation/types/position-performance-row.types"
import type { PositionRow } from "@/presentation/types/position-row.types"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"
import type { FundRow } from "@/presentation/types/fund-row.types"

// Data resolved by the position performance loader.
export interface LoadedPositionPerformanceList {
  performances: PositionPerformanceRow[]
  positions: PositionRow[]
  portfolios: PortfolioRow[]
  funds: FundRow[]
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
    performances: ToPositionPerformanceRows(PERFORMANCES),
    positions: ToPositionRows(POSITIONS),
    portfolios: ToPortfolioRows(PORTFOLIOS),
    funds: ToFundRows(FUNDS),
  }
}
