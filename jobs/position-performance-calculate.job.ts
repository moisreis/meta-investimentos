import "dotenv/config"

import { db } from "@/clients/database.client"
import { ApplicationRepository } from "@/infrastructure/application/repositories/application.repository"
import { FundRepository } from "@/infrastructure/fund/repositories/fund.repository"
import { NormRepository } from "@/infrastructure/norm/repositories/norm.repository"
import { NormsPortfoliosRepository } from "@/infrastructure/norms-portfolio/repositories/norms-portfolios.repository"
import { PositionRepository } from "@/infrastructure/position/repositories/position.repository"
import { PositionPerformanceRepository } from "@/infrastructure/position-performance/repositories/position-performance.repository"
import { QuotaRepository } from "@/infrastructure/quota/repositories/quota.repository"
import { WithdrawalRepository } from "@/infrastructure/withdrawal/repositories/withdrawal.repository"
import type { PositionPerformanceResponseDTO } from "@/services/position-performance/dto/position-performance-response.dto"
import { CalculatePositionPerformanceUseCase } from "@/services/position-performance/use-cases/calculate-position-performance.use-case"

// ---------------------------------
// TYPES
// ---------------------------------

/**
 * A single position × date calculation unit.
 */
export interface PositionPerformanceCalculationUnit {
  positionId: string
  date: Date
}

// ---------------------------------
// PLAN BUILDER
// ---------------------------------

/**
 * @summary
 * Builds the calculation plan for the given positions
 * and date range.
 *
 * @remarks
 * Enumerates every calendar day between the inclusive
 * start and end dates for each position. The plan is
 * pure and does not touch any external system.
 *
 * @explanation
 * Use this function in the server action to determine
 * how many calculation units the background job must
 * process. The result feeds the progress totals.
 *
 * @param input - The positions and the date boundaries.
 * @returns The calculation units.
 *
 * @example
 * const PLAN = buildPositionPerformanceCalculationPlan({
 *   positionIds: ["position-1"],
 *   from: START_DATE,
 *   to: END_DATE,
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function buildPositionPerformanceCalculationPlan(input: {
  positionIds: string[]
  from: Date
  to: Date
}): PositionPerformanceCalculationUnit[] {
  const DATES = enumerateDates(input.from, input.to)

  return input.positionIds.flatMap((positionId) =>
    DATES.map((date) => ({ positionId, date: new Date(date) }))
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
 * Instantiates the eight repositories and the use case,
 * then delegates to `execute`. This is the composition
 * root called by the background job.
 *
 * @explanation
 * Use this function to wire dependencies once per
 * invocation. Repositories are created fresh so no state
 * leaks between runs.
 *
 * @param input - The position and date to calculate.
 * @returns The calculated performance snapshot.
 *
 * @example
 * const RESULT = await runPositionPerformanceCalculation({
 *   positionId: "position-1",
 *   date: TARGET_DATE,
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function runPositionPerformanceCalculation(
  input: PositionPerformanceCalculationUnit
): Promise<PositionPerformanceResponseDTO> {
  const POSITION_REPO = new PositionRepository(db)
  const FUND_REPO = new FundRepository(db)
  const QUOTA_REPO = new QuotaRepository(db)
  const APPLICATION_REPO = new ApplicationRepository(db)
  const WITHDRAWAL_REPO = new WithdrawalRepository(db)
  const POSITION_PERFORMANCE_REPO =
    new PositionPerformanceRepository(db)
  const NORM_REPO = new NormRepository(db)
  const NORMS_PORTFOLIOS_REPO = new NormsPortfoliosRepository(db)

  const USE_CASE = new CalculatePositionPerformanceUseCase(
    POSITION_REPO,
    FUND_REPO,
    QUOTA_REPO,
    APPLICATION_REPO,
    WITHDRAWAL_REPO,
    POSITION_PERFORMANCE_REPO,
    NORM_REPO,
    NORMS_PORTFOLIOS_REPO
  )

  return USE_CASE.execute({
    positionId: input.positionId,
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
