"use client"

import { FieldGroup } from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"

import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { useEntityFormStatus } from "@/presentation/parts/hooks/use-entity-form-status.hook"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"
import { useBenchmarkAddForm } from "@/presentation/routes/benchmark/hooks/use-benchmark-add-form.hook"

import { BENCHMARK_FORM } from "@/presentation/routes/benchmark/settings/labels.settings"

/**
 * Props for the add benchmark form.
 */
export interface AddBenchmarkFormProps {
  onStatusChange?: (
    status: EntityFormStatus,
    error: string | null
  ) => void
}

/**
 * @summary
 * Renders the add benchmark form.
 *
 * @remarks
 * Validates fields with **Zod** and shows
 * human-readable error messages.
 * Submits the benchmark to the create server action.
 * Shows loading state while submitting and reports the
 * submit status through `onStatusChange` so the parent
 * dialog can react to the outcome.
 *
 * @explanation
 * Use as the add component of the benchmark dialog flow.
 * The parent renders the result toast and the follow-up
 * prompt based on the reported status.
 *
 * @param props - Props of the add benchmark form.
 * @param props.onStatusChange - Reports submit outcomes.
 *
 * @returns The add benchmark form.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function AddBenchmarkForm({
  onStatusChange,
}: AddBenchmarkFormProps) {
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
  } = useBenchmarkAddForm()

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
        label={BENCHMARK_FORM.ADD_BUTTON}
        pendingLabel={BENCHMARK_FORM.ADD_PENDING_BUTTON}
      />
    </SharedFormWrapper>
  )
}

export { AddBenchmarkForm }
