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

import { BULK_DELETE_PORTFOLIOS_SCHEMA } from "../validations/portfolio-actions.validation"

/**
 * @summary
 * Deletes multiple portfolios owned by the signed-in user.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, including a non-empty cap on the selection,
 * and only then runs the bulk delete use case with the user
 * id taken from the session, never from the payload. Rows of
 * another user are silently skipped by the use case.
 *
 * @explanation
 * Use as the submit target of the bulk delete flow of the
 * portfolio datatable.
 *
 * @param input - The untrusted portfolio ids payload.
 *
 * @returns Nothing on success, or a failure result.
 *
 * @example
 * const RESULT = await bulkDeletePortfoliosAction({
 *   portfolioIds: ["portfolio-1", "portfolio-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
export async function bulkDeletePortfoliosAction(
  input: unknown
): Promise<ActionResult<undefined>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = BULK_DELETE_PORTFOLIOS_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { bulkDelete: BULK_DELETE_PORTFOLIOS } =
      PortfolioContainer()

    await BULK_DELETE_PORTFOLIOS.execute({
      ...PARSED.data,
      userId: USER.id,
    })

    return ActionSuccess(undefined)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível excluir as carteiras."
    )
  }
}
