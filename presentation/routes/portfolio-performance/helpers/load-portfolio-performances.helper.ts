import { RequireSessionUser } from "@/lib/auth/require-session"
import { PortfolioPerformanceContainer } from "@/presentation/composition/portfolio-performance.container"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"

// Data resolved by the performance list loader.
export interface LoadedPortfolioPerformanceList {
  performances: PortfolioPerformanceResponseDTO[]
  portfolios: PortfolioResponseDTO[]
}

/**
 * @summary
 * Resolves the session user, the user portfolios, and
 * the performance records calculated across those
 * portfolios.
 *
 * @remarks
 * Derives the acting user from the session, lists the
 * user portfolios and delegates the performance query to
 * the bulk lookup use case. Returns null when there is no
 * active session.
 *
 * @explanation
 * Use this helper from the page loader so the session
 * resolution and the registry listing stay in a single
 * composition point.
 *
 * @returns The loaded performance list, or `null`.
 *
 * @example
 * const LOADED = await LoadPortfolioPerformances();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function LoadPortfolioPerformances(): Promise<LoadedPortfolioPerformanceList | null> {
  const USER = await RequireSessionUser()

  if (!USER) return null

  const { list: LIST_PORTFOLIOS, listAll: LIST_PERFORMANCES } =
    PortfolioPerformanceContainer()

  const PORTFOLIOS = await LIST_PORTFOLIOS.execute({
    userId: USER.id,
  })
  const PERFORMANCES = await LIST_PERFORMANCES.execute({
    portfolioIds: PORTFOLIOS.map((portfolio) => portfolio.id),
  })

  return {
    performances: PERFORMANCES,
    portfolios: PORTFOLIOS,
  }
}
