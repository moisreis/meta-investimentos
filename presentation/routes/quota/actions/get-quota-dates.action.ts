"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { QuotaContainer } from "@/presentation/composition/quota.container"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/presenters/action-result.presenter"

import { GET_QUOTA_DATES_SCHEMA } from "../validations/quota-actions.validation"

/**
 * @summary
 * Returns the dates that have quota entries for a fund.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the use case. The
 * acting user is derived from the session, never from the
 * payload. Returns a human-readable error when anything
 * fails.
 *
 * @explanation
 * Use to populate the date picker with available dates
 * for the selected fund when adding an application or
 * withdrawal.
 *
 * @param input - The untrusted fund id payload.
 *
 * @returns The day keys in `yyyy-MM-dd`, or a failure result.
 *
 * @example
 * const RESULT = await getQuotaDatesAction({
 *   fundId: "fund-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export async function getQuotaDatesAction(
  input: unknown
): Promise<ActionResult<string[]>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = GET_QUOTA_DATES_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { list: LIST_QUOTA_DATES } = QuotaContainer()

    const DATES = await LIST_QUOTA_DATES.execute(
      PARSED.data.fundId
    )

    return ActionSuccess(DATES)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível obter as datas de cota."
    )
  }
}
