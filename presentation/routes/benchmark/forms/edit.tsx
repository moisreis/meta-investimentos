"use client"

import { FieldGroup } from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"

import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { useEntityFormStatus } from "@/presentation/parts/hooks/use-entity-form-status.hook"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"
import { useBenchmarkEditForm } from "../hooks/use-benchmark-edit-form.hook"

import { BENCHMARK_FORM } from "@/presentation/routes/benchmark/settings/labels.settings"

import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"

/**
 * Props for the edit benchmark form.
 */
export interface EditBenchmarkFormProps {
  benchmark: BenchmarkRow
  onStatusChange?: (
    status: EntityFormStatus,
    error: string | null
  ) => void
}

/**
 * @summary
 * Renders the edit benchmark form.
 *
 * @remarks
 * Seeds the fields from the provided benchmark.
 * Validates fields with **Zod** and shows
 * human-readable error messages.
 * Submits the benchmark to the update server action.
 * Shows loading state while submitting and reports the
 * submit status through `onStatusChange` so the parent
 * dialog can react to the outcome.
 *
 * @explanation
 * Use as the edit component of the benchmark dialog flow.
 * The parent renders the result toast and closes on
 * success based on the reported status.
 *
 * @param props - Props of the edit benchmark form.
 * @param props.benchmark - Benchmark being edited.
 * @param props.onStatusChange - Reports submit outcomes.
 *
 * @returns The edit benchmark form.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function EditBenchmarkForm({
  benchmark,
  onStatusChange,
}: EditBenchmarkFormProps) {
  const {
    acronym,
    updateAcronym,
    name,
    updateName,
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  } = useBenchmarkEditForm(benchmark)

  useEntityFormStatus({ status, error, onStatusChange })

  return (
    <SharedFormWrapper onSubmit={handleSubmit}>
      <FieldGroup>
        <SharedFormField
          label={BENCHMARK_FORM.LABEL_ACRONYM}
          error={fieldErrors.acronym}
          htmlFor="acronym"
        >
          <Input
            id="acronym"
            type="text"
            name="acronym"
            autoComplete="off"
            placeholder={BENCHMARK_FORM.PLACEHOLDER_ACRONYM}
            required
            value={acronym}
            onChange={(e) => updateAcronym(e.target.value)}
            disabled={pending}
            aria-invalid={
              fieldErrors.acronym ? "true" : undefined
            }
          />
        </SharedFormField>
        <SharedFormField
          label={BENCHMARK_FORM.LABEL_NAME}
          error={fieldErrors.name}
          htmlFor="name"
        >
          <Input
            id="name"
            type="text"
            name="name"
            autoComplete="off"
            placeholder={BENCHMARK_FORM.PLACEHOLDER_NAME}
            required
            value={name}
            onChange={(e) => updateName(e.target.value)}
            disabled={pending}
            aria-invalid={fieldErrors.name ? "true" : undefined}
          />
        </SharedFormField>
      </FieldGroup>

      <SharedSubmitButton
        pending={pending}
        label={BENCHMARK_FORM.EDIT_BUTTON}
        pendingLabel={BENCHMARK_FORM.EDIT_PENDING_BUTTON}
      />
    </SharedFormWrapper>
  )
}

export { EditBenchmarkForm }
