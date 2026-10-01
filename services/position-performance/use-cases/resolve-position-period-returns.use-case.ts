import { calculateReturn } from "@domain/position/calculators/return.calculator"
import type { IPortfolio } from "@domain/portfolio/interfaces/portfolio.interface"
import type { IPosition } from "@domain/position/interfaces/position.interface"
import type { IPositionPerformance } from "@domain/position-performance/interfaces/position-performance.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"

import {
  ChainPeriodReturn,
  ResolvePeriodWindow,
} from "@/lib/performance/period-window.calculator"
import { toResponseDTO } from "../mappers/position-performance.mapper"

export interface ResolvePositionPeriodReturnsInput {
  positionId: string
  /** Owning user id; ownership is always enforced. */
  userId: string
  from: Date
  to: Date
}

// The period metrics of a position performance window.
export interface PositionPeriodReturnsDTO {
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
 * Resolves the period returns of a position performance
 * window.
 *
 * @remarks
 * Fetches the position, walks to its portfolio and rejects
 * it when that portfolio belongs to another user, lists the
 * daily snapshots of the position and chains the daily
 * growth factors of the year, month and selected window
 * horizons through the domain return calculator. The
 * business logic runs here, on the server, so the browser
 * never receives the domain formula.
 *
 * @explanation
 * Use this use case whenever a client needs the chained
 * returns of a position performance window.
 *
 * @param input - The position, its owning user and the
 *   inclusive window boundaries.
 *
 * @returns The chained year, month and window returns.
 *
 * @example
 * const RESULT = await USE_CASE.execute({
 *   positionId: "position-1",
 *   userId: "user-1",
 *   from: FROM_DATE,
 *   to: TO_DATE,
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-29
 */
export class ResolvePositionPeriodReturnsUseCase {
  constructor(
    private positionRepository: IPosition,
    private portfolioRepository: IPortfolio,
    private positionPerformanceRepository: IPositionPerformance
  ) {}

  /**
   * @summary
   * Resolves the chained period returns of the window.
   *
   * @remarks
   * Fetches the position, walks to its portfolio, rejects it
   * when that portfolio belongs to another user, lists the
   * daily snapshots of the position and chains the daily
   * growth factors of the year, month and window horizons
   * through the domain return calculator. The business logic
   * runs here, on the server, so the browser never receives
   * the domain formula.
   *
   * @explanation
   * Use this method whenever a client needs the chained
   * returns of a position performance window.
   *
   * @param input - The position, its owning user and the
   *   inclusive window boundaries.
   *
   * @returns The chained year, month and window returns.
   *
   * @example
   * const RESULT = await USE_CASE.execute({
   *   positionId: "position-1",
   *   userId: "user-1",
   *   from: FROM_DATE,
   *   to: TO_DATE,
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-29
   */
  async execute(
    input: ResolvePositionPeriodReturnsInput
  ): Promise<PositionPeriodReturnsDTO> {
    const POSITION = await this.positionRepository.findById(
      EntityId.create(input.positionId)
    )

    if (!POSITION || !POSITION.id) {
      throw new NotFoundError("`Position` not found.")
    }

    const PORTFOLIO = await this.portfolioRepository.findById(
      POSITION.portfolioId
    )

    if (!PORTFOLIO || PORTFOLIO.userId !== input.userId) {
      throw new NotFoundError("`Portfolio` not found.")
    }

    const PERFORMANCES =
      await this.positionPerformanceRepository.findAllByPositionId(
        POSITION.id
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
        calculateReturn
      ),
      monthReturn: ChainPeriodReturn(
        WINDOW.monthSeries,
        WINDOW.end?.returnMonthly ?? null,
        calculateReturn
      ),
      periodReturn: ChainPeriodReturn(
        WINDOW.inWindow,
        null,
        calculateReturn
      ),
    }
  }
}
