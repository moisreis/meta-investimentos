import { DomainError } from "@/errors"
import { z } from "zod"

// Form-level message used when a rejected input carries no
// field message of its own.
const ACTION_INVALID_INPUT = "Verifique os campos informados."

// Per-field messages returned when validation fails.
type ActionFieldErrors = Record<string, string[]>

/**
 * Outcome of a server action call.
 *
 * @remarks
 * A discriminated union so callers narrow on `success`
 * instead of guessing from a nullable error. Failures
 * carry a user-facing message and, when the failure came
 * from schema validation, the per-field messages.
 */
type ActionResult<T> =
  | { success: true; data: T }
  | {
      success: false
      error: string
      fieldErrors?: ActionFieldErrors
    }

/**
 * @summary
 * Builds a successful action result.
 *
 * @explanation
 * Use to return the use case payload from an action.
 *
 * @param data - The payload produced by the use case.
 * @returns The successful result.
 *
 * @example
 * return ActionSuccess(BANK);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function ActionSuccess<T>(data: T): ActionResult<T> {
  return { success: true, data }
}

/**
 * @summary
 * Builds a failed action result.
 *
 * @remarks
 * The message must be safe to show to the user. Never
 * pass a stack trace, a SQL error or a connection string
 * as the message.
 *
 * @explanation
 * Use to report an expected failure, such as a rejected
 * input or a business rule violation.
 *
 * @param error - The user-facing failure message.
 * @param fieldErrors - The per-field messages, if any.
 * @returns The failed result.
 *
 * @example
 * return ActionFailure("Informe o código.");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function ActionFailure<T = never>(
  error: string,
  fieldErrors?: ActionFieldErrors
): ActionResult<T> {
  return fieldErrors
    ? { success: false, error, fieldErrors }
    : { success: false, error }
}

/**
 * @summary
 * Maps a thrown cause to a failed action result.
 *
 * @remarks
 * Domain errors are authored as user-facing messages, so
 * their message is forwarded. Every other cause is
 * replaced by the given fallback, which keeps stack
 * traces and database details out of the response.
 *
 * @explanation
 * Use in the catch block of an action to report a failure
 * without leaking internals.
 *
 * @param cause - The thrown value.
 * @param fallback - The generic user-facing message.
 * @returns The failed result.
 *
 * @example
 * catch (cause) {
 *   return ToActionFailure(cause, "Não foi possível criar.");
 * }
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function ToActionFailure<T = never>(
  cause: unknown,
  fallback: string
): ActionResult<T> {
  return ActionFailure<T>(
    cause instanceof DomainError ? cause.message : fallback
  )
}

/**
 * @summary
 * Extracts the per-field messages of a schema error.
 *
 * @remarks
 * Returns undefined when the failure is not a schema
 * error, so callers can pass the result straight to
 * `ActionFailure` without checking first.
 *
 * @explanation
 * Use to turn a `safeParse` failure into the field errors
 * a form renders under each input.
 *
 * @param error - The thrown value of `safeParse`.
 * @returns The per-field messages, if any.
 *
 * @example
 * const PARSED = SCHEMA.safeParse(INPUT);
 * if (!PARSED.success) {
 *   return ActionFailure(INVALID_INPUT, ToFieldErrors(PARSED.error));
 * }
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function ToFieldErrors(
  error: unknown
): ActionFieldErrors | undefined {
  if (!(error instanceof z.ZodError)) return undefined

  const { fieldErrors } = z.flattenError(error)
  const ENTRIES = Object.entries(fieldErrors).filter(
    (entry): entry is [string, string[]] =>
      Array.isArray(entry[1]) && entry[1].length > 0
  )

  if (ENTRIES.length === 0) return undefined

  return Object.fromEntries(ENTRIES)
}

/**
 * @summary
 * Reports a rejected action input.
 *
 * @remarks
 * Returns the first field message as the form-level
 * message, because a form needs a single string to show
 * in its alert area, and attaches every field message so
 * the inputs can render them inline.
 *
 * @explanation
 * Use as the failure branch of a `safeParse` check in an
 * action.
 *
 * @param error - The thrown value of `safeParse`.
 * @param message - The form-level message.
 * @returns The failed result.
 *
 * @example
 * if (!PARSED.success) {
 *   return RejectInput(PARSED.error);
 * }
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function RejectInput<T = never>(
  error: unknown,
  message = ACTION_INVALID_INPUT
): ActionResult<T> {
  const FIELD_ERRORS = ToFieldErrors(error)
  const FIRST = FIELD_ERRORS
    ? Object.values(FIELD_ERRORS)[0]?.[0]
    : undefined

  return ActionFailure<T>(FIRST ?? message, FIELD_ERRORS)
}

export {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  ToFieldErrors,
  type ActionFieldErrors,
  type ActionResult,
}
