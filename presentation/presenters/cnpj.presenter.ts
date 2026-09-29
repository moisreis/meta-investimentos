import { PRESENTER_FALLBACK } from "../constants/presenter.constants"

/**
 * @summary
 * Formats a CNPJ for display, or nothing when it is absent.
 *
 * @remarks
 * Applies the standard Brazilian CNPJ mask:
 * **99.999.999/9999-99**. Returns `undefined` for nil,
 * blank or malformed values instead of a placeholder, so
 * callers that render an optional secondary line can drop
 * the line entirely rather than show a bare dash.
 *
 * @explanation
 * Use this function when the CNPJ is a qualifier under a
 * name, such as the subtitle of a lookup cell or of a
 * combobox option. Reach for `FormatCnpj` when the CNPJ is
 * the whole value of a cell and a dash reads better than a
 * blank.
 *
 * @param value - The raw CNPJ value (numbers only or with mask).
 * @returns Formatted CNPJ string, or `undefined`.
 *
 * @example
 * const CNPJ = FormatCnpjOptional("12345678000199");
 * // returns "12.345.678/0001-99"
 * // FormatCnpjOptional(null) returns undefined
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function FormatCnpjOptional(
  value: string | number | null | undefined
): string | undefined {
  if (value === null || value === undefined) {
    return undefined
  }

  const DIGITS = String(value).replace(/\D/g, "")

  if (DIGITS.length !== 14) {
    return undefined
  }

  return (
    DIGITS.slice(0, 2) +
    "." +
    DIGITS.slice(2, 5) +
    "." +
    DIGITS.slice(5, 8) +
    "/" +
    DIGITS.slice(8, 12) +
    "-" +
    DIGITS.slice(12, 14)
  )
}

/**
 * @summary
 * Formats a CNPJ for display.
 *
 * @remarks
 * Applies the standard Brazilian CNPJ mask: **99.999.999/9999-99**.
 * Returns the fallback for nil or blank values.
 *
 * @explanation
 * Use this function to display CNPJ values in tables, forms,
 * or any component that renders a CNPJ. It handles both
 * formatted and unformatted input strings.
 *
 * @param value - The raw CNPJ value (numbers only or with mask).
 * @returns Formatted CNPJ string or fallback.
 *
 * @example
 * const CNPJ = FormatCnpj("12345678000199");
 * // returns "12.345.678/0001-99"
 *
 * @author MoisAcs Reis
 *
 * @date 2026-09-27
 */
export function FormatCnpj(
  value: string | number | null | undefined
): string {
  return FormatCnpjOptional(value) ?? PRESENTER_FALLBACK
}