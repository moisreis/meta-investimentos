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
 * const CURRENCY = formatCurrency(1234.5);
 * // returns "R$ 1.234,50"
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
export function formatCurrency(
  value: string | number | null | undefined
): string {
  const parsed = typeof value === "string" ? Number.parseFloat(value) : value

  if (parsed === null || parsed === undefined || !Number.isFinite(parsed)) {
    return PRESENTER_FALLBACK
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsed)
}