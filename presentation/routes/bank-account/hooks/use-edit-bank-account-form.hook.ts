"use client"

import { useEntityForm } from "@/presentation/parts/hooks/use-entity-form.hook"
import { updateBankAccountAction } from "@/presentation/routes/bank-account/actions/update-bank-account.action"
import { BANK_ACCOUNT_EDIT_FORM_SCHEMA } from "@/presentation/routes/bank-account/validations/bank-account-form.validations"
import type { BankAccountResponseDTO } from "@/services/bank-account/dto/bank-account-response.dto"

/**
 * @summary
 * Manages the edit bank account form state, validation
 * and submission.
 *
 * @remarks
 * Wraps `useEntityForm` with the bank account edit
 * schema and the update server action. Seeds the
 * initial values from the provided bank account.
 *
 * @explanation
 * Use inside the edit bank account form to keep the
 * component presentational. Pass the bank account being
 * edited so the fields start with its current values.
 * Wire the returned inputs into controlled fields and
 * call `handleSubmit` on submit. Use `status` to
 * trigger result toasts.
 *
 * @param bankAccount - Bank account being edited.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { agency, updateAgency, accountNumber,
 *   updateAccountNumber, fieldErrors, status,
 *   handleSubmit } = useEditBankAccountForm(bankAccount)
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useEditBankAccountForm(
  bankAccount: BankAccountResponseDTO
) {
  const {
    values: VALUES,
    updateField,
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  } = useEntityForm({
    schema: BANK_ACCOUNT_EDIT_FORM_SCHEMA,
    initialValues: {
      agency: bankAccount.agency,
      accountNumber: bankAccount.accountNumber,
    },
    submit: (values) =>
      updateBankAccountAction({
        bankAccountId: bankAccount.id,
        agency: values.agency,
        accountNumber: values.accountNumber,
      }),
  })

  return {
    agency: VALUES.agency,
    updateAgency: (value: string) =>
      updateField("agency", value),
    accountNumber: VALUES.accountNumber,
    updateAccountNumber: (value: string) =>
      updateField("accountNumber", value),
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  }
}

export { useEditBankAccountForm }
