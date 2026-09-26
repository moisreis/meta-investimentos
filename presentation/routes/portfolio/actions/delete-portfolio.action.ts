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

import { DELETE_PORTFOLIO_SCHEMA } from "../validations/portfolio-actions.validation"

/**
 * @summary
 * Deletes a portfolio owned by the signed-in user.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the delete use case with
 * the user id taken from the session, never from the
 * payload. Ownership is enforced by the use case, so a
 * portfolio of another user is reported as missing.
 *
 * @explanation
 * Use as the submit target of the single-row delete flow
 * of the portfolio datatable.
 *
 * @param input - The untrusted portfolio id payload.
 *
 * @returns Nothing on success, or a failure result.
 *
 * @example
 * const RESULT = await deletePortfolioAction({
 *   portfolioId: "portfolio-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
export async function deletePortfolioAction(
  input: unknown
): Promise<ActionResult<undefined>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = DELETE_PORTFOLIO_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { remove: REMOVE_PORTFOLIO } = PortfolioContainer()

    await REMOVE_PORTFOLIO.execute({
      ...PARSED.data,
      userId: USER.id,
    })

    return ActionSuccess(undefined)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível excluir a carteira."
    )
  }
}
