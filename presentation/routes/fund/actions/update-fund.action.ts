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

import { UPDATE_FUND_SCHEMA } from "../validations/fund-actions.validation"

/**
 * @summary
 * Updates an existing fund.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the update use case.
 * The acting user is derived from the session, never from
 * the payload. Returns a human-readable error when
 * anything fails.
 *
 * @explanation
 * Use as the submit target of the edit fund form.
 *
 * @param input - The untrusted fund update payload.
 *
 * @returns The updated fund, or a failure result.
 *
 * @example
 * const RESULT = await updateFundAction({
 *   fundId: "fund-1",
 *   name: "Fundo Multi Mercado II",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function updateFundAction(
  input: unknown
): Promise<ActionResult<FundResponseDTO>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = UPDATE_FUND_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { update: UPDATE_FUND } = FundContainer()
    const FUND = await UPDATE_FUND.execute(PARSED.data)

    return ActionSuccess(FUND)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível atualizar o fundo."
    )
  }
}
