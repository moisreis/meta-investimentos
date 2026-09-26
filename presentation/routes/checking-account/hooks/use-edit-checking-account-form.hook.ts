"use client"

import {
  MaskCurrency,
  UnmaskCurrency,
} from "@/presentation/masks/currency.mask"
import { useEntityForm } from "@/presentation/parts/hooks/use-entity-form.hook"
import { updateCheckingAccountAction } from "@/presentation/routes/checking-account/actions/update-checking-account.action"
import { CHECKING_ACCOUNT_EDIT_FORM_SCHEMA } from "@/presentation/routes/checking-account/validations/checking-account-form.validations"
import type { CheckingAccountResponseDTO } from "@/services/checking-account/dto/checking-account-response.dto"

/**
 * @summary
 * Manages the edit checking account form state,
 * validation and submission.
 *
 * @remarks
 * Wraps `useEntityForm` with the checking account
 * edit schema and the update server action. Seeds the
 * initial value from the provided balance.
 *
 * @explanation
 * Use inside the edit checking account form to keep the
 * component presentational. Pass the balance being
 * edited so the value field starts with its current
 * amount. Wire the returned inputs into controlled
 * fields and call `handleSubmit` on submit. Use
 * `status` to trigger result toasts.
 *
 * @param entry - Balance being edited.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { value, updateValue, fieldErrors, status,
 *   handleSubmit } = useEditCheckingAccountForm(entry)
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useEditCheckingAccountForm(
  entry: CheckingAccountResponseDTO
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
    schema: CHECKING_ACCOUNT_EDIT_FORM_SCHEMA,
    initialValues: {
      value: MaskCurrency(entry.value),
    },
    submit: (values) =>
      updateCheckingAccountAction({
        checkingAccountId: entry.id,
        value: UnmaskCurrency(values.value),
      }),
  })

  return {
    value: VALUES.value,
    updateValue: (value: string) => updateField("value", value),
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  }
}

export { useEditCheckingAccountForm }
