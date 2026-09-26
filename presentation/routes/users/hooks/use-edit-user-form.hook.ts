"use client"

import { usePortfolioForm } from "@/presentation/parts/hooks/use-portfolio-form.hook"
import { updateUserAction } from "@/presentation/routes/users/actions/update-user.action"
import { USER_EDIT_FORM_SCHEMA } from "@/presentation/routes/users/validations/user-form.validations"
import type { UserResponseDTO } from "@/services/user/dto/user-response.dto"

/**
 * @summary
 * Manages the edit user form state, validation and
 * submission.
 *
 * @remarks
 * Wraps `usePortfolioForm` with the user schema and the
 * update user server action. Seeds the initial values
 * from the provided user.
 *
 * @explanation
 * Use inside the edit user form to keep the component
 * presentational. Pass the user being edited so the
 * fields start with its current values. Wire the
 * returned inputs into controlled fields and call
 * `handleSubmit` on submit. Use `status` to trigger
 * result toasts.
 *
 * @param user - User being edited.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { name, updateName, firstName, updateFirstName,
 *   lastName, updateLastName, fieldErrors, status,
 *   handleSubmit } = useEditUserForm(user)
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useEditUserForm(user: UserResponseDTO) {
  const {
    values: VALUES,
    updateField,
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  } = usePortfolioForm({
    schema: USER_EDIT_FORM_SCHEMA,
    initialValues: {
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    submit: (values) =>
      updateUserAction({
        userId: user.id,
        name: values.name,
        firstName: values.firstName,
        lastName: values.lastName,
      }),
  })

  return {
    name: VALUES.name,
    updateName: (value: string) => updateField("name", value),
    firstName: VALUES.firstName,
    updateFirstName: (value: string) =>
      updateField("firstName", value),
    lastName: VALUES.lastName,
    updateLastName: (value: string) =>
      updateField("lastName", value),
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  }
}

export { useEditUserForm }
