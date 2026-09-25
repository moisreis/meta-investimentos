"use client"

import * as React from "react"

import { PortfolioMoneyInput } from "@/presentation/parts/components/portfolio-money-input"
import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { PortfolioFormStatus } from "@/presentation/parts/hooks/use-portfolio-form.hook"
import { FieldGroup } from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"
import { FormatBankAccountLabel } from "@/presentation/routes/checking-account/helpers/build-checking-account-name-lookups.helper"

import { CHECKING_ACCOUNT_FORM } from "../settings/labels.settings"

import type { CheckingAccountSelectOptions } from "../types/checking-account-list.types"
import { useAddCheckingAccountForm } from "../hooks/use-add-checking-account-form.hook"
import { BankAccountCombobox } from "./bank-account-combobox"

/**
 * Props for the add checking account form.
 */
export interface AddCheckingAccountFormProps {
  options: CheckingAccountSelectOptions
  onStatusChange?: (
    status: PortfolioFormStatus,
    error: string | null
  ) => void
}

/**
 * @summary
 * Renders the add checking account form.
 *
 * @remarks
 * Validates fields with **Zod** and shows
 * human-readable error messages.
 * Submits the balance to the record server action.
 * Shows loading state while submitting and reports
 * the submit status through `onStatusChange` so the
 * parent dialog can react to the outcome.
 *
 * @explanation
 * Use as the add component of the checking account
 * dialog flow. The parent renders the result toast and
 * the follow-up prompt based on the reported status.
 *
 * @param props - Props of the add checking account form.
 * @param props.options - The registry options.
 * @param props.onStatusChange - Reports submit outcomes.
 *
 * @returns The add checking account form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function AddCheckingAccountForm({
  options,
  onStatusChange,
}: AddCheckingAccountFormProps) {
  const {
    bankAccountId,
    updateBankAccountId,
    date,
    updateDate,
    value,
    updateValue,
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  } = useAddCheckingAccountForm()

  React.useEffect(() => {
    onStatusChange?.(status, error)
  }, [status, error, onStatusChange])

  const BANK_NAMES = new Map(
    options.banks.map((bank) => [bank.id, bank.name])
  )

  const BANK_ACCOUNT_ITEMS = options.bankAccounts.map(
    (account) => ({
      id: account.id,
      name: BANK_NAMES.get(account.bankId) ?? "Banco",
      description: FormatBankAccountLabel(
        account.agency,
        account.accountNumber
      ),
    })
  )

  return (
    <SharedFormWrapper onSubmit={handleSubmit}>
      <FieldGroup>
        <SharedFormField
          label={CHECKING_ACCOUNT_FORM.FIELD_BANK_ACCOUNT}
          description={
            CHECKING_ACCOUNT_FORM.DESCRIPTION_BANK_ACCOUNT
          }
          error={fieldErrors.bankAccountId}
          htmlFor="bankAccountId"
        >
          <BankAccountCombobox
            id="bankAccountId"
            name="bankAccountId"
            required
            value={bankAccountId}
            onValueChange={updateBankAccountId}
            placeholder={
              CHECKING_ACCOUNT_FORM.PLACEHOLDER_BANK_ACCOUNT
            }
            items={BANK_ACCOUNT_ITEMS}
            disabled={pending}
            aria-invalid={
              fieldErrors.bankAccountId ? "true" : undefined
            }
          />
        </SharedFormField>
        <SharedFormField
          label={CHECKING_ACCOUNT_FORM.FIELD_DATE}
          error={fieldErrors.date}
          htmlFor="checking-account-date"
        >
          <Input
            id="checking-account-date"
            type="date"
            name="date"
            required
            value={date}
            onChange={(e) => updateDate(e.target.value)}
            disabled={pending}
            aria-invalid={fieldErrors.date ? "true" : undefined}
          />
        </SharedFormField>
        <SharedFormField
          label={CHECKING_ACCOUNT_FORM.FIELD_VALUE}
          description={CHECKING_ACCOUNT_FORM.DESCRIPTION_VALUE}
          error={fieldErrors.value}
          htmlFor="checking-account-value"
        >
          <PortfolioMoneyInput
            id="checking-account-value"
            name="value"
            required
            value={value}
            onChange={(next) => updateValue(next)}
            disabled={pending}
            aria-invalid={fieldErrors.value ? "true" : undefined}
          />
        </SharedFormField>
      </FieldGroup>

      <SharedSubmitButton
        pending={pending}
        label={CHECKING_ACCOUNT_FORM.ADD_BUTTON}
        pendingLabel={CHECKING_ACCOUNT_FORM.ADD_PENDING_BUTTON}
      />
    </SharedFormWrapper>
  )
}

export { AddCheckingAccountForm }
