"use client"

import { UnmaskPercentage } from "@/presentation/masks/percentage.mask"
import { usePortfolioForm } from "@/presentation/parts/hooks/use-portfolio-form.hook"
import { createPortfolioAction } from "@/presentation/routes/portfolio/actions/create-portfolio.action"
import { PORTFOLIO_FORM_SCHEMA } from "@/presentation/routes/portfolio/validations/portfolio-form.validations"

/**
 * @summary
 * Manages the add portfolio form state, validation and
 * submission.
 *
 * @remarks
 * Wraps `usePortfolioForm` with the portfolio schema and the
 * create portfolio server action, unmasking the percentage
 * fields before they are sent.
 *
 * @explanation
 * Use inside the add portfolio form to keep the component
 * presentational. Wire the returned inputs into controlled
 * fields and call `handleSubmit` on submit. Render
 * `fieldErrors` per field to show human-readable messages.
 * Use `status` to trigger result toasts.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { acronym, updateAcronym, name, updateName,
 *   fieldErrors, status, handleSubmit } = useAddPortfolioForm()
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function useAddPortfolioForm() {
  const {
    values: VALUES,
    updateField,
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  } = usePortfolioForm({
    schema: PORTFOLIO_FORM_SCHEMA,
    initialValues: {
      acronym: "",
      name: "",
      annualInterestRate: "",
      minAllocation: "",
      maxAllocation: "",
      targetAllocation: "",
    },
    submit: (values) =>
      createPortfolioAction({
        acronym: values.acronym,
        name: values.name,
        annualInterestRate: UnmaskPercentage(
          values.annualInterestRate
        ),
        minAllocation: UnmaskPercentage(values.minAllocation),
        maxAllocation: UnmaskPercentage(values.maxAllocation),
        targetAllocation: UnmaskPercentage(
          values.targetAllocation
        ),
      }),
  })

  return {
    acronym: VALUES.acronym,
    updateAcronym: (value: string) =>
      updateField("acronym", value),
    name: VALUES.name,
    updateName: (value: string) => updateField("name", value),
    annualInterestRate: VALUES.annualInterestRate,
    updateAnnualInterestRate: (value: string) =>
      updateField("annualInterestRate", value),
    minAllocation: VALUES.minAllocation,
    updateMinAllocation: (value: string) =>
      updateField("minAllocation", value),
    maxAllocation: VALUES.maxAllocation,
    updateMaxAllocation: (value: string) =>
      updateField("maxAllocation", value),
    targetAllocation: VALUES.targetAllocation,
    updateTargetAllocation: (value: string) =>
      updateField("targetAllocation", value),
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  }
}

export { useAddPortfolioForm }
