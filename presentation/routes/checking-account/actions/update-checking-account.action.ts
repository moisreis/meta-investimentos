"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { CheckingAccountContainer } from "@/presentation/composition/checking-account.container"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/types/action-result"
import type { CheckingAccountResponseDTO } from "@/services/checking-account/dto/checking-account-response.dto"

import { UPDATE_CHECKING_ACCOUNT_SCHEMA } from "../validations/checking-account-actions.validation"

/**
 * @summary
 * Updates the value of an existing checking account.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the update use case.
 * The acting user is derived from the session, never from
 * the payload. Returns a human-readable error when
 * anything fails.
 *
 * @explanation
 * Use as the submit target of the edit checking account
 * form.
 *
 * @param input - The untrusted balance update payload.
 *
 * @returns The updated balance, or a failure result.
 *
 * @example
 * const RESULT = await updateCheckingAccountAction({
 *   checkingAccountId: "checking-account-1",
 *   value: "-1234.56",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function updateCheckingAccountAction(
  input: unknown
): Promise<ActionResult<CheckingAccountResponseDTO>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = UPDATE_CHECKING_ACCOUNT_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { update: UPDATE_CHECKING_ACCOUNT } =
      CheckingAccountContainer()
    const ENTRY = await UPDATE_CHECKING_ACCOUNT.execute(
      PARSED.data
    )

    return ActionSuccess(ENTRY)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível atualizar o saldo."
    )
  }
}
