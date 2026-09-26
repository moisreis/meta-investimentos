"use client"

import * as React from "react"

import { FieldGroup } from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"

import { PortfolioPercentageInput } from "@/presentation/parts/components/portfolio-percentage-input"
import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"
import { useEditFundForm } from "@/presentation/routes/fund/hooks/use-edit-fund-form.hook"

import { FUND_FORM } from "@/presentation/routes/fund/settings/labels.settings"

import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"

import { FundRegistryCombobox } from "./fund-registry-combobox"

import type { FundSelectOptions } from "../types/fund-list.types"

/**
 * Props for the edit fund form.
 */
export interface EditFundFormProps {
  fund: FundResponseDTO
  options: FundSelectOptions
  onStatusChange?: (
    status: EntityFormStatus,
    error: string | null
  ) => void
}

/**
 * @summary
 * Renders the edit fund form.
 *
 * @remarks
 * Seeds the fields from the provided fund.
 * Validates fields with **Zod** and shows
 * human-readable error messages.
 * Submits the fund to the update server action.
 * Shows loading state while submitting and reports
 * the submit status through `onStatusChange` so the
 * parent dialog can react to the outcome.
 *
 * @explanation
 * Use as the edit component of the fund dialog flow.
 * The parent renders the result toast and closes on
 * success based on the reported status.
 *
 * @param props - Props of the edit fund form.
 * @param props.fund - Fund being edited.
 * @param props.options - The registry options.
 * @param props.onStatusChange - Reports submit outcomes.
 *
 * @returns The edit fund form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function EditFundForm({
  fund,
  options,
  onStatusChange,
}: EditFundFormProps) {
  const {
    name,
    updateName,
    benchmarkId,
    updateBenchmarkId,
    categoryId,
    updateCategoryId,
    administrationFee,
    updateAdministrationFee,
    performanceFee,
    updatePerformanceFee,
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  } = useEditFundForm(fund)

  React.useEffect(() => {
    onStatusChange?.(status, error)
  }, [status, error, onStatusChange])

  return (
    <SharedFormWrapper onSubmit={handleSubmit}>
      <FieldGroup>
        <SharedFormField
          label={FUND_FORM.FIELD_NAME}
          error={fieldErrors.name}
          htmlFor="fund-name"
        >
          <Input
            id="fund-name"
            type="text"
            name="name"
            autoComplete="off"
            placeholder="Ex.: Fundo Multi Mercado"
            required
            value={name}
            onChange={(e) => updateName(e.target.value)}
            disabled={pending}
            aria-invalid={fieldErrors.name ? "true" : undefined}
          />
        </SharedFormField>
        <SharedFormField
          label={FUND_FORM.FIELD_BENCHMARK}
          error={fieldErrors.benchmarkId}
          htmlFor="benchmarkId"
        >
          <FundRegistryCombobox
            id="benchmarkId"
            name="benchmarkId"
            value={benchmarkId}
            onValueChange={updateBenchmarkId}
            placeholder={FUND_FORM.PLACEHOLDER_BENCHMARK}
            items={options.benchmarks.map((benchmark) => ({
              id: benchmark.id,
              name: benchmark.name,
            }))}
            clearable
            disabled={pending}
            aria-invalid={
              fieldErrors.benchmarkId ? "true" : undefined
            }
          />
        </SharedFormField>
        <SharedFormField
          label={FUND_FORM.FIELD_CATEGORY}
          error={fieldErrors.categoryId}
          htmlFor="categoryId"
        >
          <FundRegistryCombobox
            id="categoryId"
            name="categoryId"
            value={categoryId}
            onValueChange={updateCategoryId}
            placeholder={FUND_FORM.PLACEHOLDER_CATEGORY}
            items={options.categories.map((category) => ({
              id: category.id,
              name: category.name,
            }))}
            clearable
            disabled={pending}
            aria-invalid={
              fieldErrors.categoryId ? "true" : undefined
            }
          />
        </SharedFormField>
        <SharedFormField
          label={FUND_FORM.FIELD_ADMINISTRATION_FEE}
          description={FUND_FORM.DESCRIPTION_ADMINISTRATION_FEE}
          error={fieldErrors.administrationFee}
          htmlFor="administrationFee"
        >
          <PortfolioPercentageInput
            id="administrationFee"
            value={administrationFee}
            onChange={(value: string) =>
              updateAdministrationFee(value)
            }
            disabled={pending}
            aria-invalid={
              fieldErrors.administrationFee ? "true" : undefined
            }
          />
        </SharedFormField>
        <SharedFormField
          label={FUND_FORM.FIELD_PERFORMANCE_FEE}
          description={FUND_FORM.DESCRIPTION_PERFORMANCE_FEE}
          error={fieldErrors.performanceFee}
          htmlFor="performanceFee"
        >
          <PortfolioPercentageInput
            id="performanceFee"
            value={performanceFee}
            onChange={(value: string) =>
              updatePerformanceFee(value)
            }
            disabled={pending}
            aria-invalid={
              fieldErrors.performanceFee ? "true" : undefined
            }
          />
        </SharedFormField>
      </FieldGroup>

      <SharedSubmitButton
        pending={pending}
        label={FUND_FORM.EDIT_BUTTON}
        pendingLabel={FUND_FORM.EDIT_PENDING_BUTTON}
      />
    </SharedFormWrapper>
  )
}

export { EditFundForm }
