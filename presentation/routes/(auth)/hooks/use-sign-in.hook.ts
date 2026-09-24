"use client"

import * as React from "react"
import { authClient } from "@/clients/auth.client"
import { signInFormSchema } from "@/presentation/routes/(auth)/validations/sign-in.validations"

type SignInFieldKey = keyof typeof signInFormSchema.shape

type SignInFieldErrors = Partial<Record<SignInFieldKey, string>>

type SignInFormStatus = "idle" | "attempting" | "success" | "error"

interface SignInValues {
  email: string
  password: string
}

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
 * Translates an authentication error into a human-readable message.
 *
 * @remarks
 * Maps known better-auth error codes to human-readable text.
 * Falls back to the server message or a generic hint.
 *
 * @param authError - Authentication error returned by the client.
 * @returns The human-readable error message.
 *
 * @example
 * const MESSAGE = translateSignInError(authError)
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function translateSignInError(authError: {
  code?: string
  message?: string
}): string {
  const codeMessage = authError.code && SIGN_IN_ERROR_MESSAGES[authError.code]

  return codeMessage ?? authError.message ?? "Erro de autenticação."
}

/**
 * @summary
 * Manages the sign-in form state, validation and submission.
 *
 * @remarks
 * Holds the email, password, error, pending, status and per-field error state.
 * Validates with Zod before calling the better-auth email/password endpoint.
 * Re-validates a field as it changes after an invalid attempt.
 * On success, redirects to the dashboard (`/`).
 *
 * @explanation
 * Use inside a sign-in form to keep the component presentational.
 * Wire the returned inputs into controlled fields and call `handleSubmit` on submit.
 * Render `fieldErrors` per field to show human-readable messages.
 * Use `status` to trigger result toasts.
 *
 * @returns The sign-in state, setters, field errors, status and submit handler.
 *
 * @example
 * const { email, updateEmail, password, updatePassword, fieldErrors, status, handleSubmit } =
 *   useSignIn()
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function useSignIn() {
  const [email, setEmailState] = React.useState("")
  const [password, setPasswordState] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)
  const [status, setStatus] = React.useState<SignInFormStatus>("idle")
  const [fieldErrors, setFieldErrors] = React.useState<SignInFieldErrors>({})

  function validateField(key: SignInFieldKey, values: SignInValues) {
    const result = signInFormSchema.safeParse(values)

    const message = result.success
      ? undefined
      : result.error.flatten().fieldErrors[key]?.[0]

    setFieldErrors((previous) => ({ ...previous, [key]: message }))
  }

  function updateEmail(value: string) {
    setEmailState(value)
    validateField("email", { email: value, password })
  }

  function updatePassword(value: string) {
    setPasswordState(value)
    validateField("password", { email, password: value })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setStatus("attempting")
    setPending(true)

    const result = signInFormSchema.safeParse({ email, password })

    if (!result.success) {
      const flattened = result.error.flatten().fieldErrors

      setFieldErrors({
        email: flattened.email?.[0],
        password: flattened.password?.[0],
      })
      setStatus("error")
      setPending(false)

      return
    }

    setFieldErrors({})

    try {
      const { error: authError } = await authClient.signIn.email(result.data)

      if (authError) {
        setError(translateSignInError(authError))
        setStatus("error")
      } else {
        setStatus("success")
        window.location.href = "/"
      }
    } catch {
      setError("Erro inesperado. Tente novamente.")
      setStatus("error")
    } finally {
      setPending(false)
    }
  }

  return {
    email,
    updateEmail,
    password,
    updatePassword,
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  }
}

export { useSignIn, type SignInFormStatus }
