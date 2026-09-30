"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { PositionContainer } from "@/presentation/composition/position.container"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/types/action-result"
import type { PositionPeriodReturnsDTO } from "@/services/position-performance/use-cases/resolve-position-period-returns.use-case"

import { GET_POSITION_PERIOD_RETURNS_SCHEMA } from "../validations/position-actions.validation"

// Closes the `to` boundary on the last millisecond of the
// UTC day, so a snapshot of that day is inside the window.
const END_OF_DAY = "T23:59:59.999Z"

// Opens the `from` boundary on the first millisecond of the
// UTC day.
const START_OF_DAY = "T00:00:00.000Z"

/**
 * @summary
 * Resolves the chained period returns of a position
 * performance window.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then chains the daily growth
 * factors of a position owned by the acting user through
 * the domain return calculator. The position id comes from
 * the payload but the ownership is enforced against the
 * session, so a range of another user is never resolved.
 * The chaining runs here, on the server, so the browser
 * never receives the domain formula.
 *
 * @explanation
 * Use as the fetch target of the date range filter of the
 * position detail screen, whose year, month and window
 * returns depend on it.
 *
 * @param input - The untrusted position id and the
 *   inclusive day boundaries.
 *
 * @returns The chained year, month and window returns, or a
 *          failure result.
 *
 * @example
 * const RESULT = await getPositionPeriodReturnsAction({
 *   positionId: "position-1",
 *   from: "2026-09-01",
 *   to: "2026-09-30",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export async function getPositionPeriodReturnsAction(
  input: unknown
): Promise<ActionResult<PositionPeriodReturnsDTO>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED =
    GET_POSITION_PERIOD_RETURNS_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { resolvePeriodReturns: RESOLVE_PERIOD_RETURNS } =
      PositionContainer()

    const RETURNS = await RESOLVE_PERIOD_RETURNS.execute({
      positionId: PARSED.data.positionId,
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
