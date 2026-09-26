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

import { BULK_DELETE_CHECKING_ACCOUNTS_SCHEMA } from "../validations/checking-account-actions.validation"

/**
 * @summary
 * Deletes multiple checking account balances.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, including a non-empty cap on the selection,
 * and only then runs the bulk delete use case. The acting
 * user is derived from the session, never from the payload.
 * Returns a human-readable error when anything fails.
 *
 * @explanation
 * Use as the submit target of the datatable bulk delete
 * flow.
 *
 * @param input - The untrusted balance ids payload.
 *
 * @returns Nothing on success, or a failure result.
 *
 * @example
 * const RESULT = await bulkDeleteCheckingAccountsAction({
 *   checkingAccountIds: ["entry-1", "entry-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function bulkDeleteCheckingAccountsAction(
  input: unknown
): Promise<ActionResult<undefined>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED =
    BULK_DELETE_CHECKING_ACCOUNTS_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { bulkDelete: BULK_DELETE_CHECKING_ACCOUNTS } =
      CheckingAccountContainer()

    await BULK_DELETE_CHECKING_ACCOUNTS.execute(PARSED.data)

    return ActionSuccess(undefined)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível excluir os saldos."
    )
  }
}
