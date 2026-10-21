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

import { BULK_DELETE_BENCHMARK_HISTORY_SCHEMA } from "../validations/benchmark-history-actions.validation"

/**
 * @summary
 * Deletes multiple benchmark history entries.
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
 * benchmark history datatable.
 *
 * @param input - The untrusted entry ids payload.
 *
 * @returns Nothing on success, or a failure result.
 *
 * @example
 * const RESULT = await bulkDeleteBenchmarkHistoryAction({
 *   benchmarkHistoryIds: ["entry-1", "entry-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-20
 */
export async function bulkDeleteBenchmarkHistoryAction(
  input: unknown
): Promise<ActionResult<undefined>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED =
    BULK_DELETE_BENCHMARK_HISTORY_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { bulkDelete: BULK_DELETE_HISTORY } =
      BenchmarkHistoryContainer()

    await BULK_DELETE_HISTORY.execute(PARSED.data)

    return ActionAudited(undefined, {
      userId: USER.id,
      action: "DELETED",
      entity: "BenchmarkHistory",
      entityId: PARSED.data.benchmarkHistoryIds[0] ?? "",
      changes: {
        ids: PARSED.data.benchmarkHistoryIds,
        count: PARSED.data.benchmarkHistoryIds.length,
      },
    })
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível excluir as taxas."
    )
  }
}
