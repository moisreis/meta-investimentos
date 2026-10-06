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
 * Masks a **signed percentage** input, keeping its sign.
 *
 * @remarks
 * Behaves exactly like `MaskPercentage` and adds one thing: a
 * leading minus survives. The sign is read from anywhere in
 * the typed text and re-emitted once, ahead of the digits, so
 * the value stays in the canonical `-999,99` shape however the
 * sign was typed or moved.
 *
 * The `numeric` column has room for the sign, so only the mask
 * had to change: a rate field masked with `MaskPercentage`
 * would silently drop the minus of a loss.
 *
 * @explanation
 * Use on a percentage field whose value is a delta, such as a
 * periodic return. Keep `MaskPercentage` for a bound or a fee,
 * which cannot be negative.
 *
 * @param value - Raw percentage input string.
 * @returns The masked signed percentage string.
 *
 * @example
 * const MASKED = MaskSignedPercentage("-1,5");
 * // returns "-1,50"
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function MaskSignedPercentage(value: string): string {
  // Keeps digits, decimal separators and the sign.
  const CLEANED = value.replace(/[^\d.,-]/g, "")
  const NEGATIVE = CLEANED.includes("-")
  const DIGITS = CLEANED.replace(/-/g, "")

  const [RAW_INTEGER = "", ...REST] = DIGITS.split(/[.,]/)
  const RAW_DECIMALS = REST.join("")

  const INTEGER = RAW_INTEGER.slice(0, PERCENTAGE_INTEGER_LENGTH)
  const DECIMALS = RAW_DECIMALS.slice(
    0,
    PERCENTAGE_DECIMAL_LENGTH
  )

  const HAS_SEPARATOR =
    DIGITS.includes(",") || DIGITS.includes(".")

  const BODY = HAS_SEPARATOR ? `${INTEGER},${DECIMALS}` : INTEGER

  return NEGATIVE ? `-${BODY}` : BODY
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

export { MaskPercentage, MaskSignedPercentage, UnmaskPercentage }
