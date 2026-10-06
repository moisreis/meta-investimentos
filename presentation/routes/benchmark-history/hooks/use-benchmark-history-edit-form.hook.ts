"use client"

import {
  MaskSignedPercentage,
  UnmaskPercentage,
} from "@/presentation/masks/percentage.mask"
import { useEntityForm } from "@/presentation/parts/hooks/use-entity-form.hook"
import type { BenchmarkHistoryRow } from "@/presentation/types/benchmark-history-row.types"

import { updateBenchmarkHistoryAction } from "../actions/update-benchmark-history.action"
import { BuildBenchmarkHistoryMonth } from "../helpers/build-benchmark-history-month.helper"
import { BENCHMARK_HISTORY_FORM_SCHEMA } from "../validations/benchmark-history-form.validation"

/**
 * @summary
 * Manages the edit rate form state, validation and
 * submission.
 *
 * @remarks
 * Wraps `useEntityForm` with the history schema and the
 * update rate server action, so a correction is validated by
 * exactly the rules a first registration is.
 *
 * The initial values are read back from the stored row: the
 * month through the inverse of the helper that anchored it, and
 * the rate through the signed mask, because the column hands
 * over a decimal point where the field speaks a decimal comma.
 * The stored rate is therefore shown the way it was typed
 * rather than as the raw column value.
 *
 * @explanation
 * Use inside the edit rate form to keep the component
 * presentational. Pass the entry being edited so the fields
 * start with its current values.
 *
 * @param entry - The entry being edited.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { values, updateField, fieldErrors, status,
 *   handleSubmit } = useBenchmarkHistoryEditForm(entry)
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function useBenchmarkHistoryEditForm(
  entry: BenchmarkHistoryRow
) {
  const {
    values: VALUES,
    updateField: UPDATE_FIELD,
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  } = useEntityForm({
    schema: BENCHMARK_HISTORY_FORM_SCHEMA,
    initialValues: {
      benchmarkId: entry.benchmarkId,
      month: BuildBenchmarkHistoryMonth(entry.date),
      rate: MaskSignedPercentage(entry.rate),
    },
    submit: (values) =>
      updateBenchmarkHistoryAction({
        benchmarkHistoryId: entry.id,
        benchmarkId: values.benchmarkId,
        month: values.month,
        rate: UnmaskPercentage(values.rate),
      }),
  })

  return {
    values: VALUES,
    updateField: UPDATE_FIELD,
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  }
}

export { useBenchmarkHistoryEditForm }
