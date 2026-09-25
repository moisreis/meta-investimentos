"use server"

import { db } from "@/clients/database.client"
import { PortfolioPerformanceRepository } from "@/infrastructure/portfolio-performance/repositories/portfolio-performance.repository"
import { LoadSessionPortfolios } from "@/presentation/routes/portfolio/helpers/load-session-portfolios.helper"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"
import { ListPortfolioPerformanceByRangeUseCase } from "@/services/portfolio-performance/use-cases/list-portfolio-performance-by-range.use-case"

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
 * Resolves the session user and the user portfolios
 * through the shared loader, then returns the latest
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
    const SESSION_BUNDLE = await LoadSessionPortfolios()

    if (!SESSION_BUNDLE) {
      return { data: null, error: "Faça login para continuar." }
    }

    const { portfolios: PORTFOLIOS } = SESSION_BUNDLE

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
