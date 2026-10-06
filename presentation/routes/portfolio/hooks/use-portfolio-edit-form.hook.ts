"use client"

import {
  MaskPercentage,
  UnmaskPercentage,
} from "@/presentation/masks/percentage.mask"
import { useEntityForm } from "@/presentation/parts/hooks/use-entity-form.hook"
import { ToNormAllocationInput } from "@/presentation/mappers/norm-portfolio-allocation.mapper"
import { updatePortfolioAction } from "@/presentation/routes/portfolio/actions/update-portfolio.action"
import { PORTFOLIO_FORM_SCHEMA } from "@/presentation/routes/portfolio/validations/portfolio-form.validation"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"
import type {
  NormOptionRegistry,
  NormPortfolioAllocation,
} from "@/presentation/types/norms-portfolio.types"

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
 * The stored bounds of every attached norm are seeded the
 * same way, which matters because the update use case
 * reconciles the relations against the submitted list: a
 * form seeded with no norms would silently detach all of
 * them on a rename.
 *
 * A missing norm registry means the norms could not be read,
 * so `norms` is left out of the payload entirely and the use
 * case keeps the relations as they are. Sending an empty
 * list instead would read as "this portfolio has no norms"
 * and detach them on a query that merely failed.
 *
 * @explanation
 * Use inside the edit portfolio form to keep the component
 * presentational. Pass the portfolio being edited so the
 * fields start with its current values. Wire the returned
 * inputs into controlled fields and call `handleSubmit` on
 * submit. Use `status` to trigger result toasts.
 *
 * @param portfolio - Portfolio being edited.
 * @param norms - The norm registry, or `null` when it could
 *                not be resolved.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { acronym, updateAcronym, name, updateName,
 *   fieldErrors, status, handleSubmit } =
 *   usePortfolioEditForm(portfolio, norms)
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function usePortfolioEditForm(
  portfolio: PortfolioRow,
  norms: NormOptionRegistry | null
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
      norms: norms?.allocations[portfolio.id] ?? [],
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
        ...(norms
          ? { norms: values.norms.map(ToNormAllocationInput) }
          : {}),
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
    norms: VALUES.norms,
    updateNorms: (value: NormPortfolioAllocation[]) =>
      updateField("norms", value),
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  }
}

export { usePortfolioEditForm }
