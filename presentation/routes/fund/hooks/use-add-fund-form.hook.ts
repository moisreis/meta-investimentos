"use client"

import { UnmaskCNPJ } from "@/presentation/masks/cnpj.mask"
import { UnmaskPercentage } from "@/presentation/masks/percentage.mask"
import { useEntityForm } from "@/presentation/parts/hooks/use-entity-form.hook"
import { createFundAction } from "@/presentation/routes/fund/actions/create-fund.action"
import { FUND_FORM_SCHEMA } from "@/presentation/routes/fund/validations/fund-form.validations"

/**
 * @summary
 * Manages the add fund form state, validation and
 * submission.
 *
 * @remarks
 * Wraps `useEntityForm` with the fund schema and
 * the create fund server action.
 *
 * @explanation
 * Use inside the add fund form to keep the component
 * presentational. Wire the returned inputs into
 * controlled fields and call `handleSubmit` on submit.
 * Render `fieldErrors` per field to show readable
 * messages. Use `status` to trigger result toasts.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { cnpj, updateCnpj, name, updateName, bankId,
 *   updateBankId, fieldErrors, status, handleSubmit } =
 *   useAddFundForm()
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useAddFundForm() {
  const {
    values: VALUES,
    updateField,
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  } = useEntityForm({
    schema: FUND_FORM_SCHEMA,
    initialValues: {
      cnpj: "",
      name: "",
      administrationFee: "",
      performanceFee: "",
      bankId: "",
      benchmarkId: "",
      categoryId: "",
    },
    submit: (values) =>
      createFundAction({
        cnpj: UnmaskCNPJ(values.cnpj),
        name: values.name,
        administrationFee: values.administrationFee
          ? UnmaskPercentage(values.administrationFee)
          : null,
        performanceFee: values.performanceFee
          ? UnmaskPercentage(values.performanceFee)
          : null,
        bankId: values.bankId,
        benchmarkId: values.benchmarkId
          ? values.benchmarkId
          : null,
        categoryId: values.categoryId ? values.categoryId : null,
      }),
  })

  return {
    cnpj: VALUES.cnpj,
    updateCnpj: (value: string) => updateField("cnpj", value),
    name: VALUES.name,
    updateName: (value: string) => updateField("name", value),
    administrationFee: VALUES.administrationFee,
    updateAdministrationFee: (value: string) =>
      updateField("administrationFee", value),
    performanceFee: VALUES.performanceFee,
    updatePerformanceFee: (value: string) =>
      updateField("performanceFee", value),
    bankId: VALUES.bankId,
    updateBankId: (value: string) =>
      updateField("bankId", value),
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

export { useAddFundForm }
