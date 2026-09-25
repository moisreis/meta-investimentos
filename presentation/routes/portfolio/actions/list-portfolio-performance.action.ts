"use server"

import { headers } from "next/headers"

import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { PortfolioPerformanceRepository } from "@/infrastructure/portfolio-performance/repositories/portfolio-performance.repository"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"
import { ListPortfolioPerformanceByRangeUseCase } from "@/services/portfolio-performance/use-cases/list-portfolio-performance-by-range.use-case"
import { ListPortfoliosUseCase } from "@/services/portfolio/use-cases/list-portfolios.use-case"

export interface ListPortfolioPerformanceActionInput {
  from: string
  to: string
}

export interface ListPortfolioPerformanceActionOutput {
  data: PortfolioPerformanceResponseDTO[] | null
  error?: string | null
}

/**
 * @summary
 * Lists the portfolio performances within a date range.
 *
 * @remarks
 * Resolves the session user id from the request headers,
 * lists the user portfolios, and returns the latest
 * `portfolio_performance` snapshot of each portfolio that
 * falls inside `[from, to]`. The boundaries are UTC day
 * keys (`YYYY-MM-DD`) mapped to UTC midnight and the last
 * millisecond of the day.
 *
 * @explanation
 * Use as the fetch target of the portfolio date range
 * filter. The range never crosses user boundaries because
 * the action scopes the query to the signed-in user.
 *
 * @param input - The inclusive day boundaries.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await listPortfolioPerformanceAction({
 *   from: "2026-09-01",
 *   to: "2026-09-30",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function listPortfolioPerformanceAction(
  input: ListPortfolioPerformanceActionInput
): Promise<ListPortfolioPerformanceActionOutput> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { data: null, error: "Faça login para continuar." }
    }

    const PORTFOLIO_REPOSITORY = new PortfolioRepository(db)
    const LIST_USE_CASE = new ListPortfoliosUseCase(
      PORTFOLIO_REPOSITORY
    )
    const PORTFOLIOS = await LIST_USE_CASE.execute({
      userId: SESSION.user.id,
    })

    const PERFORMANCE_REPOSITORY =
      new PortfolioPerformanceRepository(db)
    const RANGE_USE_CASE =
      new ListPortfolioPerformanceByRangeUseCase(
        PERFORMANCE_REPOSITORY
      )

    const DATA = await RANGE_USE_CASE.execute({
      portfolioIds: PORTFOLIOS.map((portfolio) => portfolio.id),
      from: new Date(`${input.from}T00:00:00.000Z`),
      to: new Date(`${input.to}T23:59:59.999Z`),
    })

    return { data: DATA, error: null }
  } catch (cause) {
    return {
      data: null,
      error: "Não foi possível carregar o desempenho.",
    }
  }
}
