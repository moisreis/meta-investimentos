"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { BankContainer } from "@/presentation/composition/bank.container"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/types/action-result"

import { DELETE_BANK_SCHEMA } from "../validations/bank-actions.validation"

/**
 * @summary
 * Deletes a bank.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the delete use case. The
 * acting user is derived from the session, never from the
 * payload. Returns a human-readable error when anything
 * fails.
 *
 * @explanation
 * Use as the submit target of the single-row delete flow
 * of the bank datatable.
 *
 * @param input - The untrusted bank id payload.
 *
 * @returns Nothing on success, or a failure result.
 *
 * @example
 * const RESULT = await deleteBankAction({ bankId: "bank-1" });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function deleteBankAction(
  input: unknown
): Promise<ActionResult<undefined>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = DELETE_BANK_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { remove: REMOVE_BANK } = BankContainer()

    await REMOVE_BANK.execute(PARSED.data)

    return ActionSuccess(undefined)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível excluir o banco."
    )
  }
}
