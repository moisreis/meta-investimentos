"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { PositionPerformanceContainer } from "@/presentation/composition/position-performance.container"
import { ActionAudited } from "@/presentation/parts/audit/shared-log-action.helper"
import {
  ActionFailure,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/presenters/action-result.presenter"

import { DELETE_POSITION_PERFORMANCE_SCHEMA } from "../validations/position-performance-actions.validation"

/**
 * @summary
 * Deletes a position performance.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the delete use case. The
 * acting user is derived from the session, never from the
 * payload. Returns a human-readable error when anything
 * fails.
 *
 * @explanation
 * Use as the submit target of the single-row delete
 * flow of the position performance datatable.
 *
 * @param input - The untrusted performance id payload.
 *
 * @returns Nothing on success, or a failure result.
 *
 * @example
 * const RESULT = await deletePositionPerformanceAction({
 *   performanceId: "performance-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export async function deletePositionPerformanceAction(
  input: unknown
): Promise<ActionResult<undefined>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED =
    DELETE_POSITION_PERFORMANCE_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { delete: DELETE_POSITION_PERFORMANCE } =
      PositionPerformanceContainer()

    await DELETE_POSITION_PERFORMANCE.execute(PARSED.data)

    return ActionAudited(undefined, {
      userId: USER.id,
      action: "DELETED",
      entity: "PositionPerformance",
      entityId: PARSED.data.performanceId,
    })
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível excluir a performance."
    )
  }
}
