import { QUANTITY_DECIMAL_PLACES } from "@/constants/value-objects/rounding.constants"

import { PRESENTER_FALLBACK } from "../constants/presenter.constants"

/**
 * @summary
 * Formats a quota quantity for display in Brazilian
 * Portuguese locale.
 *
 * @remarks
 * Formats a non-negative number with the `pt-BR` locale
 * and up to **QUANTITY_DECIMAL_PLACES** fractional
 * digits. Returns the fallback for nil, non-finite or
 * negative values. Renders zero as "0" instead of the
 * fallback.
 *
 * @explanation
 * Use this function to display quota quantities in
 * tables, detail views, or KPI cards. It parses strings
 * and numbers before formatting, so decimal strings
 * coming from the DTOs format directly.
 *
 * @param value - The raw quota quantity to format.
 * @returns Formatted quota string or fallback.
 *
 * @example
 * const QUANTITY = FormatQuotaQuantity("1234.567890");
 * // returns "1.234,56789"
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function FormatQuotaQuantity(
  value: string | number | null | undefined
): string {
  const PARSED =
    typeof value === "string" ? Number.parseFloat(value) : value

  if (
    PARSED === null ||
    PARSED === undefined ||
    !Number.isFinite(PARSED) ||
    PARSED < 0
  ) {
    return PRESENTER_FALLBACK
  }

  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: QUANTITY_DECIMAL_PLACES,
  }).format(PARSED)
}
