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
import type { BenchmarkHistoryResponseDTO } from "@/services/benchmark-history/dto/benchmark-history-response.dto"

import { BuildBenchmarkHistoryDate } from "../helpers/build-benchmark-history-date.helper"
import { UPDATE_BENCHMARK_HISTORY_SCHEMA } from "../validations/benchmark-history-actions.validation"

// Shown when the index and month the correction lands on are
// already held by another entry. It is reported on the month
// field as well as in the form alert, because the month is the
// field to change.
const DUPLICATE_MONTH_MESSAGE =
  "Este índice já possui uma taxa registrada neste mês."

/**
 * @summary
 * Corrects the index, the month and the rate of an entry.
 *
 * @remarks
 * Resolves the session first, then validates the entry id, the
 * index id, the month key and the rate with **Zod**. The month
 * is anchored to its first day before the duplicate check, so
 * the check asks the same question the unique pair on
 * `(benchmark, date)` would ask. Only then does the update use
 * case run.
 *
 * The duplicate is looked up instead of left to the unique
 * index, for the same reason the record action looks it up: a
 * constraint violation reaches the user as a generic failure,
 * while a specific one names the field to correct.
 *
 * The entry being corrected is excluded from that lookup, so
 * saving a corrected rate without touching the index and the
 * month is not a duplicate of itself.
 *
 * @explanation
 * Use as the submit target of the edit rate form.
 *
 * @param input - The untrusted entry correction payload.
 *
 * @returns The corrected entry, or a failure result.
 *
 * @example
 * const RESULT = await updateBenchmarkHistoryAction({
 *   benchmarkHistoryId: "history-1",
 *   benchmarkId: "benchmark-1",
 *   month: "2026-01",
 *   rate: "-1.88",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export async function updateBenchmarkHistoryAction(
  input: unknown
): Promise<ActionResult<BenchmarkHistoryResponseDTO>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = UPDATE_BENCHMARK_HISTORY_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  const {
    benchmarkHistoryId: ENTRY_ID,
    benchmarkId: BENCHMARK_ID,
    month: MONTH,
    rate: RATE,
  } = PARSED.data

  const DATE = BuildBenchmarkHistoryDate(MONTH)

  try {
    const {
      list: LIST_BENCHMARK_HISTORY,
      update: UPDATE_BENCHMARK_HISTORY,
    } = BenchmarkHistoryContainer()

    const ENTRIES = await LIST_BENCHMARK_HISTORY.execute({
      benchmarkId: BENCHMARK_ID,
    })

    const TAKEN = ENTRIES.some(
      (entry) =>
        entry.id !== ENTRY_ID &&
        Date.parse(entry.date) === Date.parse(DATE)
    )

    if (TAKEN) {
      return ActionFailure(DUPLICATE_MONTH_MESSAGE, {
        month: [DUPLICATE_MONTH_MESSAGE],
      })
    }

    const ENTRY = await UPDATE_BENCHMARK_HISTORY.execute({
      benchmarkHistoryId: ENTRY_ID,
      benchmarkId: BENCHMARK_ID,
      date: DATE,
      rate: RATE,
    })

    return ActionAudited(ENTRY, {
      userId: USER.id,
      action: "UPDATED",
      entity: "BenchmarkHistory",
      entityId: ENTRY.id,
    })
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível atualizar a taxa."
    )
  }
}
