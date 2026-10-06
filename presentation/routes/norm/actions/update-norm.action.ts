"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { NormContainer } from "@/presentation/composition/norm.container"
import { ActionAudited } from "@/presentation/parts/audit/shared-log-action.helper"
import {
  ActionFailure,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/presenters/action-result.presenter"
import type { NormResponseDTO } from "@/services/norm/dto/norm-response.dto"

import { UPDATE_NORM_SCHEMA } from "../validations/norm-actions.validation"

/**
 * @summary
 * Updates an existing norm.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the update use case.
 * The acting user is derived from the session, never from
 * the payload. Returns a human-readable error when anything
 * fails.
 *
 * @explanation
 * Use as the submit target of the edit norm form.
 *
 * @param input - The untrusted norm update payload.
 *
 * @returns The updated norm, or a failure result.
 *
 * @example
 * const RESULT = await updateNormAction({
 *   normId: "norm-1",
 *   name: "Renda variável",
 *   categoryId: "category-1",
 *   minAllocation: "0",
 *   maxAllocation: "100",
 *   targetAllocation: "15",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export async function updateNormAction(
  input: unknown
): Promise<ActionResult<NormResponseDTO>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = UPDATE_NORM_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { update: UPDATE_NORM } = NormContainer()
    const NORM = await UPDATE_NORM.execute(PARSED.data)

    return ActionAudited(NORM, {
      userId: USER.id,
      action: "UPDATED",
      entity: "Norm",
      entityId: NORM.id,
      entityName: NORM.name,
    })
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível atualizar a norma."
    )
  }
}
