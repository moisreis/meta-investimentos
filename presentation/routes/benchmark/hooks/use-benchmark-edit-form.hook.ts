"use client"

import { useEntityForm } from "@/presentation/parts/hooks/use-entity-form.hook"
import { updateBenchmarkAction } from "@/presentation/routes/benchmark/actions/update-benchmark.action"
import { BENCHMARK_FORM_SCHEMA } from "@/presentation/routes/benchmark/validations/benchmark-form.validation"
import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"

/**
 * @summary
 * Manages the edit benchmark form state, validation and
 * submission.
 *
 * @remarks
 * Wraps `useEntityForm` with the benchmark schema and the
 * update benchmark server action. Seeds the initial values
 * from the provided benchmark.
 *
 * @explanation
 * Use inside the edit benchmark form to keep the component
 * presentational. Pass the benchmark being edited so the
 * fields start with its current values.
 *
 * @param benchmark - Benchmark being edited.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { acronym, updateAcronym, name, updateName,
 *   fieldErrors, status, handleSubmit } =
 *   useBenchmarkEditForm(benchmark)
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function useBenchmarkEditForm(benchmark: BenchmarkRow) {
  const {
    values: VALUES,
    updateField,
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  } = useEntityForm({
    schema: BENCHMARK_FORM_SCHEMA,
    initialValues: {
      acronym: benchmark.acronym,
      name: benchmark.name,
    },
    submit: (values) =>
      updateBenchmarkAction({
        benchmarkId: benchmark.id,
        acronym: values.acronym,
        name: values.name,
      }),
  })

  return {
    acronym: VALUES.acronym,
    updateAcronym: (value: string) =>
      updateField("acronym", value),
    name: VALUES.name,
    updateName: (value: string) => updateField("name", value),
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  }
}

export { useBenchmarkEditForm }
