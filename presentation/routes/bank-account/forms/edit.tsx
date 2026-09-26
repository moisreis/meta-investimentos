"use client"

import * as React from "react"

import { FieldGroup } from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"

import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"

import { BANK_ACCOUNT_FORM } from "../settings/labels.settings"
import type { BankAccountNameLookups } from "../types/bank-account-list.types"
import { useEditBankAccountForm } from "../hooks/use-edit-bank-account-form.hook"
import type { BankAccountResponseDTO } from "@/services/bank-account/dto/bank-account-response.dto"

/**
 * Props for the edit bank account form.
 */
export interface EditBankAccountFormProps {
  bankAccount: BankAccountResponseDTO
  names: BankAccountNameLookups
  onStatusChange?: (
    status: EntityFormStatus,
    error: string | null
  ) => void
}

/**
 * @summary
 * Renders the edit bank account form.
 *
 * @remarks
 * Seeds the agency and account number fields from the
 * provided bank account. Shows the portfolio and the
 * bank as read-only context, since the entity exposes
 * only the agency and account number updates. Validates
 * fields with **Zod** and shows human-readable error
 * messages. Submits the bank account to the update
 * server action. Shows loading state while submitting
 * and reports the submit status through
 * `onStatusChange` so the parent dialog can react to
 * the outcome.
 *
 * @explanation
 * Use as the edit component of the bank account dialog
 * flow. The parent renders the result toast and closes
 * on success based on the reported status.
 *
 * @param props - Props of the edit bank account form.
 * @param props.bankAccount - The bank account being
 *                           edited.
 * @param props.names - The bank account name lookups.
 * @param props.onStatusChange - Reports submit outcomes.
 *
 * @returns The edit bank account form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function EditBankAccountForm({
  bankAccount,
  names,
  onStatusChange,
}: EditBankAccountFormProps) {
  const {
    agency,
    updateAgency,
    accountNumber,
    updateAccountNumber,
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  } = useEditBankAccountForm(bankAccount)

  const LOOKUP = names.bankAccounts[bankAccount.id]

  React.useEffect(() => {
    onStatusChange?.(status, error)
  }, [status, error, onStatusChange])

  return (
    <SharedFormWrapper onSubmit={handleSubmit}>
      <FieldGroup>
        <SharedFormField
          label={BANK_ACCOUNT_FORM.FIELD_PORTFOLIO}
          htmlFor="edit-bank-account-portfolio"
        >
          <Input
            id="edit-bank-account-portfolio"
            type="text"
            readOnly
            disabled
            value={LOOKUP?.portfolioName ?? "Carteira"}
          />
        </SharedFormField>
        <SharedFormField
          label={BANK_ACCOUNT_FORM.FIELD_BANK}
          htmlFor="edit-bank-account-bank"
        >
          <Input
            id="edit-bank-account-bank"
            type="text"
            readOnly
            disabled
            value={LOOKUP?.bankName ?? "Banco"}
          />
        </SharedFormField>
        <SharedFormField
          label={BANK_ACCOUNT_FORM.FIELD_AGENCY}
          description={BANK_ACCOUNT_FORM.DESCRIPTION_AGENCY}
          error={fieldErrors.agency}
          htmlFor="edit-bank-account-agency"
        >
          <Input
            id="edit-bank-account-agency"
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
          htmlFor="edit-bank-account-number"
        >
          <Input
            id="edit-bank-account-number"
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
        label={BANK_ACCOUNT_FORM.EDIT_BUTTON}
        pendingLabel={BANK_ACCOUNT_FORM.EDIT_PENDING_BUTTON}
      />
    </SharedFormWrapper>
  )
}

export { EditBankAccountForm }
