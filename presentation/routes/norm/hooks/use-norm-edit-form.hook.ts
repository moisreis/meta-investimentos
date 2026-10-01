"use client"

import { UnmaskPercentage } from "@/presentation/masks/percentage.mask"
import { useEntityForm } from "@/presentation/parts/hooks/use-entity-form.hook"
import { updateNormAction } from "@/presentation/routes/norm/actions/update-norm.action"
import { NORM_FORM_SCHEMA } from "@/presentation/routes/norm/validations/norm-form.validation"
import type { NormRow } from "@/presentation/types/norm-row.types"

/**
 * @summary
 * Manages the edit norm form state, validation and
 * submission.
 *
 * @remarks
 * Wraps `useEntityForm` with the norm schema and the
 * update norm server action. Seeds the initial values
 * from the provided norm, and the masked percentage
 * fields are unmasked before they reach the action.
 *
 * @explanation
 * Use inside the edit norm form to keep the component
 * presentational. Pass the norm being edited so the
 * fields start with its current values. Wire the
 * returned inputs into controlled fields and call
 * `handleSubmit` on submit. Use `status` to trigger
 * result toasts.
 *
 * @param norm - Norm being edited.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { name, updateName, categoryId, updateCategoryId,
 *   fieldErrors, status, handleSubmit } =
 *   useNormEditForm(norm)
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function useNormEditForm(norm: NormRow) {
  const {
    values: VALUES,
    updateField,
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  } = useEntityForm({
    schema: NORM_FORM_SCHEMA,
    initialValues: {
      articleNumber: norm.articleNumber,
      name: norm.name,
      categoryId: norm.categoryId,
      minAllocation: norm.minAllocation,
      maxAllocation: norm.maxAllocation,
      targetAllocation: norm.targetAllocation,
    },
    submit: (values) =>
      updateNormAction({
        normId: norm.id,
        articleNumber: values.articleNumber,
        name: values.name,
        categoryId: values.categoryId,
        minAllocation: UnmaskPercentage(values.minAllocation),
        maxAllocation: UnmaskPercentage(values.maxAllocation),
        targetAllocation: UnmaskPercentage(
          values.targetAllocation
        ),
      }),
  })

  return {
    articleNumber: VALUES.articleNumber,
    updateArticleNumber: (value: string) =>
      updateField("articleNumber", value),
    name: VALUES.name,
    updateName: (value: string) => updateField("name", value),
    categoryId: VALUES.categoryId,
    updateCategoryId: (value: string) =>
      updateField("categoryId", value),
    minAllocation: VALUES.minAllocation,
    updateMinAllocation: (value: string) =>
      updateField("minAllocation", value),
    targetAllocation: VALUES.targetAllocation,
    updateTargetAllocation: (value: string) =>
      updateField("targetAllocation", value),
    maxAllocation: VALUES.maxAllocation,
    updateMaxAllocation: (value: string) =>
      updateField("maxAllocation", value),
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  }
}

export { useNormEditForm }
