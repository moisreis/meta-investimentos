"use client"

import { UnmaskPercentage } from "@/presentation/masks/percentage.mask"
import { useEntityForm } from "@/presentation/parts/hooks/use-entity-form.hook"

import { createBenchmarkHistoryAction } from "../actions/create-benchmark-history.action"
import { BENCHMARK_HISTORY_FORM_SCHEMA } from "../validations/benchmark-history-form.validation"

/**
 * @summary
 * Manages the record rate form state, validation and
 * submission.
 *
 * @remarks
 * Wraps `useEntityForm` with the history schema and the
 * record server action. The masked rate is unmasked before it
 * reaches the action, and only there: the schema reads the
 * masked text on purpose, so the field is validated against
 * exactly what the user typed.
 *
 * The month is passed on as the `yyyy-MM` key it already is.
 * Anchoring it to a day is the action's job, because the rule
 * is about what gets stored and only the action stores it.
 *
 * @explanation
 * Use inside the record rate form to keep the component
 * presentational. Wire the returned values into the shared
 * fields and call `handleSubmit` on submit.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { values, updateField, fieldErrors, status,
 *   handleSubmit } = useBenchmarkHistoryAddForm()
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function useBenchmarkHistoryAddForm() {
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
      benchmarkId: "",
      month: "",
      rate: "",
    },
    submit: (values) =>
      createBenchmarkHistoryAction({
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

export { useBenchmarkHistoryAddForm }
