import { headers } from "next/headers"

import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import { PortfolioPerformanceRepository } from "@/infrastructure/portfolio-performance/repositories/portfolio-performance.repository"
import { GetPortfolioUseCase } from "@/services/portfolio/use-cases/get-portfolio.use-case"
import { ListPortfolioPerformanceUseCase } from "@/services/portfolio-performance/use-cases/list-portfolio-performance.use-case"

import type { PortfolioOverviewData } from "../types/portfolio-overview.types"

/**
 * @summary
 * Resolves the portfolio detail screen data.
 *
 * @remarks
 * Fetches the session from the request headers, loads the
 * portfolio and rejects when it belongs to another user.
 * The daily snapshots of the portfolio are listed through
 * the service use case and the distinct UTC day keys are
 * derived from their dates. Returns null when there is no
 * session, the portfolio is missing, or the portfolio is
 * not owned by the session user.
 *
 * @explanation
 * Use this helper from the page loader so the session
 * resolution, the ownership check and the snapshot
 * listing stay in a single composition point.
 *
 * @param portfolioId - The portfolio id to resolve.
 *
 * @returns The overview data, or `null`.
 *
 * @example
 * const DATA = await LoadPortfolioOverview("portfolio-1");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function LoadPortfolioOverview(
  portfolioId: string
): Promise<PortfolioOverviewData | null> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) return null

    const PORTFOLIO_REPOSITORY = new PortfolioRepository(db)
    const GET_USE_CASE = new GetPortfolioUseCase(
      PORTFOLIO_REPOSITORY
    )
    const PORTFOLIO = await GET_USE_CASE.execute({
      portfolioId,
    })

    if (PORTFOLIO.userId !== SESSION.user.id) return null

    const PERFORMANCE_REPOSITORY =
      new PortfolioPerformanceRepository(db)
    const LIST_USE_CASE = new ListPortfolioPerformanceUseCase(
      PERFORMANCE_REPOSITORY
    )
    const PERFORMANCES = await LIST_USE_CASE.execute({
      portfolioId,
    })

    const AVAILABLE_DATES = [
      ...new Set(
        PERFORMANCES.map((performance) =>
          performance.date.slice(0, 10)
        )
      ),
    ].sort()

    return {
      performances: PERFORMANCES,
      availableDates: AVAILABLE_DATES,
    }
  } catch {
    return null
  }
}
