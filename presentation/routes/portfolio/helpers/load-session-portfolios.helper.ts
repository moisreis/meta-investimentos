import { RequireSessionUser } from "@/lib/auth/require-session"
import { PortfolioContainer } from "@/presentation/composition/portfolio.container"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

export interface LoadSessionPortfoliosOutput {
  userId: string
  portfolios: PortfolioResponseDTO[]
}

/**
 * @summary
 * Resolves the session user and their portfolios.
 *
 * @remarks
 * Resolves the session through the shared auth helper, lists
 * the portfolios of the signed-in user through the
 * container, and returns both the user id and the portfolio
 * rows. Returns null when there is no active session.
 *
 * @explanation
 * Use this helper from the page loader and the server
 * actions so the session resolution and the portfolio
 * listing stay in a single composition point.
 *
 * @returns The user id and portfolios, or `null`.
 *
 * @example
 * const BUNDLE = await LoadSessionPortfolios();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function LoadSessionPortfolios(): Promise<LoadSessionPortfoliosOutput | null> {
  const USER = await RequireSessionUser()

  if (!USER) return null

  const { list: LIST_PORTFOLIOS } = PortfolioContainer()
  const PORTFOLIOS = await LIST_PORTFOLIOS.execute({
    userId: USER.id,
  })

  return {
    userId: USER.id,
    portfolios: PORTFOLIOS,
  }
}
