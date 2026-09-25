"use client"

import { usePortfolioForm } from "@/presentation/parts/hooks/use-portfolio-form.hook"
import { updateCategoryAction } from "@/presentation/routes/category/actions/update-category.action"
import { CATEGORY_FORM_SCHEMA } from "@/presentation/routes/category/validations/category-form.validations"
import type { CategoryResponseDTO } from "@/services/category/dto/category-response.dto"

/**
 * @summary
 * Manages the edit category form state, validation and
 * submission.
 *
 * @remarks
 * Wraps `usePortfolioForm` with the category schema and
 * the update category server action. Seeds the initial
 * values from the provided category.
 *
 * @explanation
 * Use inside the edit category form to keep the
 * component presentational. Pass the category being
 * edited so the fields start with its current values.
 * Wire the returned inputs into controlled fields and
 * call `handleSubmit` on submit. Use `status` to
 * trigger result toasts.
 *
 * @param category - Category being edited.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { name, updateName, fieldErrors, status,
 *   handleSubmit } = useEditCategoryForm(category)
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useEditCategoryForm(category: CategoryResponseDTO) {
  const {
    values: VALUES,
    updateField,
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  } = usePortfolioForm({
    schema: CATEGORY_FORM_SCHEMA,
    initialValues: {
      name: category.name,
    },
    submit: (values) =>
      updateCategoryAction({
        categoryId: category.id,
        name: values.name,
      }),
  })

  return {
    name: VALUES.name,
    updateName: (value: string) => updateField("name", value),
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  }
}

export { useEditCategoryForm }
