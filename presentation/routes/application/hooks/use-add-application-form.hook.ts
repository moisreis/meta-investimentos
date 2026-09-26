"use client"

import { UnmaskCurrency } from "@/presentation/masks/currency.mask"
import { useEntityForm } from "@/presentation/parts/hooks/use-entity-form.hook"
import { addApplicationAction } from "@/presentation/routes/application/actions/add-application.action"
import { APPLICATION_FORM_SCHEMA } from "@/presentation/routes/application/validations/application-form.validations"

/**
 * @summary
 * Manages the add application form state, validation and
 * submission.
 *
 * @remarks
 * Wraps `useEntityForm` with the application schema
 * and the add application server action. The amount is
 * unmasked before it leaves the browser; the quotas are
 * never part of the payload because the server derives
 * them from the quota price of the chosen date.
 *
 * @explanation
 * Use inside the add application form to keep the
 * component presentational. Wire the returned inputs into
 * controlled fields and call `handleSubmit` on submit.
 * Render `fieldErrors` per field to show readable
 * messages. Use `status` to trigger result toasts.
 *
 * @param portfolioId - Portfolio receiving the
 * application. Supplied by the parent screen.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { fundId, updateFundId, date, updateDate,
 *   amount, updateAmount, fieldErrors, status,
 *   handleSubmit } = useAddApplicationForm(PORTFOLIO_ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useAddApplicationForm(portfolioId: string) {
  const {
    values: VALUES,
    updateField,
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  } = useEntityForm({
    schema: APPLICATION_FORM_SCHEMA,
    initialValues: {
      fundId: "",
      date: "",
      amount: "",
    },
    submit: (values) =>
      addApplicationAction({
        portfolioId,
        fundId: values.fundId,
        date: values.date,
        amount: UnmaskCurrency(values.amount),
      }),
  })

  return {
    fundId: VALUES.fundId,
    updateFundId: (value: string) =>
      updateField("fundId", value),
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

export { useAddApplicationForm }
