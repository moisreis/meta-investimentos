"use client"

import { UnmaskPercentage } from "@/presentation/masks/percentage.mask"
import { usePortfolioForm } from "@/presentation/parts/hooks/use-portfolio-form.hook"
import { updateFundAction } from "@/presentation/routes/fund/actions/update-fund.action"
import { FUND_EDIT_FORM_SCHEMA } from "@/presentation/routes/fund/validations/fund-form.validations"
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"

/**
 * @summary
 * Manages the edit fund form state, validation and
 * submission.
 *
 * @remarks
 * Wraps `usePortfolioForm` with the fund edit schema
 * and the update fund server action. Seeds the initial
 * values from the provided fund.
 *
 * @explanation
 * Use inside the edit fund form to keep the component
 * presentational. Pass the fund being edited so the
 * fields start with its current values. Wire the
 * returned inputs into controlled fields and call
 * `handleSubmit` on submit. Use `status` to trigger
 * result toasts.
 *
 * @param fund - Fund being edited.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { name, updateName, bankId, updateBankId,
 *   fieldErrors, status, handleSubmit } =
 *   useEditFundForm(fund)
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useEditFundForm(fund: FundResponseDTO) {
  const {
    values: VALUES,
    updateField,
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  } = usePortfolioForm({
    schema: FUND_EDIT_FORM_SCHEMA,
    initialValues: {
      name: fund.name,
      administrationFee: fund.administrationFee ?? "",
      performanceFee: fund.performanceFee ?? "",
      benchmarkId: fund.benchmarkId ?? "",
      categoryId: fund.categoryId ?? "",
    },
    submit: (values) =>
      updateFundAction({
        fundId: fund.id,
        name: values.name,
        administrationFee: values.administrationFee
          ? UnmaskPercentage(values.administrationFee)
          : null,
        performanceFee: values.performanceFee
          ? UnmaskPercentage(values.performanceFee)
          : null,
        benchmarkId: values.benchmarkId
          ? values.benchmarkId
          : null,
        categoryId: values.categoryId ? values.categoryId : null,
      }),
  })

  return {
    name: VALUES.name,
    updateName: (value: string) => updateField("name", value),
    administrationFee: VALUES.administrationFee,
    updateAdministrationFee: (value: string) =>
      updateField("administrationFee", value),
    performanceFee: VALUES.performanceFee,
    updatePerformanceFee: (value: string) =>
      updateField("performanceFee", value),
    benchmarkId: VALUES.benchmarkId,
    updateBenchmarkId: (value: string) =>
      updateField("benchmarkId", value),
    categoryId: VALUES.categoryId,
    updateCategoryId: (value: string) =>
      updateField("categoryId", value),
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  }
}

export { useEditFundForm }
