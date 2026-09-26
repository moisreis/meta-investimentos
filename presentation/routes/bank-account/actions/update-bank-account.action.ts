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
import type { BankAccountResponseDTO } from "@/services/bank-account/dto/bank-account-response.dto"

import { UPDATE_BANK_ACCOUNT_SCHEMA } from "../validations/bank-account-actions.validation"

/**
 * @summary
 * Updates an existing bank account.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the update use case, so
 * the updated agency and account number are persisted
 * through the service layer. The acting user is derived
 * from the session, never from the payload. Returns a
 * human-readable error when anything fails.
 *
 * @explanation
 * Use as the submit target of the edit bank account
 * form.
 *
 * @param input - The untrusted bank account update payload.
 *
 * @returns The updated bank account, or a failure result.
 *
 * @example
 * const RESULT = await updateBankAccountAction({
 *   bankAccountId: "bank-account-1",
 *   agency: "0002",
 *   accountNumber: "54321-6",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function updateBankAccountAction(
  input: unknown
): Promise<ActionResult<BankAccountResponseDTO>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = UPDATE_BANK_ACCOUNT_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { update: UPDATE_BANK_ACCOUNT } =
      BankAccountContainer()
    const BANK_ACCOUNT = await UPDATE_BANK_ACCOUNT.execute(
      PARSED.data
    )

    return ActionSuccess(BANK_ACCOUNT)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível atualizar a conta."
    )
  }
}
