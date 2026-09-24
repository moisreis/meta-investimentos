"use client"

import { authClient } from "@/clients/auth.client"
import { UnmaskCPF } from "@/presentation/masks/cpf.mask"
import { SIGN_UP_FORM_SCHEMA } from "@/presentation/routes/(auth)/validations/sign-up.validation"
import { useAuthForm } from "@/presentation/parts/hooks/use-auth-form.hook"

// Human-readable authentication error messages.
const SIGN_UP_ERROR_MESSAGES: Record<string, string> = {
  USER_ALREADY_EXISTS: "Já existe uma conta com este e-mail.",
  INVALID_EMAIL: "Informe um e-mail válido.",
  PASSWORD_TOO_SHORT:
    "A senha deve ter pelo menos 8 caracteres.",
  EMAIL_NOT_VERIFIED: "Verifique seu e-mail antes de continuar.",
}

/**
 * @summary
 * Manages the sign-up form state, validation and submission.
 *
 * @remarks
 * Wraps `useAuthForm` with the sign-up schema and the
 * **Better-Auth** email/password endpoint, unmasking the CPF
 * before it's sent.
 *
 * @explanation
 * Use inside a sign-up form to keep the component
 * presentational. Wire the returned inputs into controlled
 * fields and call `handleSubmit` on submit. Render
 * `fieldErrors` per field to show human-readable messages.
 * Use `status` to trigger result toasts.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { name, updateName, email, updateEmail, cpf, updateCpf,
 *   fieldErrors, status, handleSubmit } = useSignUp()
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function useSignUp() {
  const {
    values: VALUES,
    updateField,
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  } = useAuthForm({
    schema: SIGN_UP_FORM_SCHEMA,
    initialValues: {
      name: "",
      firstName: "",
      lastName: "",
      email: "",
      cpf: "",
      password: "",
    },
    errorMessages: SIGN_UP_ERROR_MESSAGES,
    submit: (values) =>
      authClient.signUp.email({
        ...values,
        cpf: UnmaskCPF(values.cpf),
      } as Parameters<typeof authClient.signUp.email>[0]),
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
    email: VALUES.email,
    updateEmail: (value: string) => updateField("email", value),
    cpf: VALUES.cpf,
    updateCpf: (value: string) => updateField("cpf", value),
    password: VALUES.password,
    updatePassword: (value: string) =>
      updateField("password", value),
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit,
  }
}

export { useSignUp }
