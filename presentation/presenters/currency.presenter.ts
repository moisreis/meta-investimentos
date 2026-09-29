import { PRESENTER_FALLBACK } from "../constants/presenter.constants"

/**
 * @summary
 * Formats a currency value for display in **BRL**.
 *
 * @remarks
 * Uses `Intl.NumberFormat` with the `pt-BR` locale and two
 * decimal places. Returns the fallback for nil or non-finite
 * values. Renders zero as "R$ 0,00" instead of the fallback.
 *
 * @explanation
 * Use this function to display monetary values in the UI with
 * Brazilian formatting (comma decimal and dot thousands). It
 * parses strings and numbers before formatting. Call it in
 * tables, detail views, or cards that render money amounts.
 *
 * @param value - The raw currency value to format.
 * @returns Formatted currency string or fallback.
 *
 * @example
 * const CURRENCY = FormatCurrency(1234.5);
 * // returns "R$ 1.234,50"
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
export function FormatCurrency(
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

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(PARSED)
}

/**
 * @summary
 * Formats a currency value in short form for an axis.
 *
 * @remarks
 * Uses `Intl.NumberFormat` with the `pt-BR` locale, the
 * `compact` notation and a single decimal place, so a value
 * in the hundreds of thousands reads as "R$ 240 mil"
 * instead of pushing the plot out of its card. Zero is
 * rendered as "R$ 0" rather than the fallback, because a
 * flat day is a real value on a chart.
 *
 * @explanation
 * Use this function for the tick labels of a chart axis.
 * Keep `FormatCurrency` for tooltips, tables and cards, where
 * the exact amount matters.
 *
 * @param value - The raw currency value to format.
 *
 * @returns The compact currency string or the fallback.
 *
 * @example
 * const TICK = FormatCompactCurrency(240444.25);
 * // returns "R$ 240 mil"
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function FormatCompactCurrency(
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

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(PARSED)
}
