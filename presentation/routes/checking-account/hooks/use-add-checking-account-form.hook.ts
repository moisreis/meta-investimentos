"use client"

import { UnmaskMoney } from "@/presentation/masks/money.mask"
import { usePortfolioForm } from "@/presentation/parts/hooks/use-portfolio-form.hook"
import { createCheckingAccountAction } from "@/presentation/routes/checking-account/actions/create-checking-account.action"
import { CHECKING_ACCOUNT_FORM_SCHEMA } from "@/presentation/routes/checking-account/validations/checking-account-form.validations"

/**
 * @summary
 * Manages the add checking account form state,
 * validation and submission.
 *
 * @remarks
 * Wraps `usePortfolioForm` with the checking account
 * schema and the record server action.
 *
 * @explanation
 * Use inside the add checking account form to keep the
 * component presentational. Wire the returned inputs
 * into controlled fields and call `handleSubmit` on
 * submit. Render `fieldErrors` per field to show
 * readable messages. Use `status` to trigger result
 * toasts.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { value, updateValue, bankAccountId,
 *   updateBankAccountId, fieldErrors, status,
 *   handleSubmit } = useAddCheckingAccountForm()
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useAddCheckingAccountForm() {
  const {
    values: VALUES,
    updateField,
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  } = usePortfolioForm({
    schema: CHECKING_ACCOUNT_FORM_SCHEMA,
    initialValues: {
      bankAccountId: "",
      date: "",
      value: "",
    },
    submit: (values) =>
      createCheckingAccountAction({
        bankAccountId: values.bankAccountId,
        date: values.date,
        value: UnmaskMoney(values.value),
      }),
  })

  return {
    bankAccountId: VALUES.bankAccountId,
    updateBankAccountId: (value: string) =>
      updateField("bankAccountId", value),
    date: VALUES.date,
    updateDate: (value: string) => updateField("date", value),
    value: VALUES.value,
    updateValue: (value: string) => updateField("value", value),
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  }
}

export { useAddCheckingAccountForm }
