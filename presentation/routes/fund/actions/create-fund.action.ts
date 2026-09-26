"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { FundContainer } from "@/presentation/composition/fund.container"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/types/action-result"
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"

import { CREATE_FUND_SCHEMA } from "../validations/fund-actions.validation"

/**
 * @summary
 * Creates a new fund.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the create use case.
 * The acting user is derived from the session, never from
 * the payload. Returns a human-readable error when
 * anything fails.
 *
 * @explanation
 * Use as the submit target of the add fund form.
 *
 * @param input - The untrusted fund creation payload.
 *
 * @returns The created fund, or a failure result.
 *
 * @example
 * const RESULT = await createFundAction({
 *   cnpj: "11.222.333/0001-81",
 *   name: "Fundo Multi Mercado",
 *   bankId: "bank-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function createFundAction(
  input: unknown
): Promise<ActionResult<FundResponseDTO>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = CREATE_FUND_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { create: CREATE_FUND } = FundContainer()
    const FUND = await CREATE_FUND.execute(PARSED.data)

    return ActionSuccess(FUND)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível criar o fundo."
    )
  }
}
