"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { ApplicationContainer } from "@/presentation/composition/application.container"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/types/action-result"
import type { ApplicationResponseDTO } from "@/services/application/dto/application-response.dto"

import { ADD_APPLICATION_SCHEMA } from "../validations/application-actions.validation"

/**
 * @summary
 * Records an application in a portfolio.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the add application use
 * case. The acting user is derived from the session, never
 * from the payload. The amount is checked as a positive
 * money value and the action never receives a quota value:
 * the use case resolves the position, creates it when the
 * fund is not held yet, redistributes the portfolio
 * allocations and derives the quotas from the quota price
 * of the given date. Returns a human-readable error when
 * anything fails.
 *
 * @explanation
 * Use as the submit target of the add application form.
 *
 * @param input - The untrusted application creation
 *                payload.
 *
 * @returns The recorded application, or a failure result.
 *
 * @example
 * const RESULT = await addApplicationAction({
 *   portfolioId: "portfolio-1",
 *   fundId: "fund-1",
 *   date: "2026-01-10",
 *   amount: "1000",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function addApplicationAction(
  input: unknown
): Promise<ActionResult<ApplicationResponseDTO>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = ADD_APPLICATION_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { add: ADD_APPLICATION } = ApplicationContainer()
    const APPLICATION = await ADD_APPLICATION.execute(
      PARSED.data
    )

    return ActionSuccess(APPLICATION)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível registrar a aplicação."
    )
  }
}
