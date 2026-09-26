"use client"

import { usePortfolioForm } from "@/presentation/parts/hooks/use-portfolio-form.hook"

import { generateStatementAction } from "../actions/generate-statement.action"
import { GENERATE_STATEMENT_SCHEMA } from "../validations/generate-statement.validations"

/**
 * @summary
 * Manages the generate statement form state, validation and
 * submission.
 *
 * @remarks
 * Wraps the shared form hook with the generate schema and
 * the generate statement server action.
 *
 * @explanation
 * Use inside the generate report form to keep the component
 * presentational. Wire the returned inputs into controlled
 * fields and call `handleSubmit` on submit.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { portfolioId, updatePortfolioId, month, updateMonth,
 *   fieldErrors, status, handleSubmit } = useGenerateStatementForm()
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useGenerateStatementForm() {
  const {
    values: VALUES,
    updateField,
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  } = usePortfolioForm({
    schema: GENERATE_STATEMENT_SCHEMA,
    initialValues: {
      portfolioId: "",
      month: "",
    },
    submit: (values) =>
      generateStatementAction({
        portfolioId: values.portfolioId,
        month: values.month,
      }),
  })

  return {
    portfolioId: VALUES.portfolioId,
    updatePortfolioId: (value: string) =>
      updateField("portfolioId", value),
    month: VALUES.month,
    updateMonth: (value: string) => updateField("month", value),
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  }
}

export { useGenerateStatementForm }
