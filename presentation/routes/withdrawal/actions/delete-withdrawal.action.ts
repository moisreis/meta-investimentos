"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { WithdrawalContainer } from "@/presentation/composition/withdrawal.container"
import { ActionAudited } from "@/presentation/parts/audit/shared-log-action.helper"
import {
  ActionFailure,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/presenters/action-result.presenter"

import { DELETE_WITHDRAWAL_SCHEMA } from "../validations/withdrawal-actions.validation"

/**
 * @summary
 * Deletes a withdrawal.
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
 * flow of the withdrawal datatable.
 *
 * @param input - The untrusted withdrawal id payload.
 *
 * @returns Nothing on success, or a failure result.
 *
 * @example
 * const RESULT = await deleteWithdrawalAction({
 *   withdrawalId: "withdrawal-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export async function deleteWithdrawalAction(
  input: unknown
): Promise<ActionResult<undefined>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = DELETE_WITHDRAWAL_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { delete: DELETE_WITHDRAWAL } = WithdrawalContainer()

    await DELETE_WITHDRAWAL.execute(PARSED.data)

    return ActionAudited(undefined, {
      userId: USER.id,
      action: "DELETED",
      entity: "Withdrawal",
      entityId: PARSED.data.withdrawalId,
    })
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível excluir o resgate."
    )
  }
}
