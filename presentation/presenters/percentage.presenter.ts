/**
 * @summary
 * Presentation helpers for percentage values.
 *
 * @remarks
 * Percentages are stored as decimal strings in the service
 * layer (e.g. `"3.75"` for 3.75%). This presenter formats
 * them in the `pt-BR` locale with exactly two decimal
 * places followed by `%`, and collapses nil, zero and
 * invalid values to `-`.
 *
 * @explanation
 * Use this presenter in the presentation layer whenever a
 * percentage needs to be rendered to the user, so tables,
 * cards and reports all display percentages uniformly.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */

const FALLBACK = "-"

/**
 * Formats a percentage for display.
 *
 * @param value - The raw percentage in percent units
 *                (a decimal string or number).
 * @returns `-` when the value is nil, zero or invalid;
 *          otherwise the percentage with two decimals.
 */
export function formatPercentage(
  value: string | number | null | undefined
): string {
  const parsed = typeof value === "string" ? Number.parseFloat(value) : value

  if (
    parsed === null ||
    parsed === undefined ||
    !Number.isFinite(parsed) ||
    parsed === 0
  ) {
    return FALLBACK
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsed / 100)
}
