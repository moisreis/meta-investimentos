import { calculatePortfolioReturn } from "@domain/portfolio/calculators/return.calculator"
import type { IPortfolio } from "@domain/portfolio/interfaces/portfolio.interface"
import type { IPortfolioPerformance } from "@domain/portfolio-performance/interfaces/portfolio-performance.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"

import {
  ChainPeriodReturn,
  ResolvePeriodWindow,
} from "../calculators/period-window.calculator"
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
  // Chained return of the selected window itself, as an
  // unmasked decimal string. Null when the window holds
  // fewer than two usable daily returns: an arbitrary window
  // has no trailing return stored on the closing snapshot, so
  // there is nothing honest to fall back to.
  periodReturn: string | null
}

/**
 * @summary
 * Resolves the period returns of a portfolio performance
 * window.
 *
 * @remarks
 * Fetches the portfolio, rejects it when it belongs to
 * another user, lists its daily snapshots and chains the
 * daily growth factors of the year, month and selected
 * window horizons through the domain return calculator. The
 * business logic runs here, on the server, so the browser
 * never receives the domain formula.
 *
 * @explanation
 * Use this use case whenever a client needs the chained
 * returns of a portfolio performance window.
 *
 * @param input - The portfolio, its owning user and the
 *   inclusive window boundaries.
 *
 * @returns The chained year, month and window returns.
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
   * @returns The chained year, month and window returns.
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
        WINDOW.end?.returnYearly ?? null,
        calculatePortfolioReturn
      ),
      monthReturn: ChainPeriodReturn(
        WINDOW.monthSeries,
        WINDOW.end?.returnMonthly ?? null,
        calculatePortfolioReturn
      ),
      periodReturn: ChainPeriodReturn(
        WINDOW.inWindow,
        null,
        calculatePortfolioReturn
      ),
    }
  }
}
