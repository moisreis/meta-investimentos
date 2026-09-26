"use client"

import * as React from "react"

import { FieldGroup } from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"

import { FundCnpjInput } from "@/presentation/parts/components/fund-cnpj-input"
import { PortfolioPercentageInput } from "@/presentation/parts/components/portfolio-percentage-input"
import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"
import { useAddFundForm } from "@/presentation/routes/fund/hooks/use-add-fund-form.hook"

import { FUND_FORM } from "@/presentation/routes/fund/settings/labels.settings"

import { FundRegistryCombobox } from "./fund-registry-combobox"

import type { FundSelectOptions } from "../types/fund-list.types"

/**
 * Props for the add fund form.
 */
export interface AddFundFormProps {
  options: FundSelectOptions
  onStatusChange?: (
    status: EntityFormStatus,
    error: string | null
  ) => void
}

/**
 * @summary
 * Renders the add fund form.
 *
 * @remarks
 * Validates fields with **Zod** and shows
 * human-readable error messages.
 * Submits the fund to the create server action.
 * Shows loading state while submitting and reports
 * the submit status through `onStatusChange` so the
 * parent dialog can react to the outcome.
 *
 * @explanation
 * Use as the add component of the fund dialog flow.
 * The parent renders the result toast and the
 * follow-up prompt based on the reported status.
 *
 * @param props - Props of the add fund form.
 * @param props.options - The registry options.
 * @param props.onStatusChange - Reports submit outcomes.
 *
 * @returns The add fund form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function AddFundForm({
  options,
  onStatusChange,
}: AddFundFormProps) {
  const {
    cnpj,
    updateCnpj,
    name,
    updateName,
    bankId,
    updateBankId,
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
  } = useAddFundForm()

  React.useEffect(() => {
    onStatusChange?.(status, error)
  }, [status, error, onStatusChange])

  return (
    <SharedFormWrapper onSubmit={handleSubmit}>
      <FieldGroup>
        <SharedFormField
          label={FUND_FORM.FIELD_CNPJ}
          error={fieldErrors.cnpj}
          htmlFor="cnpj"
        >
          <FundCnpjInput
            id="cnpj"
            name="cnpj"
            required
            value={cnpj}
            onChange={updateCnpj}
            disabled={pending}
            aria-invalid={fieldErrors.cnpj ? "true" : undefined}
          />
        </SharedFormField>
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
          label={FUND_FORM.FIELD_BANK}
          error={fieldErrors.bankId}
          htmlFor="bankId"
        >
          <FundRegistryCombobox
            id="bankId"
            name="bankId"
            required
            value={bankId}
            onValueChange={updateBankId}
            placeholder={FUND_FORM.PLACEHOLDER_BANK}
            items={options.banks.map((bank) => ({
              id: bank.id,
              name: bank.name,
              description: bank.code,
            }))}
            disabled={pending}
            aria-invalid={
              fieldErrors.bankId ? "true" : undefined
            }
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
        label={FUND_FORM.ADD_BUTTON}
        pendingLabel={FUND_FORM.ADD_PENDING_BUTTON}
      />
    </SharedFormWrapper>
  )
}

export { AddFundForm }
