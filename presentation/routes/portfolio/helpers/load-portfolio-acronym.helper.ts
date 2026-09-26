import { RequireSessionUser } from "@/lib/auth/require-session"
import { PortfolioContainer } from "@/presentation/composition/portfolio.container"

/**
 * @summary
 * Resolves the acronym of a portfolio by its id.
 *
 * @remarks
 * Resolves the session user through the shared auth helper
 * and fetches the portfolio through the container. Returns
 * null when there is no session or the portfolio cannot be
 * found.
 *
 * @explanation
 * Use as the resolver of the dynamic metadata title of
 * the portfolio detail route.
 *
 * @param portfolioId - The portfolio id to resolve.
 *
 * @returns The portfolio acronym or `null`.
 *
 * @example
 * const ACRONYM = await LoadPortfolioAcronym("portfolio-1");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function LoadPortfolioAcronym(
  portfolioId: string
): Promise<string | null> {
  try {
    const USER = await RequireSessionUser()

    if (!USER) return null

    const { get: GET_PORTFOLIO } = PortfolioContainer()
    const PORTFOLIO = await GET_PORTFOLIO.execute({
      portfolioId,
    })

    return PORTFOLIO.acronym
  } catch {
    return null
  }
}
