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

import { DELETE_CHECKING_ACCOUNT_SCHEMA } from "../validations/checking-account-actions.validation"

/**
 * @summary
 * Deletes an existing checking account balance.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the delete use case. The
 * acting user is derived from the session, never from the
 * payload. Returns a human-readable error when anything
 * fails.
 *
 * @explanation
 * Use as the submit target of the confirm-delete dialog.
 *
 * @param input - The untrusted balance id payload.
 *
 * @returns Nothing on success, or a failure result.
 *
 * @example
 * const RESULT = await deleteCheckingAccountAction({
 *   checkingAccountId: "checking-account-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function deleteCheckingAccountAction(
  input: unknown
): Promise<ActionResult<undefined>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = DELETE_CHECKING_ACCOUNT_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { remove: REMOVE_CHECKING_ACCOUNT } =
      CheckingAccountContainer()

    await REMOVE_CHECKING_ACCOUNT.execute(PARSED.data)

    return ActionSuccess(undefined)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível excluir o saldo."
    )
  }
}
