"use client"

import * as React from "react"

import { PortfolioMoneyInput } from "@/presentation/parts/components/portfolio-money-input"
import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { PortfolioFormStatus } from "@/presentation/parts/hooks/use-portfolio-form.hook"
import { FieldGroup } from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"
import { FormatDate } from "@/presentation/presenters/date.presenter"
import { ResolveBankAccountLabel } from "@/presentation/routes/checking-account/helpers/build-checking-account-name-lookups.helper"

import { CHECKING_ACCOUNT_FORM } from "../settings/labels.settings"

import type { CheckingAccountResponseDTO } from "@/services/checking-account/dto/checking-account-response.dto"
import type { CheckingAccountNameLookups } from "../types/checking-account-list.types"
import { useEditCheckingAccountForm } from "../hooks/use-edit-checking-account-form.hook"

/**
 * Props for the edit checking account form.
 */
export interface EditCheckingAccountFormProps {
  entry: CheckingAccountResponseDTO
  names: CheckingAccountNameLookups
  onStatusChange?: (
    status: PortfolioFormStatus,
    error: string | null
  ) => void
}

/**
 * @summary
 * Renders the edit checking account form.
 *
 * @remarks
 * Seeds the value field from the provided balance.
 * Shows the bank account and the date as read-only
 * context, since the entity exposes only the value
 * update. Validates fields with **Zod** and shows
 * human-readable error messages.
 * Submits the balance to the update server action.
 * Shows loading state while submitting and reports
 * the submit status through `onStatusChange` so the
 * parent dialog can react to the outcome.
 *
 * @explanation
 * Use as the edit component of the checking account
 * dialog flow. The parent renders the result toast
 * based on the reported status.
 *
 * @param props - Props of the edit checking account form.
 * @param props.entry - The balance being edited.
 * @param props.names - The bank account name lookups.
 * @param props.onStatusChange - Reports submit outcomes.
 *
 * @returns The edit checking account form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function EditCheckingAccountForm({
  entry,
  names,
  onStatusChange,
}: EditCheckingAccountFormProps) {
  const {
    value,
    updateValue,
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  } = useEditCheckingAccountForm(entry)

  React.useEffect(() => {
    onStatusChange?.(status, error)
  }, [status, error, onStatusChange])

  return (
    <SharedFormWrapper onSubmit={handleSubmit}>
      <FieldGroup>
        <SharedFormField
          label={CHECKING_ACCOUNT_FORM.FIELD_BANK_ACCOUNT}
          htmlFor="edit-bank-account"
        >
          <Input
            id="edit-bank-account"
            type="text"
            readOnly
            disabled
            value={ResolveBankAccountLabel(
              names,
              entry.bankAccountId
            )}
          />
        </SharedFormField>
        <SharedFormField
          label={CHECKING_ACCOUNT_FORM.FIELD_DATE}
          htmlFor="edit-checking-account-date"
        >
          <Input
            id="edit-checking-account-date"
            type="text"
            readOnly
            disabled
            value={FormatDate(entry.date)}
          />
        </SharedFormField>
        <SharedFormField
          label={CHECKING_ACCOUNT_FORM.FIELD_VALUE}
          description={CHECKING_ACCOUNT_FORM.DESCRIPTION_VALUE}
          error={fieldErrors.value}
          htmlFor="edit-checking-account-value"
        >
          <PortfolioMoneyInput
            id="edit-checking-account-value"
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
        label={CHECKING_ACCOUNT_FORM.EDIT_BUTTON}
        pendingLabel={CHECKING_ACCOUNT_FORM.EDIT_PENDING_BUTTON}
      />
    </SharedFormWrapper>
  )
}

export { EditCheckingAccountForm }
