"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { PortfolioContainer } from "@/presentation/composition/portfolio.container"
import { ActionAudited } from "@/presentation/parts/audit/shared-log-action.helper"
import {
  ActionFailure,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/presenters/action-result.presenter"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

import { UPDATE_PORTFOLIO_SCHEMA } from "../validations/portfolio-actions.validation"

/**
 * @summary
 * Updates an existing portfolio of the signed-in user.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the update use case with
 * the user id taken from the session, never from the
 * payload. The caller sends unmasked decimal percentage
 * strings. Returns a human-readable error when anything
 * fails. A best-effort audit entry is written afterwards,
 * naming the fields that changed and the norms the user
 * bound, so the trail explains the allocation a reviewer
 * later asks about.
 *
 * @explanation
 * Use as the submit target of the edit portfolio form.
 *
 * @param input - The untrusted portfolio update payload.
 *
 * @returns The updated portfolio, or a failure result.
 *
 * @example
 * const RESULT = await updatePortfolioAction({
 *   portfolioId: "portfolio-1",
 *   acronym: "RF",
 *   name: "Renda Fixa",
 *   annualInterestRate: "10.5",
 *   minAllocation: "5",
 *   maxAllocation: "20",
 *   targetAllocation: "12",
 *   norms: [
 *     {
 *       normId: "norm-1",
 *       minAllocation: "5",
 *       targetAllocation: "10",
 *       maxAllocation: "15",
 *     },
 *   ],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
export async function updatePortfolioAction(
  input: unknown
): Promise<ActionResult<PortfolioResponseDTO>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = UPDATE_PORTFOLIO_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { update: UPDATE_PORTFOLIO } = PortfolioContainer()
    const PORTFOLIO = await UPDATE_PORTFOLIO.execute({
      ...PARSED.data,
      userId: USER.id,
    })

    return ActionAudited(PORTFOLIO, {
      userId: USER.id,
      action: "UPDATED",
      entity: "Portfolio",
      entityId: PORTFOLIO.id,
      entityName: PORTFOLIO.name,
      changes: { norms: PARSED.data.norms ?? [] },
    })
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível atualizar a carteira."
    )
  }
}
