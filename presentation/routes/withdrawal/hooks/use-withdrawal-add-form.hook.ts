"use client"

import { useCallback, useState } from "react"

import { UnmaskCurrency } from "@/presentation/masks/currency.mask"
import { useEntityForm } from "@/presentation/parts/hooks/use-entity-form.hook"
import { addWithdrawalAction } from "@/presentation/routes/withdrawal/actions/add-withdrawal.action"
import { WITHDRAWAL_FORM_SCHEMA } from "@/presentation/routes/withdrawal/validations/withdrawal-form.validation"

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
 * The portfolio is deliberately **not** part of the
 * submitted values: it only narrows the position picker,
 * and the position already identifies its own portfolio on
 * the server. Keeping it out of the schema also keeps the
 * client payload and the action schema from drifting apart.
 *
 * Changing the portfolio clears the selected position,
 * because a position of the previous portfolio is not a
 * valid choice under the new one.
 *
 * @explanation
 * Use inside the add withdrawal form to keep the
 * component presentational. Wire the returned inputs into
 * controlled fields and call `handleSubmit` on submit.
 * Render `fieldErrors` per field to show readable
 * messages. Use `status` to trigger result toasts.
 *
 * @param defaultPortfolioId - Portfolio preselected in the
 * form. The portfolio detail screen passes its own id so
 * the dialog opens already scoped; the withdrawal list
 * screen passes nothing and the user picks the portfolio.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { portfolioId, updatePortfolioId, positionId,
 *   updatePositionId, date, updateDate, amount,
 *   updateAmount, fieldErrors, status,
 *   handleSubmit } = useWithdrawalAddForm();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useWithdrawalAddForm(defaultPortfolioId?: string) {
  const [PORTFOLIO_ID, setPortfolioId] = useState(
    defaultPortfolioId ?? ""
  )

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

  const UPDATE_PORTFOLIO_ID = useCallback(
    (value: string) => {
      setPortfolioId(value)
      updateField("positionId", "")
    },
    [updateField]
  )

  return {
    portfolioId: PORTFOLIO_ID,
    updatePortfolioId: UPDATE_PORTFOLIO_ID,
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

export { useWithdrawalAddForm }
