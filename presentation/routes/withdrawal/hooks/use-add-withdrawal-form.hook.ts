"use client"

import { UnmaskCurrency } from "@/presentation/masks/currency.mask"
import { useEntityForm } from "@/presentation/parts/hooks/use-entity-form.hook"
import { addWithdrawalAction } from "@/presentation/routes/withdrawal/actions/add-withdrawal.action"
import { WITHDRAWAL_FORM_SCHEMA } from "@/presentation/routes/withdrawal/validations/withdrawal-form.validations"

/**
 * @summary
 * Manages the add withdrawal form state, validation and
 * submission.
 *
 * @remarks
 * Wraps `useEntityForm` with the withdrawal schema
 * and the add withdrawal server action. The amount is
 * unmasked before it leaves the browser; the quotas are
 * never part of the payload because the server derives
 * them from the quota price of the chosen date.
 *
 * @explanation
 * Use inside the add withdrawal form to keep the
 * component presentational. Wire the returned inputs into
 * controlled fields and call `handleSubmit` on submit.
 * Render `fieldErrors` per field to show readable
 * messages. Use `status` to trigger result toasts.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { positionId, updatePositionId, date, updateDate,
 *   amount, updateAmount, fieldErrors, status,
 *   handleSubmit } = useAddWithdrawalForm();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useAddWithdrawalForm() {
  const {
    values: VALUES,
    updateField,
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  } = useEntityForm({
    schema: WITHDRAWAL_FORM_SCHEMA,
    initialValues: {
      positionId: "",
      date: "",
      amount: "",
    },
    submit: (values) =>
      addWithdrawalAction({
        positionId: values.positionId,
        date: values.date,
        amount: UnmaskCurrency(values.amount),
      }),
  })

  return {
    positionId: VALUES.positionId,
    updatePositionId: (value: string) =>
      updateField("positionId", value),
    date: VALUES.date,
    updateDate: (value: string) => updateField("date", value),
    amount: VALUES.amount,
    updateAmount: (value: string) =>
      updateField("amount", value),
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  }
}

export { useAddWithdrawalForm }
