"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/presenters/action-result.presenter"
import { WithdrawalContainer } from "@/presentation/composition/withdrawal.container"

import { REVERSE_WITHDRAWAL_SCHEMA } from "../validations/withdrawal-actions.validation"

/**
 * @summary
 * Reverses a withdrawal.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the reverse use case.
 * The acting user is derived from the session, never from
 * the payload. Returns a human-readable error when
 * anything fails.
 *
 * @explanation
 * Use as the submit target of the single-row reverse
 * flow of the withdrawal datatable. A reversed
 * withdrawal is marked as estornado and stops counting
 * toward the position, instead of being erased.
 *
 * @param input - The untrusted withdrawal id payload.
 *
 * @returns Nothing on success, or a failure result.
 *
 * @example
 * const RESULT = await reverseWithdrawalAction({
 *   withdrawalId: "withdrawal-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export async function reverseWithdrawalAction(
  input: unknown
): Promise<ActionResult<undefined>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = REVERSE_WITHDRAWAL_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { reverse: REVERSE_WITHDRAWAL } = WithdrawalContainer()

    await REVERSE_WITHDRAWAL.execute({
      withdrawalId: PARSED.data.withdrawalId,
      reversedByUserId: USER.id,
    })

    return ActionSuccess(undefined)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível reverter o resgate."
    )
  }
}
