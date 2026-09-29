import { PRESENTER_FALLBACK } from "../constants/presenter.constants"

/**
 * @summary
 * Formats a percentage value for display in Brazilian
 * Portuguese locale.
 *
 * @remarks
 * Converts a percentage in percent units (e.g., 12.34 for
 * 12.34%) to a localized string with two decimal places.
 * Returns fallback for nil, non-finite, or zero values.
 *
 * @explanation
 * Use this function to display percentage values in the UI
 * with proper Brazilian formatting (comma as decimal
 * separator). It handles string and number inputs, divides
 * by 100 to convert from percent units to decimal, and
 * applies Intl.NumberFormat.
 * Call it in tables, charts, or any component rendering
 * percentages.
 *
 * @param value - The raw percentage in percent units.
 * @returns Formatted percentage string or fallback.
 *
 * @example
 * const PERCENT = FormatPercentage(12.34);
 * // returns "12,34%"
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
export function FormatPercentage(
  value: string | number | null | undefined
): string {
  const PARSED =
    typeof value === "string" ? Number.parseFloat(value) : value

  if (
    PARSED === null ||
    PARSED === undefined ||
    !Number.isFinite(PARSED) ||
    PARSED === 0
  ) {
    return PRESENTER_FALLBACK
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(PARSED / 100)
}

/**
 * @summary
 * Formats a percentage value with its sign, keeping zero.
 *
 * @remarks
 * `FormatPercentage` swaps a zero for the fallback, which
 * reads as "no data" on a table but lies on a chart: a day
 * with no variation and a day with no return at all are
 * different facts. This variant renders zero as "0,00%" and
 * prefixes a positive value with `+`, so a series reads its
 * direction without a second glance. Nil and non-finite
 * values still return the fallback.
 *
 * @explanation
 * Use this function for chart tooltips and for any place
 * where zero is a meaningful value. Keep `FormatPercentage`
 * for the KPI cards, where a zero return is better shown as
 * a dash than as a flat line.
 *
 * @param value - The raw percentage in percent units.
 *
 * @returns The signed percentage string or the fallback.
 *
 * @example
 * const PERCENT = FormatSignedPercentage(-1.88);
 * // returns "-1,88%"
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function FormatSignedPercentage(
  value: string | number | null | undefined
): string {
  const PARSED =
    typeof value === "string" ? Number.parseFloat(value) : value

  if (
    PARSED === null ||
    PARSED === undefined ||
    !Number.isFinite(PARSED)
  ) {
    return PRESENTER_FALLBACK
  }

  const FORMATTED = new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(PARSED / 100)

  return PARSED > 0 ? `+ ${FORMATTED}` : FORMATTED
}
