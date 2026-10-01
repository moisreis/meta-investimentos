"use client"

import { useEntityForm } from "@/presentation/parts/hooks/use-entity-form.hook"
import { createBenchmarkAction } from "@/presentation/routes/benchmark/actions/create-benchmark.action"
import { BENCHMARK_FORM_SCHEMA } from "@/presentation/routes/benchmark/validations/benchmark-form.validation"

/**
 * @summary
 * Manages the add benchmark form state, validation and
 * submission.
 *
 * @remarks
 * Wraps `useEntityForm` with the benchmark schema and the
 * create benchmark server action.
 *
 * @explanation
 * Use inside the add benchmark form to keep the component
 * presentational. Wire the returned inputs into controlled
 * fields and call `handleSubmit` on submit. Render
 * `fieldErrors` per field to show readable messages. Use
 * `status` to trigger result toasts.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { acronym, updateAcronym, name, updateName,
 *   fieldErrors, status, handleSubmit } =
 *   useBenchmarkAddForm()
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function useBenchmarkAddForm() {
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
      acronym: "",
      name: "",
    },
    submit: (values) =>
      createBenchmarkAction({
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

export { useBenchmarkAddForm }
