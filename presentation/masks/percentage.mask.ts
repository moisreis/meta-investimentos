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
 * Use on text input changes to keep the percentage field
 * formatted. It returns the formatted string without
 * validation.
 *
 * @param value - Raw percentage input string.
 * @returns The masked percentage string.
 *
 * @example
 * const MASKED = MaskPercentage("12345,789");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function MaskPercentage(value: string): string {
  // Keeps only digits and decimal separators.
  const CLEANED = value.replace(/[^\d.,]/g, "")

  // Splits around the first separator, ignoring any
  // further ones.
  const [RAW_INTEGER = "", ...REST] = CLEANED.split(/[.,]/)
  const RAW_DECIMALS = REST.join("")

  const INTEGER = RAW_INTEGER.slice(0, PERCENTAGE_INTEGER_LENGTH)
  const DECIMALS = RAW_DECIMALS.slice(
    0,
    PERCENTAGE_DECIMAL_LENGTH
  )

  const HAS_SEPARATOR =
    CLEANED.includes(",") || CLEANED.includes(".")

  return HAS_SEPARATOR ? `${INTEGER},${DECIMALS}` : INTEGER
}

/**
 * @summary
 * Removes the formatting from a **percentage** value.
 *
 * @remarks
 * Converts the decimal comma to a dot and parses the value into
 * a plain number string. Returns an empty string when
 * unparsable.
 *
 * @explanation
 * Use before persisting or validating a percentage.
 * It returns the canonical value without validation.
 *
 * @param value - Masked or raw percentage string.
 * @returns The plain number string.
 *
 * @example
 * const NUMBER = UnmaskPercentage("3,75");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function UnmaskPercentage(value: string): string {
  const PARSED = Number.parseFloat(value.replace(",", "."))

  return Number.isFinite(PARSED) ? String(PARSED) : ""
}

export { MaskPercentage, UnmaskPercentage }
