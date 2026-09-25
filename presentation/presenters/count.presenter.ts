import { PRESENTER_FALLBACK } from "../constants/presenter.constants"

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
 * Use this function to display countable values such
 * as the number of funds or bank accounts linked to a
 * portfolio. Call it in table cells and KPI cards.
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
