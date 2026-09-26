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
import type { PortfolioPeriodReturnsDTO } from "@/services/portfolio-performance/use-cases/resolve-portfolio-period-returns.use-case"

import { GET_PORTFOLIO_PERIOD_RETURNS_SCHEMA } from "../validations/portfolio-actions.validation"

// Closes the `to` boundary on the last millisecond of the
// UTC day, so a snapshot of that day is inside the window.
const END_OF_DAY = "T23:59:59.999Z"

// Opens the `from` boundary on the first millisecond of the
// UTC day.
const START_OF_DAY = "T00:00:00.000Z"

/**
 * @summary
 * Resolves the chained period returns of a portfolio
 * performance window.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then chains the daily growth
 * factors of a portfolio owned by the acting user through
 * the domain return calculator. The portfolio id comes from
 * the payload but the ownership is enforced against the
 * session, so a range of another user is never resolved.
 * The chaining runs here, on the server, so the browser
 * never receives the domain formula.
 *
 * @explanation
 * Use as the fetch target of the date range filter of the
 * portfolio detail screen, whose year and month return
 * cards depend on it.
 *
 * @param input - The untrusted portfolio id and the
 *   inclusive day boundaries.
 *
 * @returns The chained year and month returns, or a
 *          failure result.
 *
 * @example
 * const RESULT = await getPortfolioPeriodReturnsAction({
 *   portfolioId: "portfolio-1",
 *   from: "2026-09-01",
 *   to: "2026-09-30",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export async function getPortfolioPeriodReturnsAction(
  input: unknown
): Promise<ActionResult<PortfolioPeriodReturnsDTO>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED =
    GET_PORTFOLIO_PERIOD_RETURNS_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { resolvePeriodReturns: RESOLVE_PERIOD_RETURNS } =
      PortfolioContainer()

    const RETURNS = await RESOLVE_PERIOD_RETURNS.execute({
      portfolioId: PARSED.data.portfolioId,
      userId: USER.id,
      from: new Date(`${PARSED.data.from}${START_OF_DAY}`),
      to: new Date(`${PARSED.data.to}${END_OF_DAY}`),
    })

    return ActionSuccess(RETURNS)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível calcular os rendimentos."
    )
  }
}
