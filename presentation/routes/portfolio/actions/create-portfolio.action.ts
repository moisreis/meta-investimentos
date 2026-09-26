"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { PortfolioContainer } from "@/presentation/composition/portfolio.container"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/types/action-result"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

import { CREATE_PORTFOLIO_SCHEMA } from "../validations/portfolio-actions.validation"

/**
 * @summary
 * Creates a new portfolio for the signed-in user.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the create use case with
 * the user id taken from the session, never from the
 * payload. The caller sends unmasked decimal percentage
 * strings. Returns a human-readable error when anything
 * fails.
 *
 * @explanation
 * Use as the submit target of the add portfolio form.
 *
 * @param input - The untrusted portfolio creation payload.
 *
 * @returns The created portfolio, or a failure result.
 *
 * @example
 * const RESULT = await createPortfolioAction({
 *   acronym: "RF",
 *   name: "Renda Fixa",
 *   annualInterestRate: "10.5",
 *   minAllocation: "5",
 *   maxAllocation: "20",
 *   targetAllocation: "12",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
export async function createPortfolioAction(
  input: unknown
): Promise<ActionResult<PortfolioResponseDTO>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = CREATE_PORTFOLIO_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { create: CREATE_PORTFOLIO } = PortfolioContainer()
    const PORTFOLIO = await CREATE_PORTFOLIO.execute({
      ...PARSED.data,
      userId: USER.id,
    })

    return ActionSuccess(PORTFOLIO)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível criar a carteira."
    )
  }
}
