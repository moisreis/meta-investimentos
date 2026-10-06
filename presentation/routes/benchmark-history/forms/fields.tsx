"use client"

import { FieldGroup } from "@/presentation/ui/field"

import { EntityMonthInput } from "@/presentation/parts/components/entity-month-input"
import { EntityPercentageInput } from "@/presentation/parts/components/entity-percentage-input"
import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"

import type { BenchmarkHistoryFormValues } from "../validations/benchmark-history-form.validation"

import { useBenchmarkHistoryIndexOptions } from "../hooks/use-benchmark-history-index-options.hook"
import { BENCHMARK_HISTORY_FORM } from "../settings/labels.settings"

import { BenchmarkHistoryIndexCombobox } from "./index-combobox"

/**
 * Props for the fields of an index rate form.
 */
export interface BenchmarkHistoryFormFieldsProps {
  // Indices the rate can be recorded for.
  benchmarks: BenchmarkRow[]
  // The current value of each field.
  values: BenchmarkHistoryFormValues
  // Reports the next value of a single field.
  updateField: (
    field: keyof BenchmarkHistoryFormValues,
    value: string
  ) => void
  // The message shown under each field.
  fieldErrors: Partial<
    Record<keyof BenchmarkHistoryFormValues, string>
  >
  // Blocks the fields while the form submits.
  pending: boolean
}

/**
 * @summary
 * Renders the three fields an index rate entry is made of.
 *
 * @remarks
 * Shared by the record and the edit forms, because a
 * correction is validated by the same rules as a first
 * registration: the same index picker, the same month picker
 * and the same signed rate. Only the submit action and the
 * button copy differ between the two flows, so the fields
 * themselves live here.
 *
 * @explanation
 * Use inside the record and the edit index rate forms.
 *
 * @param props - Props of the fields.
 * @param props.benchmarks - Options of the index field.
 * @param props.values - The current field values.
 * @param props.updateField - Reports the next field value.
 * @param props.fieldErrors - The message of each field.
 * @param props.pending - Blocks interaction while submitting.
 *
 * @returns The fields of an index rate form.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function BenchmarkHistoryFormFields({
  benchmarks,
  values,
  updateField,
  fieldErrors,
  pending,
}: BenchmarkHistoryFormFieldsProps) {
  const { items, handleBenchmarkIdChange } =
    useBenchmarkHistoryIndexOptions({
      benchmarks,
      benchmarkId: values.benchmarkId,
      updateBenchmarkId: (value) =>
        updateField("benchmarkId", value),
    })

  return (
    <FieldGroup>
      <SharedFormField
        label={BENCHMARK_HISTORY_FORM.LABEL_BENCHMARK}
        error={fieldErrors.benchmarkId}
        htmlFor="benchmarkId"
      >
        <BenchmarkHistoryIndexCombobox
          id="benchmarkId"
          name="benchmarkId"
          value={values.benchmarkId}
          onValueChange={handleBenchmarkIdChange}
          placeholder={
            BENCHMARK_HISTORY_FORM.PLACEHOLDER_BENCHMARK
          }
          items={items}
          required
          disabled={pending}
          aria-invalid={
            fieldErrors.benchmarkId ? "true" : undefined
          }
        />
      </SharedFormField>

      <SharedFormField
        label={BENCHMARK_HISTORY_FORM.LABEL_MONTH}
        error={fieldErrors.month}
        htmlFor="month"
      >
        <EntityMonthInput
          id="month"
          name="month"
          value={values.month}
          onValueChange={(value) => updateField("month", value)}
          placeholder={BENCHMARK_HISTORY_FORM.PLACEHOLDER_MONTH}
          gridLabel={BENCHMARK_HISTORY_FORM.MONTH_GRID_LABEL}
          required
          disabled={pending}
          aria-invalid={fieldErrors.month ? "true" : undefined}
        />
      </SharedFormField>

      <SharedFormField
        label={BENCHMARK_HISTORY_FORM.LABEL_RATE}
        error={fieldErrors.rate}
        htmlFor="rate"
      >
        <EntityPercentageInput
          id="rate"
          name="rate"
          value={values.rate}
          onChange={(value) => updateField("rate", value)}
          placeholder={BENCHMARK_HISTORY_FORM.PLACEHOLDER_RATE}
          signed
          required
          disabled={pending}
          aria-invalid={fieldErrors.rate ? "true" : undefined}
        />
      </SharedFormField>
    </FieldGroup>
  )
}

export { BenchmarkHistoryFormFields }
