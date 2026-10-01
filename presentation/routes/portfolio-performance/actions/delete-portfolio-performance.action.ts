"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { PortfolioPerformanceContainer } from "@/presentation/composition/portfolio-performance.container"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/presenters/action-result.presenter"

import { DELETE_PORTFOLIO_PERFORMANCE_SCHEMA } from "../validations/portfolio-performance-actions.validation"

/**
 * @summary
 * Deletes a portfolio performance.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the delete use case. The
 * acting user is derived from the session, never from the
 * payload. Returns a human-readable error when anything
 * fails.
 *
 * @explanation
 * Use as the submit target of the single-row delete
 * flow of the portfolio performance datatable.
 *
 * @param input - The untrusted performance id payload.
 *
 * @returns Nothing on success, or a failure result.
 *
 * @example
 * const RESULT = await deletePortfolioPerformanceAction({
 *   performanceId: "performance-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export async function deletePortfolioPerformanceAction(
  input: unknown
): Promise<ActionResult<undefined>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED =
    DELETE_PORTFOLIO_PERFORMANCE_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { delete: DELETE_PORTFOLIO_PERFORMANCE } =
      PortfolioPerformanceContainer()

    await DELETE_PORTFOLIO_PERFORMANCE.execute(PARSED.data)

    return ActionSuccess(undefined)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível excluir a performance."
    )
  }
}
