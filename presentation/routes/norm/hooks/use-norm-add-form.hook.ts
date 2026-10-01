"use client"

import { UnmaskPercentage } from "@/presentation/masks/percentage.mask"
import { useEntityForm } from "@/presentation/parts/hooks/use-entity-form.hook"
import { createNormAction } from "@/presentation/routes/norm/actions/create-norm.action"
import { NORM_FORM_SCHEMA } from "@/presentation/routes/norm/validations/norm-form.validation"

/**
 * @summary
 * Manages the add norm form state, validation and
 * submission.
 *
 * @remarks
 * Wraps `useEntityForm` with the norm schema and the
 * create norm server action. The masked percentage
 * fields are unmasked before they reach the action.
 *
 * @explanation
 * Use inside the add norm form to keep the component
 * presentational. Wire the returned inputs into
 * controlled fields and call `handleSubmit` on submit.
 * Render `fieldErrors` per field to show readable
 * messages. Use `status` to trigger result toasts.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { articleNumber, updateArticleNumber, name,
 *   updateName, fieldErrors, status, handleSubmit } =
 *   useNormAddForm()
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function useNormAddForm() {
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
      articleNumber: "",
      name: "",
      categoryId: "",
      minAllocation: "",
      maxAllocation: "",
      targetAllocation: "",
    },
    submit: (values) =>
      createNormAction({
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

export { useNormAddForm }
