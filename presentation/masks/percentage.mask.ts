// Maximum lengths for the percentage integer and decimal parts.
const PERCENTAGE_INTEGER_LENGTH = 3
const PERCENTAGE_DECIMAL_LENGTH = 2

/**
 * @summary
 * Masks a **percentage** input by formatting its numeric value.
 *
 * @remarks
 * Keeps digits and a single decimal separator, normalized to a
 * comma. Caps the integer part at 3 digits and the decimals at
 * 2, matching the `numeric(5,2)` limit (`0` to `999,99`).
 *
 * @explanation
 * Use on text input changes to keep the percentage field formatted.
 * It returns the formatted string without validation.
 *
 * @param value - Raw percentage input string.
 *
 * @returns The masked percentage string.
 *
 * @example
 * const MASKED = maskPercentage("12345,789");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
function maskPercentage(value: string): string {
  // Keeps only digits and decimal separators.
  const cleaned = value.replace(/[^\d.,]/g, "")

  // Splits around the first separator, ignoring any further ones.
  const [rawInteger = "", ...rest] = cleaned.split(/[.,]/)
  const rawDecimals = rest.join("")

  const integer = rawInteger.slice(0, PERCENTAGE_INTEGER_LENGTH)
  const decimals = rawDecimals.slice(0, PERCENTAGE_DECIMAL_LENGTH)

  const hasSeparator = cleaned.includes(",") || cleaned.includes(".")

  return hasSeparator ? `${integer},${decimals}` : integer
}

/**
 * @summary
 * Removes the formatting from a **percentage** value.
 *
 * @remarks
 * Converts the decimal comma to a dot and parses the value into
 * a plain number string. Returns an empty string when unparsable.
 *
 * @explanation
 * Use before persisting or validating a percentage.
 * It returns the canonical value without validation.
 *
 * @param value - Masked or raw percentage string.
 *
 * @returns The plain number string.
 *
 * @example
 * const NUMBER = unmaskPercentage("3,75");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
function unmaskPercentage(value: string): string {
  const parsed = Number.parseFloat(value.replace(",", "."))

  return Number.isFinite(parsed) ? String(parsed) : ""
}

export { maskPercentage, unmaskPercentage }