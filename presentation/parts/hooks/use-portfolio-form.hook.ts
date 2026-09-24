"use client"

import * as React from "react"
import type { z } from "zod"

type PortfolioFormStatus =
  "idle" | "attempting" | "success" | "error"

interface UsePortfolioFormOptions<
  TSchema extends z.ZodTypeAny,
  TValues extends Record<string, string>,
> {
  schema: TSchema
  initialValues: TValues
  submit: (values: TValues) => Promise<{ error?: string | null }>
}

/**
 * @summary
 * Manages shared state, validation and submission logic
 * for portfolio forms.
 *
 * @remarks
 * Holds arbitrary string-keyed field values, error, pending,
 * status and per-field error state. Validates with **Zod**
 * before calling the given submit function. Re-validates a
 * field as it changes after an invalid attempt. On success,
 * sets the status to `success` so callers can react.
 *
 * @explanation
 * Use as the base for `useAddPortfolioForm` and
 * `useEditPortfolioForm` to avoid duplicating validation and
 * submission logic across hooks. Each caller supplies its own
 * schema, initial values, and submit function.
 *
 * @param options - Schema, initial values and submit fn.
 *
 * @returns Field values, an updater, and submit state/handlers.
 *
 * @example
 * const { values, updateField, fieldErrors, status,
 *   handleSubmit } = usePortfolioForm({
 *     schema: PORTFOLIO_FORM_SCHEMA,
 *     initialValues: { acronym: "", name: "" },
 *     submit: (values) => createPortfolioAction(values),
 *   })
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function usePortfolioForm<
  TSchema extends z.ZodTypeAny,
  TValues extends Record<string, string>,
>({
  schema,
  initialValues,
  submit,
}: UsePortfolioFormOptions<TSchema, TValues>) {
  const [VALUES, setValues] =
    React.useState<TValues>(initialValues)
  const [ERROR, setError] = React.useState<string | null>(null)
  const [PENDING, setPending] = React.useState(false)
  const [STATUS, setStatus] =
    React.useState<PortfolioFormStatus>("idle")
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
   * @date 2026-09-24
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
   * @date 2026-09-24
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
   * Shows the error returned by the action.
   *
   * @explanation
   * Use as the form submit handler. It renders errors
   * and result toasts through the shared state.
   *
   * @param event - Submit event of the form.
   *
   * @returns A promise on submit.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-24
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
      const { error: actionError } = await submit(
        RESULT.data as TValues
      )

      if (actionError) {
        setError(actionError)
        setStatus("error")
      } else {
        setStatus("success")
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

export { usePortfolioForm, type PortfolioFormStatus }
