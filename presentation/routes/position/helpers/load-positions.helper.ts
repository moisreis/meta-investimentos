import { RequireSessionUser } from "@/lib/auth/require-session"
import { PositionContainer } from "@/presentation/composition/position.container"
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import type { PositionResponseDTO } from "@/services/position/dto/position-response.dto"

// Data resolved by the position list loader.
export interface LoadedPositionList {
  positions: PositionResponseDTO[]
  portfolios: PortfolioResponseDTO[]
  funds: FundResponseDTO[]
}

/**
 * @summary
 * Resolves the session user, the user portfolios, the
 * registered funds, and the positions held across those
 * portfolios.
 *
 * @remarks
 * Derives the acting user from the session, lists the
 * user portfolios and every fund, and delegates the
 * position query to the bulk lookup use case. Returns
 * null when there is no active session.
 *
 * @explanation
 * Use this helper from the page loader so the session
 * resolution and the registry listing stay in a single
 * composition point.
 *
 * @returns The loaded position list, or `null`.
 *
 * @example
 * const LOADED = await LoadPositions();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function LoadPositions(): Promise<LoadedPositionList | null> {
  const USER = await RequireSessionUser()

  if (!USER) return null

  const {
    list: LIST_PORTFOLIOS,
    listAll: LIST_POSITIONS,
    listFunds: LIST_FUNDS,
  } = PositionContainer()

  const PORTFOLIOS = await LIST_PORTFOLIOS.execute({
    userId: USER.id,
  })
  const FUNDS = await LIST_FUNDS.execute({})
  const POSITIONS = await LIST_POSITIONS.execute({
    portfolioIds: PORTFOLIOS.map((portfolio) => portfolio.id),
  })

  return {
    positions: POSITIONS,
    portfolios: PORTFOLIOS,
    funds: FUNDS,
  }
}
