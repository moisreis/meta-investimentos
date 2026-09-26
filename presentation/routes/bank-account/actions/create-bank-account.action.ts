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

import { CREATE_BANK_ACCOUNT_SCHEMA } from "../validations/bank-account-actions.validation"

/**
 * @summary
 * Creates a new bank account.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the create use case.
 * The acting user is derived from the session, never from
 * the payload. Returns a human-readable error when anything
 * fails.
 *
 * @explanation
 * Use as the submit target of the add bank account
 * form.
 *
 * @param input - The untrusted bank account creation
 *                payload.
 *
 * @returns The created bank account, or a failure result.
 *
 * @example
 * const RESULT = await createBankAccountAction({
 *   portfolioId: "portfolio-1",
 *   bankId: "bank-1",
 *   agency: "0001",
 *   accountNumber: "12345-6",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function createBankAccountAction(
  input: unknown
): Promise<ActionResult<BankAccountResponseDTO>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = CREATE_BANK_ACCOUNT_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { create: CREATE_BANK_ACCOUNT } =
      BankAccountContainer()
    const BANK_ACCOUNT = await CREATE_BANK_ACCOUNT.execute(
      PARSED.data
    )

    return ActionSuccess(BANK_ACCOUNT)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível criar a conta."
    )
  }
}
