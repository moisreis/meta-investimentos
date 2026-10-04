import { PRESENTER_FALLBACK } from "../constants/presenter.constants"

// Rendered by a count column when the count is zero. A
// zero in a count column reads as an absence, so the cell
// shows a dash instead of a digit.
const COUNT_DASH = "-"

/**
 * @summary
 * Formats a whole count for display in Brazilian
 * Portuguese locale.
 *
 * @remarks
 * Formats an integer with the `pt-BR` locale and no
 * decimal places. Returns the fallback for nil, non
 * finite, negative, or non-integer values. Renders
 * zero as "0" instead of the fallback.
 *
 * @explanation
 * Use this function to display a measured count such as
 * the total of rows in a KPI card or a job progress
 * summary, where zero is a result worth reporting. For a
 * count column use {@link FormatCountOrDash}.
 *
 * @param value - The raw count to format.
 * @returns Formatted count string or fallback.
 *
 * @example
 * const COUNT = FormatCount(1200);
 * // returns "1.200"
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function FormatCount(
  value: string | number | null | undefined
): string {
  const PARSED =
    typeof value === "string"
      ? Number.parseInt(value, 10)
      : value

  if (
    PARSED === null ||
    PARSED === undefined ||
    !Number.isFinite(PARSED) ||
    !Number.isInteger(PARSED) ||
    PARSED < 0
  ) {
    return PRESENTER_FALLBACK
  }

  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 0,
  }).format(PARSED)
}

/**
 * @summary
 * Formats a whole count for a table column, rendering
 * zero as a dash.
 *
 * @remarks
 * Delegates to {@link FormatCount} for every value other
 * than zero, so the locale and the fallback stay in one
 * place. Returns the fallback for nil, non finite,
 * negative, or non-integer values.
 *
 * @explanation
 * Use this function in a column that counts the related
 * rows of a record, such as the number of funds of a
 * portfolio or the number of positions of a fund. The
 * dash says "none" without implying a measurement, which
 * keeps the column readable when a list mixes records
 * that hold something with records that hold nothing.
 *
 * @param value - The raw count to format.
 * @returns Formatted count string, dash or fallback.
 *
 * @example
 * const COUNT = FormatCountOrDash(0);
 * // returns "-"
 *
 * @author Moisés Reis
 *
 * @date 2026-10-03
 */
export function FormatCountOrDash(
  value: string | number | null | undefined
): string {
  const PARSED =
    typeof value === "string"
      ? Number.parseInt(value, 10)
      : value

  if (PARSED === 0) return COUNT_DASH

  return FormatCount(PARSED)
}
