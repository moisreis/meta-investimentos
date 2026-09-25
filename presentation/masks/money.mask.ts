// Maximum lengths for the money integer and decimal parts.
const MONEY_INTEGER_LENGTH = 12
const MONEY_DECIMAL_LENGTH = 2

/**
 * @summary
 * Masks a **money** input by formatting its numeric value.
 *
 * @remarks
 * Keeps digits, a single decimal separator normalized to a
 * comma and a leading minus sign. Caps the integer part at
 * 12 digits and the decimals at 2, matching the monetary
 * precision of the domain value object.
 *
 * @explanation
 * Use on text input changes to keep a money field
 * formatted. It returns the formatted string without
 * validation.
 *
 * @param value - Raw money input string.
 * @returns The masked money string.
 *
 * @example
 * const MASKED = MaskMoney("-1234,567");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function MaskMoney(value: string): string {
  // Keeps only digits, separators and the sign.
  const CLEANED = value.replace(/[^\d,.-]/g, "")

  // Drops every sign from the numeric body; the leading
  // sign is tracked separately.
  const RAW_DIGITS = CLEANED.replace(/-/g, "")
  const NEGATIVE = CLEANED.startsWith("-")

  // Splits around the first separator, ignoring any
  // further ones.
  const [RAW_INTEGER = "", ...REST] = RAW_DIGITS.split(/[.,]/)
  const RAW_DECIMALS = REST.join("")

  const INTEGER = RAW_INTEGER.slice(0, MONEY_INTEGER_LENGTH)
  const DECIMALS = RAW_DECIMALS.slice(0, MONEY_DECIMAL_LENGTH)

  const HAS_SEPARATOR =
    RAW_DIGITS.includes(",") || RAW_DIGITS.includes(".")

  const SIGN = NEGATIVE ? "-" : ""

  return HAS_SEPARATOR
    ? `${SIGN}${INTEGER},${DECIMALS}`
    : `${SIGN}${INTEGER}`
}

/**
 * @summary
 * Removes the formatting from a **money** value.
 *
 * @remarks
 * Converts the decimal comma to a dot and parses the value
 * into a plain number string, keeping the sign. Returns an
 * empty string when unparsable.
 *
 * @explanation
 * Use before persisting or validating a money value. It
 * returns the canonical value without validation.
 *
 * @param value - Masked or raw money string.
 * @returns The plain number string.
 *
 * @example
 * const NUMBER = UnmaskMoney("-1234,56");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function UnmaskMoney(value: string): string {
  const PARSED = Number.parseFloat(value.replace(",", "."))

  return Number.isFinite(PARSED) ? String(PARSED) : ""
}

export { MaskMoney, UnmaskMoney }
