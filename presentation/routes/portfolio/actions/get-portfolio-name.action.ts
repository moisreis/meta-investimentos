"use server"

import { headers } from "next/headers"

import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import { GetPortfolioUseCase } from "@/services/portfolio/use-cases/get-portfolio.use-case"

/**
 * @summary
 * Resolves the display name of a portfolio by its id.
 *
 * @remarks
 * Resolves the session user from the request headers and
 * fetches the portfolio through the service use case.
 * Returns null when there is no session or the portfolio
 * cannot be found.
 *
 * @explanation
 * Use as the resolver of the dynamic breadcrumb segment
 * of the portfolio detail route.
 *
 * @param portfolioId - The portfolio id to resolve.
 *
 * @returns The portfolio name or `null`.
 *
 * @example
 * const RESULT = await getPortfolioNameAction("portfolio-1");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function getPortfolioNameAction(
  portfolioId: string
): Promise<{ name: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) return { name: null }

    const REPOSITORY = new PortfolioRepository(db)
    const USE_CASE = new GetPortfolioUseCase(REPOSITORY)
    const PORTFOLIO = await USE_CASE.execute({
      portfolioId,
    })

    return { name: PORTFOLIO.name }
  } catch {
    return { name: null }
  }
}
