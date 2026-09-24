"use client"

import { authClient } from "@/clients/auth.client"
import { signInFormSchema } from "@/presentation/routes/(auth)/validations/sign-in.validations"
import { useAuthForm } from "@/presentation/parts/hooks/use-auth-form.hook"

// Human-readable authentication error messages.
const SIGN_IN_ERROR_MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "E-mail ou senha inválidos.",
  USER_NOT_FOUND: "Não encontramos uma conta com este e-mail.",
  ACCOUNT_NOT_FOUND: "Não encontramos uma conta com este e-mail.",
  PASSWORD_TOO_SHORT: "A senha informada é muito curta.",
  EMAIL_NOT_VERIFIED: "Verifique seu e-mail antes de entrar.",
}

/**
 * @summary
 * Manages the sign-in form state, validation and submission.
 *
 * @remarks
 * Wraps `useAuthForm` with the sign-in schema and the
 * **Better-Auth** email/password endpoint.
 *
 * @explanation
 * Use inside a sign-in form to keep the component
 * presentational. Wire the returned inputs into controlled
 * fields and call `handleSubmit` on submit. Render
 * `fieldErrors` per field to show human-readable messages.
 * Use `status` to trigger result toasts.
 *
 * @returns Form state and handlers.
 *
 * @example
 * const { email, updateEmail, password, updatePassword,
 *   fieldErrors, status, handleSubmit } = useSignIn()
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function useSignIn() {
  const { values, updateField, error, pending, status, fieldErrors, handleSubmit } =
    useAuthForm({
      schema: signInFormSchema,
      initialValues: { email: "", password: "" },
      errorMessages: SIGN_IN_ERROR_MESSAGES,
      submit: (values) => authClient.signIn.email(values),
    })

  return {
    email: values.email,
    updateEmail: (value: string) => updateField("email", value),
    password: values.password,
    updatePassword: (value: string) => updateField("password", value),
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  }
}

export { useSignIn }