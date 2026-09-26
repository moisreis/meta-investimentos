"use client"

import { useEntityForm } from "@/presentation/parts/hooks/use-entity-form.hook"
import { createBankAccountAction } from "@/presentation/routes/bank-account/actions/create-bank-account.action"
import { BANK_ACCOUNT_FORM_SCHEMA } from "@/presentation/routes/bank-account/validations/bank-account-form.validations"

/**
 * @summary
 * Manages the add bank account form state, validation
 * and submission.
 *
 * @remarks
 * Wraps `useEntityForm` with the bank account schema
 * and the create server action.
 *
 * @explanation
 * Use inside the add bank account form to keep the
 * component presentational. Wire the returned inputs
 * into controlled fields and call `handleSubmit` on
 * submit. Render `fieldErrors` per field to show
 * readable messages. Use `status` to trigger result
 * toasts.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { portfolioId, updatePortfolioId, bankId,
 *   updateBankId, agency, updateAgency,
 *   accountNumber, updateAccountNumber, fieldErrors,
 *   status, handleSubmit } = useAddBankAccountForm()
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useAddBankAccountForm() {
  const {
    values: VALUES,
    updateField,
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  } = useEntityForm({
    schema: BANK_ACCOUNT_FORM_SCHEMA,
    initialValues: {
      portfolioId: "",
      bankId: "",
      agency: "",
      accountNumber: "",
    },
    submit: (values) =>
      createBankAccountAction({
        portfolioId: values.portfolioId,
        bankId: values.bankId,
        agency: values.agency,
        accountNumber: values.accountNumber,
      }),
  })

  return {
    portfolioId: VALUES.portfolioId,
    updatePortfolioId: (value: string) =>
      updateField("portfolioId", value),
    bankId: VALUES.bankId,
    updateBankId: (value: string) =>
      updateField("bankId", value),
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

export { useAddBankAccountForm }
