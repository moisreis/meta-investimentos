import { RequireSessionUser } from "@/lib/auth/require-session"
import { PositionContainer } from "@/presentation/composition/position.container"
import { ToPositionRows } from "@/presentation/mappers/position-row.mapper"
import { ToPortfolioRows } from "@/presentation/mappers/portfolio-row.mapper"
import { ToFundRows } from "@/presentation/mappers/fund-row.mapper"
import type { PositionRow } from "@/presentation/types/position-row.types"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"
import type { FundRow } from "@/presentation/types/fund-row.types"

// Data resolved by the position list loader.
export interface LoadedPositionList {
  positions: PositionRow[]
  portfolios: PortfolioRow[]
  funds: FundRow[]
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
    positions: ToPositionRows(POSITIONS),
    portfolios: ToPortfolioRows(PORTFOLIOS),
    funds: ToFundRows(FUNDS),
  }
}
