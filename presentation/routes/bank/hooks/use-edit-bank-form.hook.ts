"use client"

import { useEntityForm } from "@/presentation/parts/hooks/use-entity-form.hook"
import { updateBankAction } from "@/presentation/routes/bank/actions/update-bank.action"
import { BANK_FORM_SCHEMA } from "@/presentation/routes/bank/validations/bank-form.validations"
import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"

/**
 * @summary
 * Manages the edit bank form state, validation and
 * submission.
 *
 * @remarks
 * Wraps `useEntityForm` with the bank schema and the
 * update bank server action. Seeds the initial values
 * from the provided bank.
 *
 * @explanation
 * Use inside the edit bank form to keep the component
 * presentational. Pass the bank being edited so the
 * fields start with its current values. Wire the
 * returned inputs into controlled fields and call
 * `handleSubmit` on submit. Use `status` to trigger
 * result toasts.
 *
 * @param bank - Bank being edited.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { code, updateCode, name, updateName,
 *   fieldErrors, status, handleSubmit } =
 *   useEditBankForm(bank)
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useEditBankForm(bank: BankResponseDTO) {
  const {
    values: VALUES,
    updateField,
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  } = useEntityForm({
    schema: BANK_FORM_SCHEMA,
    initialValues: {
      code: bank.code,
      name: bank.name,
    },
    submit: (values) =>
      updateBankAction({
        bankId: bank.id,
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

export { useEditBankForm }
