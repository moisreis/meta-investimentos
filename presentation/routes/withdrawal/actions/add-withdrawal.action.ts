"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { WithdrawalContainer } from "@/presentation/composition/withdrawal.container"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/types/action-result"
import type { WithdrawalResponseDTO } from "@/services/withdrawal/dto/withdrawal-response.dto"

import { ADD_WITHDRAWAL_SCHEMA } from "../validations/withdrawal-actions.validation"

/**
 * @summary
 * Records a withdrawal in a position.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the add withdrawal use
 * case. The acting user is derived from the session, never
 * from the payload. The amount is checked as a positive
 * money value and the action never receives a quota value:
 * the use case resolves the fund of the position and
 * derives the quotas from the quota price of the given date.
 * Returns a human-readable error when anything fails.
 *
 * @explanation
 * Use as the submit target of the add withdrawal form.
 *
 * @param input - The untrusted withdrawal creation payload.
 *
 * @returns The recorded withdrawal, or a failure result.
 *
 * @example
 * const RESULT = await addWithdrawalAction({
 *   positionId: "position-1",
 *   date: "2026-01-10",
 *   amount: "500",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function addWithdrawalAction(
  input: unknown
): Promise<ActionResult<WithdrawalResponseDTO>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = ADD_WITHDRAWAL_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { add: ADD_WITHDRAWAL } = WithdrawalContainer()
    const WITHDRAWAL = await ADD_WITHDRAWAL.execute(PARSED.data)

    return ActionSuccess(WITHDRAWAL)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível registrar o resgate."
    )
  }
}
