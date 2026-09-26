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
import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"

import { CREATE_BANK_SCHEMA } from "../validations/bank-actions.validation"

/**
 * @summary
 * Creates a new bank.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the create use case.
 * The acting user is derived from the session, never from
 * the payload. Returns a human-readable error when anything
 * fails.
 *
 * @explanation
 * Use as the submit target of the add bank form.
 *
 * @param input - The untrusted bank creation payload.
 *
 * @returns The created bank, or a failure result.
 *
 * @example
 * const RESULT = await createBankAction({
 *   code: "237",
 *   name: "Banco Bradesco",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function createBankAction(
  input: unknown
): Promise<ActionResult<BankResponseDTO>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = CREATE_BANK_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { create: CREATE_BANK } = BankContainer()
    const BANK = await CREATE_BANK.execute(PARSED.data)

    return ActionSuccess(BANK)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível criar o banco."
    )
  }
}
