// The single seam the codebase logs through. Every line reads
// `[scope] message`, with an optional detail kept as a second
// argument so a stack or an error object survives in the
// runtime console. Routing the calls here keeps the shape
// consistent and leaves one place to add levels, redaction or
// a transport later.

// The two levels the seam writes today.
type LogLevel = "warn" | "error"

// Writes one line, keeping a missing detail out of the call so
// the console does not print a trailing `undefined`.
function Emit(
  level: LogLevel,
  scope: string,
  message: string,
  detail: unknown
): void {
  const LINE = `[${scope}] ${message}`

  if (detail === undefined) {
    if (level === "error") console.error(LINE)
    else console.warn(LINE)
    return
  }

  if (level === "error") console.error(LINE, detail)
  else console.warn(LINE, detail)
}

/**
 * @summary
 * Writes a warning through the shared logging seam.
 *
 * @remarks
 * Use for a state the code recovers from, such as an
 * ownership mismatch that resolves to a missing screen.
 *
 * @explanation
 * Use this instead of `console.warn` so the scope, the message
 * and the detail always keep the same shape.
 *
 * @param scope - The origin of the line, shown in brackets.
 * @param message - The sentence stating what happened.
 * @param detail - An optional value, such as a caught error.
 *
 * @example
 * LogWarn("LoadPositionOverview", "position is not owned");
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export function LogWarn(
  scope: string,
  message: string,
  detail?: unknown
): void {
  Emit("warn", scope, message, detail)
}

/**
 * @summary
 * Writes an error through the shared logging seam.
 *
 * @remarks
 * Use for a state the code did not recover from but still
 * swallows, so the screen degrades instead of crashing while
 * the real cause stays in the server log.
 *
 * @explanation
 * Use this instead of `console.error` so the scope, the
 * message and the detail always keep the same shape.
 *
 * @param scope - The origin of the line, shown in brackets.
 * @param message - The sentence stating what happened.
 * @param detail - An optional value, such as a caught error.
 *
 * @example
 * LogError("LoadFundOverview", "failed to resolve", cause);
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export function LogError(
  scope: string,
  message: string,
  detail?: unknown
): void {
  Emit("error", scope, message, detail)
}
