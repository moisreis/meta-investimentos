"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { BenchmarkHistoryContainer } from "@/presentation/composition/benchmark-history.container"
import { ActionAudited } from "@/presentation/parts/audit/shared-log-action.helper"
import {
  ActionFailure,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/presenters/action-result.presenter"

import { DELETE_BENCHMARK_HISTORY_SCHEMA } from "../validations/benchmark-history-actions.validation"

/**
 * @summary
 * Deletes an index rate entry.
 *
 * @remarks
 * Resolves the session first, then validates the entry id with
 * **Zod**, and only then runs the delete use case. The acting
 * user is derived from the session, never from the payload.
 * Returns a human-readable error when anything fails.
 *
 * @explanation
 * Use as the submit target of the single-row delete flow of the
 * index history datatable.
 *
 * @param input - The untrusted entry id payload.
 *
 * @returns Nothing on success, or a failure result.
 *
 * @example
 * const RESULT = await deleteBenchmarkHistoryAction({
 *   benchmarkHistoryId: "history-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export async function deleteBenchmarkHistoryAction(
  input: unknown
): Promise<ActionResult<undefined>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = DELETE_BENCHMARK_HISTORY_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { delete: DELETE_BENCHMARK_HISTORY } =
      BenchmarkHistoryContainer()

    await DELETE_BENCHMARK_HISTORY.execute(PARSED.data)

    return ActionAudited(undefined, {
      userId: USER.id,
      action: "DELETED",
      entity: "BenchmarkHistory",
      entityId: PARSED.data.benchmarkHistoryId,
    })
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível excluir a taxa."
    )
  }
}
