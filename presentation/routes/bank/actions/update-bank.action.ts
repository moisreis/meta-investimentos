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

import { UPDATE_BANK_SCHEMA } from "../validations/bank-actions.validation"

/**
 * @summary
 * Updates an existing bank.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the update use case. The
 * acting user is derived from the session, never from the
 * payload. Returns a human-readable error when anything
 * fails.
 *
 * @explanation
 * Use as the submit target of the edit bank form.
 *
 * @param input - The untrusted bank update payload.
 *
 * @returns The updated bank, or a failure result.
 *
 * @example
 * const RESULT = await updateBankAction({
 *   bankId: "bank-1",
 *   code: "237",
 *   name: "Banco Bradesco",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function updateBankAction(
  input: unknown
): Promise<ActionResult<BankResponseDTO>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = UPDATE_BANK_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { update: UPDATE_BANK } = BankContainer()
    const BANK = await UPDATE_BANK.execute(PARSED.data)

    return ActionSuccess(BANK)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível atualizar o banco."
    )
  }
}
