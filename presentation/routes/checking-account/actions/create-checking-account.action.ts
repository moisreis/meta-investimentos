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

import { RECORD_CHECKING_ACCOUNT_SCHEMA } from "../validations/checking-account-actions.validation"

/**
 * @summary
 * Records a new checking account balance.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the record use case.
 * The acting user is derived from the session, never from
 * the payload. Returns a human-readable error when
 * anything fails.
 *
 * @explanation
 * Use as the submit target of the add checking account
 * form.
 *
 * @param input - The untrusted balance creation payload.
 *
 * @returns The recorded balance, or a failure result.
 *
 * @example
 * const RESULT = await createCheckingAccountAction({
 *   bankAccountId: "bank-account-1",
 *   date: "2026-09-25",
 *   value: "15000",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function createCheckingAccountAction(
  input: unknown
): Promise<ActionResult<CheckingAccountResponseDTO>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = RECORD_CHECKING_ACCOUNT_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { record: RECORD_CHECKING_ACCOUNT } =
      CheckingAccountContainer()
    const ENTRY = await RECORD_CHECKING_ACCOUNT.execute(
      PARSED.data
    )

    return ActionSuccess(ENTRY)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível cadastrar o saldo."
    )
  }
}
