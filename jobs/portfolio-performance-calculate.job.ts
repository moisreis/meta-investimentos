import "dotenv/config"

import { db } from "@/clients/database.client"
import { ApplicationRepository } from "@/infrastructure/application/repositories/application.repository"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import { PortfolioPerformanceRepository } from "@/infrastructure/portfolio-performance/repositories/portfolio-performance.repository"
import { PositionRepository } from "@/infrastructure/position/repositories/position.repository"
import { PositionPerformanceRepository } from "@/infrastructure/position-performance/repositories/position-performance.repository"
import { QuotaRepository } from "@/infrastructure/quota/repositories/quota.repository"
import { WithdrawalRepository } from "@/infrastructure/withdrawal/repositories/withdrawal.repository"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"
import { CalculatePortfolioPerformanceUseCase } from "@/services/portfolio-performance/use-cases/calculate-portfolio-performance.use-case"

// ---------------------------------
// TYPES
// ---------------------------------

/**
 * A single portfolio × date calculation unit.
 */
export interface PortfolioPerformanceCalculationUnit {
  portfolioId: string
  date: Date
}

// ---------------------------------
// PLAN BUILDER
// ---------------------------------

/**
 * @summary
 * Builds the calculation plan for the given portfolios
 * and date range.
 *
 * @remarks
 * Enumerates every calendar day between the inclusive
 * start and end dates for each portfolio. The plan is
 * pure and does not touch any external system.
 *
 * @explanation
 * Use this function in the server action to determine
 * how many calculation units the background job must
 * process. The result feeds the progress totals.
 *
 * @param input - The portfolios and the date boundaries.
 * @returns The calculation units.
 *
 * @example
 * const PLAN = buildPerformanceCalculationPlan({
 *   portfolioIds: ["portfolio-1"],
 *   from: START_DATE,
 *   to: END_DATE,
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function buildPerformanceCalculationPlan(input: {
  portfolioIds: string[]
  from: Date
  to: Date
}): PortfolioPerformanceCalculationUnit[] {
  const DATES = enumerateDates(input.from, input.to)

  return input.portfolioIds.flatMap((portfolioId) =>
    DATES.map((date) => ({ portfolioId, date: new Date(date) }))
  )
}

// ---------------------------------
// COMPOSITION ROOT
// ---------------------------------

/**
 * @summary
 * Runs the performance calculation for a single unit.
 *
 * @remarks
 * Instantiates the seven repositories and the use case,
 * then delegates to `execute`. This is the composition
 * root called by the background job.
 *
 * @explanation
 * Use this function to wire dependencies once per
 * invocation. Repositories are created fresh so no state
 * leaks between runs.
 *
 * @param input - The portfolio and date to calculate.
 * @returns The calculated performance snapshot.
 *
 * @example
 * const RESULT = await runPortfolioPerformanceCalculation({
 *   portfolioId: "portfolio-1",
 *   date: TARGET_DATE,
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function runPortfolioPerformanceCalculation(
  input: PortfolioPerformanceCalculationUnit
): Promise<PortfolioPerformanceResponseDTO> {
  const PORTFOLIO_REPO = new PortfolioRepository(db)
  const POSITION_REPO = new PositionRepository(db)
  const QUOTA_REPO = new QuotaRepository(db)
  const APPLICATION_REPO = new ApplicationRepository(db)
  const WITHDRAWAL_REPO = new WithdrawalRepository(db)
  const POSITION_PERFORMANCE_REPO =
    new PositionPerformanceRepository(db)
  const PORTFOLIO_PERFORMANCE_REPO =
    new PortfolioPerformanceRepository(db)

  const USE_CASE = new CalculatePortfolioPerformanceUseCase(
    PORTFOLIO_REPO,
    POSITION_REPO,
    QUOTA_REPO,
    APPLICATION_REPO,
    WITHDRAWAL_REPO,
    POSITION_PERFORMANCE_REPO,
    PORTFOLIO_PERFORMANCE_REPO
  )

  return USE_CASE.execute({
    portfolioId: input.portfolioId,
    date: input.date.toISOString(),
  })
}

// ---------------------------------
// HELPERS
// ---------------------------------

// Enumerates every calendar day of the inclusive range.
function enumerateDates(from: Date, to: Date): Date[] {
  const DATES: Date[] = []

  const CURSOR = new Date(
    Date.UTC(
      from.getUTCFullYear(),
      from.getUTCMonth(),
      from.getUTCDate()
    )
  )
  const END = new Date(
    Date.UTC(
      to.getUTCFullYear(),
      to.getUTCMonth(),
      to.getUTCDate()
    )
  )

  while (CURSOR.getTime() <= END.getTime()) {
    DATES.push(new Date(CURSOR))
    CURSOR.setUTCDate(CURSOR.getUTCDate() + 1)
  }

  return DATES
}
