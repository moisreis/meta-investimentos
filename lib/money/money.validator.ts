// Matches a signed money value, tolerating the **BRL** dot
// thousand separators and a trailing comma while the
// decimals are still being typed.
const MONEY_SHAPE = /^-?\d+([.,]\d{1,6})?$/

// The dot thousand separators of the pt-BR money mask.
const THOUSAND_SEPARATOR = /\./g

/**
 * @summary
 * Checks the shape of a money value string.
 *
 * @remarks
 * Accepts a plain integer or a decimal value with a comma
 * or a dot separator and up to six decimal places, plus an
 * optional leading minus sign, the **BRL** dot thousand
 * separators and a trailing comma. Checks the shape only,
 * not the magnitude.
 *
 * @explanation
 * Use this validator in money schemas before submitting.
 * It is the single source of truth for the money shape.
 *
 * @param value - Masked or raw money string.
 * @returns Validity of the money value.
 *
 * @example
 * const VALID = IsValidMoney("-1.234,56");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function IsValidMoney(value: string): boolean {
  const TRIMMED = value.trim()

  // Drops the BRL dot thousand separators and accepts a
  // trailing comma before checking the numeric shape.
  const NORMALIZED = TRIMMED.replace(
    THOUSAND_SEPARATOR,
    ""
  ).replace(/,$/, "")

  return MONEY_SHAPE.test(NORMALIZED)
}

/**
 * @summary
 * Normalizes a money string into a plain decimal string.
 *
 * @remarks
 * Drops the **BRL** dot thousand separators and rewrites
 * the comma decimal separator as a dot. Returns null for a
 * value that does not match the money shape, so callers
 * never propagate a partially parsed amount.
 *
 * @explanation
 * Use before comparing or summing amounts, so the values
 * reach the arithmetic in a single canonical shape.
 *
 * @param value - Masked or raw money string.
 * @returns The plain decimal string, or `null`.
 *
 * @example
 * const DECIMAL = NormalizeMoney("1.234,56");
 * // returns "1234.56"
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function NormalizeMoney(value: string): string | null {
  const TRIMMED = value.trim()

  if (!IsValidMoney(TRIMMED)) return null

  return TRIMMED.replace(THOUSAND_SEPARATOR, "")
    .replace(/,$/, "")
    .replace(",", ".")
}

/**
 * @summary
 * Tells whether a money value is above zero.
 *
 * @remarks
 * Reads the sign and the digits of the string, so no
 * binary float is involved. An unparseable value is
 * neither positive nor negative.
 *
 * @explanation
 * Use to branch on the direction of an amount without
 * converting it, such as when counting the positive and
 * negative balances of a list.
 *
 * @param value - Masked or raw money string.
 * @returns True when the value is above zero.
 *
 * @example
 * const HAS_CREDIT = IsPositiveMoney(entry.value);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function IsPositiveMoney(value: string): boolean {
  const NORMALIZED = NormalizeMoney(value)

  if (NORMALIZED === null) return false

  return !NORMALIZED.startsWith("-") && /[1-9]/.test(NORMALIZED)
}

/**
 * @summary
 * Tells whether a money value is below zero.
 *
 * @remarks
 * Reads the sign and the digits of the string, so no
 * binary float is involved. An unparseable value is
 * neither positive nor negative.
 *
 * @explanation
 * Use to branch on the direction of an amount without
 * converting it, such as when counting the positive and
 * negative balances of a list.
 *
 * @param value - Masked or raw money string.
 * @returns True when the value is below zero.
 *
 * @example
 * const HAS_DEBIT = IsNegativeMoney(entry.value);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function IsNegativeMoney(value: string): boolean {
  const NORMALIZED = NormalizeMoney(value)

  if (NORMALIZED === null) return false

  return NORMALIZED.startsWith("-") && /[1-9]/.test(NORMALIZED)
}

export {
  IsNegativeMoney,
  IsPositiveMoney,
  IsValidMoney,
  NormalizeMoney,
}
