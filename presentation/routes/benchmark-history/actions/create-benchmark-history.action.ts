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
import { CREATE_BENCHMARK_HISTORY_SCHEMA } from "../validations/benchmark-history-actions.validation"

// Shown when the chosen index already holds a rate for the
// chosen month. It is reported on the month field as well as in
// the form alert, because the month is the field to change.
const DUPLICATE_MONTH_MESSAGE =
  "Este índice já possui uma taxa registrada neste mês."

/**
 * @summary
 * Records the rate of an index for a reference month.
 *
 * @remarks
 * Resolves the session first, then validates the index id, the
 * month key and the rate with **Zod**. The month is anchored to
 * its first day before the duplicate check, so the check asks
 * the same question the unique pair on `(benchmark, date)`
 * would ask. Only then does the record use case run.
 *
 * The duplicate is looked up instead of left to the unique
 * index, because a re-entered month is the likeliest mistake
 * on a form people fill in month by month, and a constraint
 * violation would reach the user as a generic failure where a
 * specific one names the field to correct.
 *
 * @explanation
 * Use as the submit target of the record rate form.
 *
 * @param input - The untrusted index, month and rate payload.
 *
 * @returns The recorded entry, or a failure result.
 *
 * @example
 * const RESULT = await createBenchmarkHistoryAction({
 *   benchmarkId: "benchmark-1",
 *   month: "2026-01",
 *   rate: "-1.88",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export async function createBenchmarkHistoryAction(
  input: unknown
): Promise<ActionResult<BenchmarkHistoryResponseDTO>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = CREATE_BENCHMARK_HISTORY_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  const {
    benchmarkId: BENCHMARK_ID,
    month: MONTH,
    rate: RATE,
  } = PARSED.data

  const DATE = BuildBenchmarkHistoryDate(MONTH)

  try {
    const {
      list: LIST_BENCHMARK_HISTORY,
      record: RECORD_BENCHMARK_HISTORY,
    } = BenchmarkHistoryContainer()

    const ENTRIES = await LIST_BENCHMARK_HISTORY.execute({
      benchmarkId: BENCHMARK_ID,
    })

    const ALREADY_RECORDED = ENTRIES.some(
      (entry) => Date.parse(entry.date) === Date.parse(DATE)
    )

    if (ALREADY_RECORDED) {
      return ActionFailure(DUPLICATE_MONTH_MESSAGE, {
        month: [DUPLICATE_MONTH_MESSAGE],
      })
    }

    const ENTRY = await RECORD_BENCHMARK_HISTORY.execute({
      benchmarkId: BENCHMARK_ID,
      date: DATE,
      rate: RATE,
    })

    return ActionAudited(ENTRY, {
      userId: USER.id,
      action: "CREATED",
      entity: "BenchmarkHistory",
      entityId: ENTRY.id,
    })
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível registrar a taxa."
    )
  }
}
