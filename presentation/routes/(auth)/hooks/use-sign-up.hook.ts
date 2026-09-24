"use client"

import { authClient } from "@/clients/auth.client"
import { unmaskCPF } from "@/presentation/masks/cpf.mask"
import { signUpFormSchema } from "@/presentation/routes/(auth)/validations/sign-up.validations"
import { useAuthForm } from "@/presentation/parts/hooks/use-auth-form.hook"

// Human-readable authentication error messages.
const SIGN_UP_ERROR_MESSAGES: Record<string, string> = {
  USER_ALREADY_EXISTS: "Já existe uma conta com este e-mail.",
  INVALID_EMAIL: "Informe um e-mail válido.",
  PASSWORD_TOO_SHORT: "A senha deve ter pelo menos 8 caracteres.",
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
  const { values, updateField, error, pending, status, fieldErrors, handleSubmit } =
    useAuthForm({
      schema: signUpFormSchema,
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
          cpf: unmaskCPF(values.cpf),
        } as Parameters<typeof authClient.signUp.email>[0]),
    })

  return {
    name: values.name,
    updateName: (value: string) => updateField("name", value),
    firstName: values.firstName,
    updateFirstName: (value: string) => updateField("firstName", value),
    lastName: values.lastName,
    updateLastName: (value: string) => updateField("lastName", value),
    email: values.email,
    updateEmail: (value: string) => updateField("email", value),
    cpf: values.cpf,
    updateCpf: (value: string) => updateField("cpf", value),
    password: values.password,
    updatePassword: (value: string) => updateField("password", value),
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  }
}

export { useSignUp }