"use client"

import * as React from "react"
import type { z } from "zod"

import {
  ToFieldErrors,
  type ActionResult,
} from "@/presentation/types/action-result"

type EntityFormStatus =
  "idle" | "attempting" | "success" | "error"

interface UseEntityFormOptions<
  TSchema extends z.ZodTypeAny,
  TValues extends Record<string, string>,
> {
  schema: TSchema
  initialValues: TValues
  submit: (values: TValues) => Promise<ActionResult<unknown>>
}

/**
 * @summary
 * Keeps only the first message of each field, which is what
 * a single error slot per input can render.
 *
 * @param fieldErrors - The per-field messages.
 * @returns The first message of each field.
 */
function ToFirstFieldErrors(
  fieldErrors: Record<string, string[]>
): Partial<Record<string, string>> {
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([key, messages]) => [
      key,
      messages[0],
    ])
  ) as Partial<Record<string, string>>
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
 * The action is the security boundary, so its field errors
 * are rendered exactly like the client ones: a server
 * rejection lands on the offending input, and its message
 * also reaches the form-level alert.
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
 *   handleSubmit } = useEntityForm({
 *     schema: PORTFOLIO_FORM_SCHEMA,
 *     initialValues: { acronym: "", name: "" },
 *     submit: (values) => createPortfolioAction(values),
 *   });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function useEntityForm<
  TSchema extends z.ZodTypeAny,
  TValues extends Record<string, string>,
>({
  schema,
  initialValues,
  submit,
}: UseEntityFormOptions<TSchema, TValues>) {
  const [VALUES, setValues] =
    React.useState<TValues>(initialValues)
  const [ERROR, setError] = React.useState<string | null>(null)
  const [PENDING, setPending] = React.useState(false)
  const [STATUS, setStatus] =
    React.useState<EntityFormStatus>("idle")
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
    const FIELD_ERRORS = ToFieldErrors(
      schema.safeParse(nextValues).error
    )
    const FIELD = String(key)

    setFieldErrors((previous) => ({
      ...previous,
      [key]: FIELD_ERRORS?.[FIELD]?.[0],
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
   * Validates with the schema and calls `submit`. Reports
   * the action outcome: a failure message goes to the
   * form-level alert and its field messages, when the
   * action reports any, go to the matching inputs.
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

    const PARSED = schema.safeParse(VALUES)

    if (!PARSED.success) {
      const FIELD_ERRORS = ToFieldErrors(PARSED.error)

      if (FIELD_ERRORS) {
        setFieldErrors(
          ToFirstFieldErrors(FIELD_ERRORS) as Partial<
            Record<keyof TValues, string>
          >
        )
      }

      setStatus("error")
      setPending(false)

      return
    }

    setFieldErrors({})

    try {
      const RESULT = await submit(PARSED.data as TValues)

      if (RESULT.success) {
        setStatus("success")
        return
      }

      setError(RESULT.error)
      setStatus("error")

      if (RESULT.fieldErrors) {
        setFieldErrors(
          ToFirstFieldErrors(RESULT.fieldErrors) as Partial<
            Record<keyof TValues, string>
          >
        )
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

export { useEntityForm, type EntityFormStatus }
