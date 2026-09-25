import { headers } from "next/headers"

import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import { ListPortfoliosUseCase } from "@/services/portfolio/use-cases/list-portfolios.use-case"

export interface LoadSessionPortfoliosOutput {
  userId: string
  portfolios: PortfolioResponseDTO[]
}

/**
 * @summary
 * Resolves the session user and their portfolios.
 *
 * @remarks
 * Fetches the session from the request headers, lists the
 * portfolios of the signed-in user, and returns both the
 * user id and the portfolio rows. Returns null when there
 * is no active session.
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
  const SESSION = await auth.api.getSession({
    headers: await headers(),
  })

  if (!SESSION?.user) return null

  const PORTFOLIO_REPOSITORY = new PortfolioRepository(db)
  const LIST_USE_CASE = new ListPortfoliosUseCase(
    PORTFOLIO_REPOSITORY
  )
  const PORTFOLIOS = await LIST_USE_CASE.execute({
    userId: SESSION.user.id,
  })

  return {
    userId: SESSION.user.id,
    portfolios: PORTFOLIOS,
  }
}
