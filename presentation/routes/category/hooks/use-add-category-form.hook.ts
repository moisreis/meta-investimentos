"use client"

import { useEntityForm } from "@/presentation/parts/hooks/use-entity-form.hook"
import { createCategoryAction } from "@/presentation/routes/category/actions/create-category.action"
import { CATEGORY_FORM_SCHEMA } from "@/presentation/routes/category/validations/category-form.validations"

/**
 * @summary
 * Manages the add category form state, validation and
 * submission.
 *
 * @remarks
 * Wraps `useEntityForm` with the category schema and
 * the create category server action.
 *
 * @explanation
 * Use inside the add category form to keep the
 * component presentational. Wire the returned inputs
 * into controlled fields and call `handleSubmit` on
 * submit. Render `fieldErrors` per field to show
 * readable messages. Use `status` to trigger result
 * toasts.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { name, updateName, fieldErrors, status,
 *   handleSubmit } = useAddCategoryForm()
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useAddCategoryForm() {
  const {
    values: VALUES,
    updateField,
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  } = useEntityForm({
    schema: CATEGORY_FORM_SCHEMA,
    initialValues: {
      name: "",
    },
    submit: (values) =>
      createCategoryAction({
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

export { useAddCategoryForm }
