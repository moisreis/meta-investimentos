"use client"

import { usePortfolioForm } from "@/presentation/parts/hooks/use-portfolio-form.hook"
import { createBankAction } from "@/presentation/routes/bank/actions/create-bank.action"
import { BANK_FORM_SCHEMA } from "@/presentation/routes/bank/validations/bank-form.validations"

/**
 * @summary
 * Manages the add bank form state, validation and
 * submission.
 *
 * @remarks
 * Wraps `usePortfolioForm` with the bank schema and the
 * create bank server action.
 *
 * @explanation
 * Use inside the add bank form to keep the component
 * presentational. Wire the returned inputs into
 * controlled fields and call `handleSubmit` on submit.
 * Render `fieldErrors` per field to show readable
 * messages. Use `status` to trigger result toasts.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { code, updateCode, name, updateName,
 *   fieldErrors, status, handleSubmit } =
 *   useAddBankForm()
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useAddBankForm() {
  const {
    values: VALUES,
    updateField,
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  } = usePortfolioForm({
    schema: BANK_FORM_SCHEMA,
    initialValues: {
      code: "",
      name: "",
    },
    submit: (values) =>
      createBankAction({
        code: values.code,
        name: values.name,
      }),
  })

  return {
    code: VALUES.code,
    updateCode: (value: string) => updateField("code", value),
    name: VALUES.name,
    updateName: (value: string) => updateField("name", value),
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  }
}

export { useAddBankForm }
