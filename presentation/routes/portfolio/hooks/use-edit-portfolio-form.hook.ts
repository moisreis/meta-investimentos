"use client"

import {
  MaskPercentage,
  UnmaskPercentage,
} from "@/presentation/masks/percentage.mask"
import { useEntityForm } from "@/presentation/parts/hooks/use-entity-form.hook"
import { updatePortfolioAction } from "@/presentation/routes/portfolio/actions/update-portfolio.action"
import { PORTFOLIO_FORM_SCHEMA } from "@/presentation/routes/portfolio/validations/portfolio-form.validations"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

/**
 * @summary
 * Manages the edit portfolio form state, validation and
 * submission.
 *
 * @remarks
 * Wraps `useEntityForm` with the portfolio schema and the
 * update portfolio server action. Seeds the initial values
 * from the provided portfolio, masking its percentages, and
 * unmask them before they are sent back.
 *
 * @explanation
 * Use inside the edit portfolio form to keep the component
 * presentational. Pass the portfolio being edited so the
 * fields start with its current values. Wire the returned
 * inputs into controlled fields and call `handleSubmit` on
 * submit. Use `status` to trigger result toasts.
 *
 * @param portfolio - Portfolio being edited.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { acronym, updateAcronym, name, updateName,
 *   fieldErrors, status, handleSubmit } =
 *   useEditPortfolioForm(portfolio)
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function useEditPortfolioForm(portfolio: PortfolioResponseDTO) {
  const {
    values: VALUES,
    updateField,
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  } = useEntityForm({
    schema: PORTFOLIO_FORM_SCHEMA,
    initialValues: {
      acronym: portfolio.acronym,
      name: portfolio.name,
      annualInterestRate: MaskPercentage(
        portfolio.annualInterestRate
      ),
      minAllocation: MaskPercentage(portfolio.minAllocation),
      maxAllocation: MaskPercentage(portfolio.maxAllocation),
      targetAllocation: MaskPercentage(
        portfolio.targetAllocation
      ),
    },
    submit: (values) =>
      updatePortfolioAction({
        portfolioId: portfolio.id,
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

export { useEditPortfolioForm }
