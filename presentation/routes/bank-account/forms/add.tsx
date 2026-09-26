"use client"

import * as React from "react"

import { FieldGroup } from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"

import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"

import { BANK_ACCOUNT_FORM } from "../settings/labels.settings"
import type { BankAccountSelectOptions } from "../types/bank-account-list.types"
import { useAddBankAccountForm } from "../hooks/use-add-bank-account-form.hook"
import { BankAccountRegistryCombobox } from "./registry-combobox"

/**
 * Props for the add bank account form.
 */
export interface AddBankAccountFormProps {
  options: BankAccountSelectOptions
  onStatusChange?: (
    status: EntityFormStatus,
    error: string | null
  ) => void
}

/**
 * @summary
 * Renders the add bank account form.
 *
 * @remarks
 * Validates fields with **Zod** and shows
 * human-readable error messages.
 * Submits the bank account to the create server action.
 * Shows loading state while submitting and reports the
 * submit status through `onStatusChange` so the parent
 * dialog can react to the outcome.
 *
 * @explanation
 * Use as the add component of the bank account dialog
 * flow. The parent renders the result toast and the
 * follow-up prompt based on the reported status.
 *
 * @param props - Props of the add bank account form.
 * @param props.options - The registry options.
 * @param props.onStatusChange - Reports submit outcomes.
 *
 * @returns The add bank account form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function AddBankAccountForm({
  options,
  onStatusChange,
}: AddBankAccountFormProps) {
  const {
    portfolioId,
    updatePortfolioId,
    bankId,
    updateBankId,
    agency,
    updateAgency,
    accountNumber,
    updateAccountNumber,
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  } = useAddBankAccountForm()

  const PORTFOLIO_ITEMS = options.portfolios.map(
    (portfolio) => ({
      id: portfolio.id,
      name: portfolio.name,
      description: portfolio.acronym,
    })
  )

  const BANK_ITEMS = options.banks.map((bank) => ({
    id: bank.id,
    name: bank.name,
    description: `Código ${bank.code}`,
  }))

  React.useEffect(() => {
    onStatusChange?.(status, error)
  }, [status, error, onStatusChange])

  return (
    <SharedFormWrapper onSubmit={handleSubmit}>
      <FieldGroup>
        <SharedFormField
          label={BANK_ACCOUNT_FORM.FIELD_PORTFOLIO}
          description={BANK_ACCOUNT_FORM.DESCRIPTION_PORTFOLIO}
          error={fieldErrors.portfolioId}
          htmlFor="portfolioId"
        >
          <BankAccountRegistryCombobox
            id="portfolioId"
            name="portfolioId"
            required
            value={portfolioId}
            onValueChange={updatePortfolioId}
            placeholder={BANK_ACCOUNT_FORM.PLACEHOLDER_PORTFOLIO}
            items={PORTFOLIO_ITEMS}
            disabled={pending}
            aria-invalid={
              fieldErrors.portfolioId ? "true" : undefined
            }
          />
        </SharedFormField>
        <SharedFormField
          label={BANK_ACCOUNT_FORM.FIELD_BANK}
          description={BANK_ACCOUNT_FORM.DESCRIPTION_BANK}
          error={fieldErrors.bankId}
          htmlFor="bankId"
        >
          <BankAccountRegistryCombobox
            id="bankId"
            name="bankId"
            required
            value={bankId}
            onValueChange={updateBankId}
            placeholder={BANK_ACCOUNT_FORM.PLACEHOLDER_BANK}
            items={BANK_ITEMS}
            disabled={pending}
            aria-invalid={
              fieldErrors.bankId ? "true" : undefined
            }
          />
        </SharedFormField>
        <SharedFormField
          label={BANK_ACCOUNT_FORM.FIELD_AGENCY}
          description={BANK_ACCOUNT_FORM.DESCRIPTION_AGENCY}
          error={fieldErrors.agency}
          htmlFor="bank-account-agency"
        >
          <Input
            id="bank-account-agency"
            name="agency"
            type="text"
            required
            value={agency}
            onChange={(event) =>
              updateAgency(event.target.value)
            }
            placeholder={BANK_ACCOUNT_FORM.PLACEHOLDER_AGENCY}
            disabled={pending}
            aria-invalid={
              fieldErrors.agency ? "true" : undefined
            }
          />
        </SharedFormField>
        <SharedFormField
          label={BANK_ACCOUNT_FORM.FIELD_ACCOUNT_NUMBER}
          description={
            BANK_ACCOUNT_FORM.DESCRIPTION_ACCOUNT_NUMBER
          }
          error={fieldErrors.accountNumber}
          htmlFor="bank-account-number"
        >
          <Input
            id="bank-account-number"
            name="accountNumber"
            type="text"
            required
            value={accountNumber}
            onChange={(event) =>
              updateAccountNumber(event.target.value)
            }
            placeholder={
              BANK_ACCOUNT_FORM.PLACEHOLDER_ACCOUNT_NUMBER
            }
            disabled={pending}
            aria-invalid={
              fieldErrors.accountNumber ? "true" : undefined
            }
          />
        </SharedFormField>
      </FieldGroup>

      <SharedSubmitButton
        pending={pending}
        label={BANK_ACCOUNT_FORM.ADD_BUTTON}
        pendingLabel={BANK_ACCOUNT_FORM.ADD_PENDING_BUTTON}
      />
    </SharedFormWrapper>
  )
}

export { AddBankAccountForm }
