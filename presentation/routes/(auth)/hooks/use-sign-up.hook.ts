"use client"

import * as React from "react"
import { authClient } from "@/clients/auth.client"
import { unmaskCPF } from "@/presentation/masks/cpf.mask"
import { signUpFormSchema } from "@/presentation/routes/(auth)/validations/sign-up.validations"

type SignUpFieldKey = keyof typeof signUpFormSchema.shape

type SignUpFieldErrors = Partial<Record<SignUpFieldKey, string>>

type SignUpFormStatus = "idle" | "attempting" | "success" | "error"

interface SignUpValues {
  name: string
  firstName: string
  lastName: string
  email: string
  cpf: string
  password: string
}

// Human-readable authentication error messages.
const SIGN_UP_ERROR_MESSAGES: Record<string, string> = {
  USER_ALREADY_EXISTS: "Já existe uma conta com este e-mail.",
  INVALID_EMAIL: "Informe um e-mail válido.",
  PASSWORD_TOO_SHORT: "A senha deve ter pelo menos 8 caracteres.",
  EMAIL_NOT_VERIFIED: "Verifique seu e-mail antes de continuar.",
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
 * const MESSAGE = translateSignUpError(authError)
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function translateSignUpError(authError: {
  code?: string
  message?: string
}): string {
  const codeMessage = authError.code && SIGN_UP_ERROR_MESSAGES[authError.code]

  return codeMessage ?? authError.message ?? "Erro de autenticação."
}

/**
 * @summary
 * Manages the sign-up form state, validation and submission.
 *
 * @remarks
 * Holds all registration fields, error, pending, status and per-field error state.
 * Validates with Zod before calling the better-auth email/password endpoint.
 * Re-validates a field as it changes after an invalid attempt.
 * On success, redirects to the dashboard (`/`).
 *
 * @explanation
 * Use inside a sign-up form to keep the component presentational.
 * Wire the returned inputs into controlled fields and call `handleSubmit` on submit.
 * Render `fieldErrors` per field to show human-readable messages.
 * Use `status` to trigger result toasts.
 *
 * @returns The sign-up state, setters, field errors, status and submit handler.
 *
 * @example
 * const { name, updateName, email, updateEmail, cpf, updateCpf, fieldErrors, status, handleSubmit } =
 *   useSignUp()
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function useSignUp() {
  const [name, setNameState] = React.useState("")
  const [firstName, setFirstNameState] = React.useState("")
  const [lastName, setLastNameState] = React.useState("")
  const [email, setEmailState] = React.useState("")
  const [cpf, setCpfState] = React.useState("")
  const [password, setPasswordState] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)
  const [status, setStatus] = React.useState<SignUpFormStatus>("idle")
  const [fieldErrors, setFieldErrors] = React.useState<SignUpFieldErrors>({})

  function validateField(key: SignUpFieldKey, values: SignUpValues) {
    const result = signUpFormSchema.safeParse(values)

    const message = result.success
      ? undefined
      : result.error.flatten().fieldErrors[key]?.[0]

    setFieldErrors((previous) => ({ ...previous, [key]: message }))
  }

  function updateName(value: string) {
    setNameState(value)
    validateField("name", {
      name: value,
      firstName,
      lastName,
      email,
      cpf,
      password,
    })
  }

  function updateFirstName(value: string) {
    setFirstNameState(value)
    validateField("firstName", {
      name,
      firstName: value,
      lastName,
      email,
      cpf,
      password,
    })
  }

  function updateLastName(value: string) {
    setLastNameState(value)
    validateField("lastName", {
      name,
      firstName,
      lastName: value,
      email,
      cpf,
      password,
    })
  }

  function updateEmail(value: string) {
    setEmailState(value)
    validateField("email", {
      name,
      firstName,
      lastName,
      email: value,
      cpf,
      password,
    })
  }

  function updateCpf(value: string) {
    setCpfState(value)
    validateField("cpf", {
      name,
      firstName,
      lastName,
      email,
      cpf: value,
      password,
    })
  }

  function updatePassword(value: string) {
    setPasswordState(value)
    validateField("password", {
      name,
      firstName,
      lastName,
      email,
      cpf,
      password: value,
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setStatus("attempting")
    setPending(true)

    const result = signUpFormSchema.safeParse({
      name,
      firstName,
      lastName,
      email,
      cpf,
      password,
    })

    if (!result.success) {
      const flattened = result.error.flatten().fieldErrors

      setFieldErrors({
        name: flattened.name?.[0],
        firstName: flattened.firstName?.[0],
        lastName: flattened.lastName?.[0],
        email: flattened.email?.[0],
        cpf: flattened.cpf?.[0],
        password: flattened.password?.[0],
      })
      setStatus("error")
      setPending(false)

      return
    }

    setFieldErrors({})

    try {
      const { error: authError } = await authClient.signUp.email({
        ...result.data,
        cpf: unmaskCPF(result.data.cpf),
      } as Parameters<typeof authClient.signUp.email>[0])

      if (authError) {
        setError(translateSignUpError(authError))
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
    name,
    updateName,
    firstName,
    updateFirstName,
    lastName,
    updateLastName,
    email,
    updateEmail,
    cpf,
    updateCpf,
    password,
    updatePassword,
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  }
}

export { useSignUp, type SignUpFormStatus }