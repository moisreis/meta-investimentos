"use client"

import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import { useEntityFormStatus } from "@/presentation/parts/hooks/use-entity-form-status.hook"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"
import type { BenchmarkHistoryRow } from "@/presentation/types/benchmark-history-row.types"
import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"

import { useBenchmarkHistoryEditForm } from "../hooks/use-benchmark-history-edit-form.hook"
import { BENCHMARK_HISTORY_FORM } from "../settings/labels.settings"

import { BenchmarkHistoryFormFields } from "./fields"

/**
 * Props for the edit rate form.
 */
export interface EditBenchmarkHistoryFormProps {
  // The entry being corrected.
  entry: BenchmarkHistoryRow
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
 * Renders the edit rate form.
 *
 * @remarks
 * Renders the shared fields seeded from the stored entry, so a
 * wrong index, a wrong month and a mistyped rate are all
 * corrected in place rather than by deleting the entry and
 * recording it again.
 *
 * @explanation
 * Use as the form of the edit rate dialog flow. The parent
 * renders the result toast based on the reported status.
 *
 * @param props - Props of the edit rate form.
 * @param props.entry - The entry being corrected.
 * @param props.benchmarks - Options of the index field.
 * @param props.onStatusChange - Reports submit outcomes.
 *
 * @returns The edit rate form.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function EditBenchmarkHistoryForm({
  entry,
  benchmarks,
  onStatusChange,
}: EditBenchmarkHistoryFormProps) {
  const {
    values,
    updateField,
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  } = useBenchmarkHistoryEditForm(entry)

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
        label={BENCHMARK_HISTORY_FORM.EDIT_BUTTON}
        pendingLabel={BENCHMARK_HISTORY_FORM.EDIT_PENDING_BUTTON}
      />
    </SharedFormWrapper>
  )
}

export { EditBenchmarkHistoryForm }
