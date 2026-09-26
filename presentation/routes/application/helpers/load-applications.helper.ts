import { RequireSessionUser } from "@/lib/auth/require-session"
import { ApplicationContainer } from "@/presentation/composition/application.container"
import type { ApplicationResponseDTO } from "@/services/application/dto/application-response.dto"
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import type { PositionResponseDTO } from "@/services/position/dto/position-response.dto"

// Data resolved by the application list loader.
export interface LoadedApplicationList {
  applications: ApplicationResponseDTO[]
  portfolios: PortfolioResponseDTO[]
  funds: FundResponseDTO[]
  positions: PositionResponseDTO[]
}

/**
 * @summary
 * Resolves the session user, the user portfolios, the
 * registered funds, and the applications recorded across
 * the positions of those portfolios.
 *
 * @remarks
 * Derives the acting user from the session, lists the
 * portfolios of that user and every fund, resolves the
 * positions of those portfolios, and delegates the
 * application query to the bulk lookup use case. Every read
 * goes through the container, so the delivery layer never
 * touches a repository. Returns null when there is no
 * active session.
 *
 * @explanation
 * Use this helper from the page loader so the session
 * resolution and the registry listing stay in a single
 * composition point.
 *
 * @returns The loaded application list, or `null`.
 *
 * @example
 * const LOADED = await LoadApplications();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function LoadApplications(): Promise<LoadedApplicationList | null> {
  const USER = await RequireSessionUser()

  if (!USER) return null

  const {
    listAllApplications: LIST_ALL_APPLICATIONS,
    listAllPositions: LIST_ALL_POSITIONS,
    listFunds: LIST_FUNDS,
    listPortfolios: LIST_PORTFOLIOS,
  } = ApplicationContainer()

  const PORTFOLIOS = await LIST_PORTFOLIOS.execute({
    userId: USER.id,
  })
  const FUNDS = await LIST_FUNDS.execute({})
  const POSITIONS = await LIST_ALL_POSITIONS.execute({
    portfolioIds: PORTFOLIOS.map((portfolio) => portfolio.id),
  })
  const APPLICATIONS = await LIST_ALL_APPLICATIONS.execute({
    positionIds: POSITIONS.map((position) => position.id),
  })

  return {
    applications: APPLICATIONS,
    portfolios: PORTFOLIOS,
    funds: FUNDS,
    positions: POSITIONS,
  }
}
