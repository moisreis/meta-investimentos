"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { BankAccountContainer } from "@/presentation/composition/bank-account.container"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/types/action-result"

import { BULK_DELETE_BANK_ACCOUNTS_SCHEMA } from "../validations/bank-account-actions.validation"

/**
 * @summary
 * Deletes multiple bank accounts.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, including a non-empty cap on the selection,
 * and only then runs the bulk delete use case. The acting
 * user is derived from the session, never from the payload.
 * Returns a human-readable error when anything fails.
 *
 * @explanation
 * Use as the submit target of the bulk delete flow of
 * the bank account datatable.
 *
 * @param input - The untrusted bank account ids payload.
 *
 * @returns Nothing on success, or a failure result.
 *
 * @example
 * const RESULT = await bulkDeleteBankAccountsAction({
 *   bankAccountIds: ["bank-account-1", "bank-account-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function bulkDeleteBankAccountsAction(
  input: unknown
): Promise<ActionResult<undefined>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED =
    BULK_DELETE_BANK_ACCOUNTS_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { bulkDelete: BULK_DELETE_BANK_ACCOUNTS } =
      BankAccountContainer()

    await BULK_DELETE_BANK_ACCOUNTS.execute(PARSED.data)

    return ActionSuccess(undefined)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível excluir as contas."
    )
  }
}
