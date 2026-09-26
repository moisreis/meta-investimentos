"use client"

import { usePortfolioForm } from "@/presentation/parts/hooks/use-portfolio-form.hook"
import { createUserAction } from "@/presentation/routes/users/actions/create-user.action"
import { USER_ADD_FORM_SCHEMA } from "@/presentation/routes/users/validations/user-form.validations"
import type { UserRole } from "@/services/user/dto/create-user.dto"

/**
 * @summary
 * Manages the add user form state, validation and
 * submission.
 *
 * @remarks
 * Wraps `usePortfolioForm` with the user schema and the
 * create user server action.
 *
 * @explanation
 * Use inside the add user form to keep the component
 * presentational. Wire the returned inputs into
 * controlled fields and call `handleSubmit` on submit.
 * Render `fieldErrors` per field to show readable
 * messages. Use `status` to trigger result toasts.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { name, updateName, email, updateEmail, role,
 *   updateRole, fieldErrors, status, handleSubmit } =
 *   useAddUserForm()
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useAddUserForm() {
  const {
    values: VALUES,
    updateField,
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  } = usePortfolioForm({
    schema: USER_ADD_FORM_SCHEMA,
    initialValues: {
      name: "",
      email: "",
      firstName: "",
      lastName: "",
      cpf: "",
      role: "",
    },
    submit: (values) =>
      createUserAction({
        name: values.name,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        cpf: values.cpf,
        role: values.role as UserRole,
      }),
  })

  return {
    name: VALUES.name,
    updateName: (value: string) => updateField("name", value),
    email: VALUES.email,
    updateEmail: (value: string) => updateField("email", value),
    firstName: VALUES.firstName,
    updateFirstName: (value: string) =>
      updateField("firstName", value),
    lastName: VALUES.lastName,
    updateLastName: (value: string) =>
      updateField("lastName", value),
    cpf: VALUES.cpf,
    updateCpf: (value: string) => updateField("cpf", value),
    role: VALUES.role,
    updateRole: (value: string) => updateField("role", value),
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  }
}

export { useAddUserForm }
