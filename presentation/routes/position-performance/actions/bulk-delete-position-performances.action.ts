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

import { BULK_DELETE_POSITION_PERFORMANCES_SCHEMA } from "../validations/position-performance-actions.validation"

/**
 * @summary
 * Deletes multiple position performance snapshots.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, including a non-empty cap on the selection,
 * and only then runs the bulk delete use case. The acting
 * user is derived from the session, never from the payload.
 * Returns a human-readable error when anything fails.
 *
 * @explanation
 * Use as the submit target of the bulk delete flow of the
 * position performance datatable.
 *
 * @param input - The untrusted performance ids payload.
 *
 * @returns Nothing on success, or a failure result.
 *
 * @example
 * const RESULT = await bulkDeletePositionPerformancesAction({
 *   performanceIds: ["perf-1", "perf-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-20
 */
export async function bulkDeletePositionPerformancesAction(
  input: unknown
): Promise<ActionResult<undefined>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED =
    BULK_DELETE_POSITION_PERFORMANCES_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { bulkDelete: BULK_DELETE_PERFORMANCES } =
      PositionPerformanceContainer()

    await BULK_DELETE_PERFORMANCES.execute({
      positionPerformanceIds: PARSED.data.performanceIds,
    })

    return ActionAudited(undefined, {
      userId: USER.id,
      action: "DELETED",
      entity: "PositionPerformance",
      entityId: PARSED.data.performanceIds[0] ?? "",
      changes: {
        ids: PARSED.data.performanceIds,
        count: PARSED.data.performanceIds.length,
      },
    })
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível excluir as performances."
    )
  }
}
