"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { PortfolioContainer } from "@/presentation/composition/portfolio.container"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/types/action-result"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"

import { LIST_PORTFOLIO_PERFORMANCE_SCHEMA } from "../validations/portfolio-actions.validation"

// Closes the `to` boundary on the last millisecond of the
// UTC day, so a snapshot of that day is inside the range.
const END_OF_DAY = "T23:59:59.999Z"

// Opens the `from` boundary on the first millisecond of the
// UTC day.
const START_OF_DAY = "T00:00:00.000Z"

/**
 * @summary
 * Lists the portfolio performances within a date range.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then lists the portfolios of the
 * acting user and the latest `portfolio_performance`
 * snapshot of each one that falls inside `[from, to]`. The
 * boundaries are UTC day keys (`YYYY-MM-DD`) mapped to UTC
 * midnight and to the last millisecond of the day. The
 * range never crosses user boundaries because the ids come
 * from the session, never from the payload.
 *
 * @explanation
 * Use as the fetch target of the portfolio date range
 * filter.
 *
 * @param input - The untrusted inclusive day boundaries.
 *
 * @returns The latest snapshots in the range, or a failure
 *          result.
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
  input: unknown
): Promise<ActionResult<PortfolioPerformanceResponseDTO[]>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED =
    LIST_PORTFOLIO_PERFORMANCE_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const {
      list: LIST_PORTFOLIOS,
      listPerformanceByRange: LIST_RANGE,
    } = PortfolioContainer()

    const PORTFOLIOS = await LIST_PORTFOLIOS.execute({
      userId: USER.id,
    })

    if (PORTFOLIOS.length === 0) {
      return ActionSuccess([])
    }

    const DATA = await LIST_RANGE.execute({
      portfolioIds: PORTFOLIOS.map((portfolio) => portfolio.id),
      from: new Date(`${PARSED.data.from}${START_OF_DAY}`),
      to: new Date(`${PARSED.data.to}${END_OF_DAY}`),
    })

    return ActionSuccess(DATA)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível carregar o desempenho."
    )
  }
}
