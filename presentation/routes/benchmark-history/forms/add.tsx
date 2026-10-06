"use client"

import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import { useEntityFormStatus } from "@/presentation/parts/hooks/use-entity-form-status.hook"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"
import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"

import { useBenchmarkHistoryAddForm } from "../hooks/use-benchmark-history-add-form.hook"
import { BENCHMARK_HISTORY_FORM } from "../settings/labels.settings"

import { BenchmarkHistoryFormFields } from "./fields"

/**
 * Props for the record rate form.
 */
export interface AddBenchmarkHistoryFormProps {
  // Indices the rate can be recorded for.
  benchmarks: BenchmarkRow[]
  // Reports submit outcomes to the dialog that owns the toast.
  onStatusChange?: (
    status: EntityFormStatus,
    error: string | null
  ) => void
}

/**
 * @summary
 * Renders the record rate form.
 *
 * @remarks
 * Asks for the three facts an entry is made of: which index it
 * belongs to, which month it covers, and the rate of that
 * month. The fields themselves live in the shared group, so the
 * edit flow corrects a rate through the very same questions.
 *
 * Validates fields with **Zod** and shows human-readable
 * error messages. Shows loading state while submitting and
 * reports the submit status through `onStatusChange` so the
 * parent dialog can react.
 *
 * @explanation
 * Use as the form of the record rate dialog flow. The parent
 * renders the result toast based on the reported status.
 *
 * @param props - Props of the record rate form.
 * @param props.benchmarks - Options of the index field.
 * @param props.onStatusChange - Reports submit outcomes.
 *
 * @returns The record rate form.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function AddBenchmarkHistoryForm({
  benchmarks,
  onStatusChange,
}: AddBenchmarkHistoryFormProps) {
  const {
    values,
    updateField,
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  } = useBenchmarkHistoryAddForm()

  useEntityFormStatus({ status, error, onStatusChange })

  return (
    <SharedFormWrapper onSubmit={handleSubmit}>
      <BenchmarkHistoryFormFields
        benchmarks={benchmarks}
        values={values}
        updateField={updateField}
        fieldErrors={fieldErrors}
        pending={pending}
      />

      <SharedSubmitButton
        pending={pending}
        label={BENCHMARK_HISTORY_FORM.ADD_BUTTON}
        pendingLabel={BENCHMARK_HISTORY_FORM.ADD_PENDING_BUTTON}
      />
    </SharedFormWrapper>
  )
}

export { AddBenchmarkHistoryForm }
