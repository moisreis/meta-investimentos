import { calculatePortfolioReturn } from "@domain/portfolio/calculators/return.calculator"
import type { IPortfolio } from "@domain/portfolio/interfaces/portfolio.interface"
import type { IPortfolioPerformance } from "@domain/portfolio-performance/interfaces/portfolio-performance.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId, GrowthFactor } from "@/value-objects"

import { ResolvePeriodWindow } from "../calculators/period-window.calculator"
import type { PortfolioPerformanceResponseDTO } from "../dto/portfolio-performance-response.dto"
import { toResponseDTO } from "../mappers/portfolio-performance.mapper"

export interface ResolvePortfolioPeriodReturnsInput {
  portfolioId: string
  /** Owning user id; ownership is always enforced. */
  userId: string
  from: Date
  to: Date
}

// The period metrics of a portfolio performance window.
export interface PortfolioPeriodReturnsDTO {
  // Chained year return, as an unmasked decimal string.
  // Null when the horizon cannot be resolved.
  yearReturn: string | null
  // Chained month return, as an unmasked decimal string.
  // Null when the horizon cannot be resolved.
  monthReturn: string | null
}

// Parses a numeric snapshot field to a finite amount.
function ToAmount(value: string | null | undefined): number {
  if (value === null || value === undefined) return 0
  const PARSED = Number.parseFloat(value)
  return Number.isFinite(PARSED) ? PARSED : 0
}

/**
 * @summary
 * Chains a horizon of daily returns into a period return.
 *
 * @remarks
 * Builds the growth factor of every daily return of the
 * series and hands them to the domain return calculator. A
 * horizon holding fewer than two usable daily returns falls
 * back to the trailing return stored on the closing
 * snapshot, and a horizon with no closing snapshot resolves
 * to `null`.
 *
 * @explanation
 * Use this function inside the period return use case. The
 * formula itself stays in the domain calculator, so the
 * delivery layer never reimplements the chaining.
 *
 * @param series - The snapshots of the horizon.
 * @param stored - The trailing return of the closing
 *   snapshot, used as the fallback.
 *
 * @returns The period return, or `null`.
 *
 * @example
 * const RESULT = ChainPeriodReturn(WINDOW.yearSeries, FALLBACK);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function ChainPeriodReturn(
  series: readonly PortfolioPerformanceResponseDTO[],
  stored: string | null
): string | null {
  const FACTORS: { value: GrowthFactor }[] = []

  for (const snapshot of series) {
    const FACTOR_VALUE = 1 + ToAmount(snapshot.returnDaily) / 100
    if (!Number.isFinite(FACTOR_VALUE) || FACTOR_VALUE < 0) {
      continue
    }
    FACTORS.push({ value: GrowthFactor.create(FACTOR_VALUE) })
  }

  if (FACTORS.length >= 2) {
    return calculatePortfolioReturn({
      dailyGrowthFactors: FACTORS,
    }).value.toString()
  }

  return stored === null ? null : String(ToAmount(stored))
}

/**
 * @summary
 * Resolves the period returns of a portfolio performance
 * window.
 *
 * @remarks
 * Fetches the portfolio, rejects it when it belongs to
 * another user, lists its daily snapshots and chains the
 * daily growth factors of the year and month horizons
 * through the domain return calculator. The business logic
 * runs here, on the server, so the browser never receives
 * the domain formula.
 *
 * @explanation
 * Use this use case whenever a client needs the chained
 * returns of a portfolio performance window.
 *
 * @param input - The portfolio, its owning user and the
 *   inclusive window boundaries.
 *
 * @returns The chained year and month returns.
 *
 * @example
 * const RESULT = await USE_CASE.execute({
 *   portfolioId: "portfolio-1",
 *   userId: "user-1",
 *   from: FROM_DATE,
 *   to: TO_DATE,
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export class ResolvePortfolioPeriodReturnsUseCase {
  constructor(
    private portfolioRepository: IPortfolio,
    private portfolioPerformanceRepository: IPortfolioPerformance
  ) {}

  /**
   * @summary
   * Resolves the chained period returns of the window.
   *
   * @remarks
   * Fetches the portfolio, rejects it when it belongs to
   * another user, lists its daily snapshots and chains the
   * daily growth factors of the year and month horizons
   * through the domain return calculator. The business logic
   * runs here, on the server, so the browser never receives
   * the domain formula.
   *
   * @explanation
   * Use this method whenever a client needs the chained
   * returns of a portfolio performance window.
   *
   * @param input - The portfolio, its owning user and the
   *   inclusive window boundaries.
   *
   * @returns The chained year and month returns.
   *
   * @example
   * const RESULT = await USE_CASE.execute({
   *   portfolioId: "portfolio-1",
   *   userId: "user-1",
   *   from: FROM_DATE,
   *   to: TO_DATE,
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-26
   */
  async execute(
    input: ResolvePortfolioPeriodReturnsInput
  ): Promise<PortfolioPeriodReturnsDTO> {
    const PORTFOLIO = await this.portfolioRepository.findById(
      EntityId.create(input.portfolioId)
    )

    if (!PORTFOLIO || PORTFOLIO.userId !== input.userId) {
      throw new NotFoundError("`Portfolio` not found.")
    }

    if (!PORTFOLIO.id) {
      throw new NotFoundError("`Portfolio` not found.")
    }

    const PERFORMANCES =
      await this.portfolioPerformanceRepository.findAllByPortfolioId(
        PORTFOLIO.id
      )

    const DTOs = PERFORMANCES.map((entity) =>
      toResponseDTO(entity)
    )

    const WINDOW = ResolvePeriodWindow(
      DTOs,
      input.from,
      input.to
    )

    return {
      yearReturn: ChainPeriodReturn(
        WINDOW.yearSeries,
        WINDOW.end?.returnYearly ?? null
      ),
      monthReturn: ChainPeriodReturn(
        WINDOW.monthSeries,
        WINDOW.end?.returnMonthly ?? null
      ),
    }
  }
}
