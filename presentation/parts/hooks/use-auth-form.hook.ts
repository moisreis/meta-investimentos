"use client"

import * as React from "react"
import type { z } from "zod"

type AuthFormStatus = "idle" | "attempting" | "success" | "error"

interface AuthError {
  code?: string
  message?: string
}

interface UseAuthFormOptions<
  TSchema extends z.ZodTypeAny,
  TValues extends Record<string, string>,
> {
  schema: TSchema
  initialValues: TValues
  errorMessages: Record<string, string>
  submit: (
    values: TValues
  ) => Promise<{ error?: AuthError | null }>
}

/**
 * @summary
 * Resolves the post-authentication redirect target.
 *
 * @remarks
 * Reads the `redirect` query parameter set by the middleware.
 * Falls back to the dashboard route (`/`) when
 * it is missing or invalid.
 *
 * @explanation
 * The middleware appends a `redirect` query parameter to the
 * sign-in/sign-up URL when an unauthenticated user hits a
 * protected route. After a successful attempt this helper
 * restores the original destination instead of the dashboard.
 *
 * @returns The redirect target.
 *
 * @example
 * const TARGET = GetRedirectTarget()
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function GetRedirectTarget(): string {
  const PARAMS = new URLSearchParams(window.location.search)
  const REDIRECT = PARAMS.get("redirect")

  return REDIRECT?.startsWith("/") && !REDIRECT.startsWith("//")
    ? REDIRECT
    : "/"
}

/**
 * @summary
 * Translates an authentication error into a
 * human-readable message.
 *
 * @remarks
 * Maps known **Better-Auth** error codes to
 * human-readable text. Falls back to the server
 * message or a generic hint.
 *
 * @explanation
 * Use when a sign-in/sign-up request fails. It makes
 * errors understandable for the final user.
 *
 * @param authError - Authentication error returned by
 *   the client.
 * @param messages - Error-code-to-message map for the form.
 *
 * @returns A readable error message.
 *
 * @example
 * const MESSAGE = TranslateAuthError(
 *   authError,
 *   SIGN_IN_ERROR_MESSAGES
 * )
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function TranslateAuthError(
  authError: AuthError,
  messages: Record<string, string>
): string {
  const CODE_MESSAGE = authError.code && messages[authError.code]

  return (
    CODE_MESSAGE ??
    authError.message ??
    "Erro de autenticação."
  )
}

/**
 * @summary
 * Manages shared state, validation and submission logic
 * for **Better-Auth** email/password forms.
 *
 * @remarks
 * Holds arbitrary string-keyed field values, error, pending,
 * status and per-field error state. Validates with **Zod**
 * before calling the given submit function. Re-validates a
 * field as it changes after an invalid attempt. On success,
 * redirects to the `redirect` query target or the
 * dashboard (`/`).
 *
 * @explanation
 * Use as the base for `useSignIn`/`useSignUp` (and any future
 * auth form) to avoid duplicating validation, submission and
 * redirect logic across hooks. Each caller supplies its own
 * schema, initial values, error-code map, and submit function.
 *
 * @param options - Schema, initial values, error map
 *   and submit fn.
 *
 * @returns Field values, an updater, and submit state/handlers.
 *
 * @example
 * const { values, updateField, fieldErrors, status,
 *   handleSubmit } = useAuthForm({
 *     schema: SIGN_IN_FORM_SCHEMA,
 *     initialValues: { email: "", password: "" },
 *     errorMessages: SIGN_IN_ERROR_MESSAGES,
 *     submit: (values) => authClient.signIn.email(values),
 *   })
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function useAuthForm<
  TSchema extends z.ZodTypeAny,
  TValues extends Record<string, string>,
>({
  schema,
  initialValues,
  errorMessages,
  submit,
}: UseAuthFormOptions<TSchema, TValues>) {
  const [VALUES, setValues] =
    React.useState<TValues>(initialValues)
  const [ERROR, setError] = React.useState<string | null>(null)
  const [PENDING, setPending] = React.useState(false)
  const [STATUS, setStatus] =
    React.useState<AuthFormStatus>("idle")
  const [FIELD_ERRORS, setFieldErrors] = React.useState<
    Partial<Record<keyof TValues, string>>
  >({})

  /**
   * @summary
   * Validates one field of the form.
   *
   * @remarks
   * Parses values with the schema and stores the first
   * error message for the given field.
   *
   * @explanation
   * Use on every field change after an invalid attempt.
   * It keeps the displayed field errors up to date.
   *
   * @param key - Field whose error is updated.
   * @param nextValues - Values used to validate the field.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-23
   */
  function ValidateField(
    key: keyof TValues,
    nextValues: TValues
  ) {
    const RESULT = schema.safeParse(nextValues)

    const MESSAGE = RESULT.success
      ? undefined
      : (
          RESULT.error.flatten().fieldErrors as Partial<
            Record<keyof TValues, string[] | undefined>
          >
        )[key]?.[0]

    setFieldErrors((previous) => ({
      ...previous,
      [key]: MESSAGE,
    }))
  }

  /**
   * @summary
   * Updates a single field's value.
   *
   * @remarks
   * Stores the new value and re-validates that field.
   *
   * @explanation
   * Wire per-field updater functions (in the caller hook)
   * to this to keep field state and its field error in sync.
   *
   * @param key - Field being updated.
   * @param value - New value typed by the user.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-23
   */
  function UpdateField(key: keyof TValues, value: string) {
    const NEXT_VALUES = { ...VALUES, [key]: value }

    setValues(NEXT_VALUES)
    ValidateField(key, NEXT_VALUES)
  }

  /**
   * @summary
   * Submits the form to the given submit function.
   *
   * @remarks
   * Validates with the schema and calls `submit`.
   * Redirects to the stored target on success.
   *
   * @explanation
   * Use as the form submit handler. It shows errors
   * and result toasts through the shared state.
   *
   * @param event - Submit event of the form.
   *
   * @returns A promise on submit.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-23
   */
  async function HandleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()
    setError(null)
    setStatus("attempting")
    setPending(true)

    const RESULT = schema.safeParse(VALUES)

    if (!RESULT.success) {
      const FLATTENED = RESULT.error.flatten()
        .fieldErrors as Partial<
        Record<keyof TValues, string[] | undefined>
      >
      const NEXT_FIELD_ERRORS: Partial<
        Record<keyof TValues, string>
      > = {}

      for (const key of Object.keys(
        VALUES
      ) as (keyof TValues)[]) {
        NEXT_FIELD_ERRORS[key] = FLATTENED[key]?.[0]
      }

      setFieldErrors(NEXT_FIELD_ERRORS)
      setStatus("error")
      setPending(false)

      return
    }

    setFieldErrors({})

    try {
      const { error: authError } = await submit(
        RESULT.data as TValues
      )

      if (authError) {
        setError(TranslateAuthError(authError, errorMessages))
        setStatus("error")
      } else {
        setStatus("success")
        window.location.href = GetRedirectTarget()
      }
    } catch {
      setError("Erro inesperado. Tente novamente.")
      setStatus("error")
    } finally {
      setPending(false)
    }
  }

  return {
    values: VALUES,
    updateField: UpdateField,
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit: HandleSubmit,
  }
}

export { useAuthForm, type AuthFormStatus }
