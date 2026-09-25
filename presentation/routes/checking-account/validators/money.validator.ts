/**
 * @summary
 * Validates a **money** value string.
 *
 * @remarks
 * Accepts a plain integer or a decimal value with a
 * comma or a dot separator and up to six decimal
 * places. An optional leading minus sign is allowed.
 *
 * @explanation
 * Use this validator in money forms before submitting.
 * It checks the shape of the amount only.
 *
 * @param value - Masted or raw money string.
 *
 * @returns Validity of the money value.
 *
 * @example
 * const VALID = IsValidMoney("-1234,56");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function IsValidMoney(value: string): boolean {
  const TRIMMED = value.trim()

  if (!/^-?\d+([.,]\d{1,6})?$/.test(TRIMMED)) {
    return false
  }

  return Number.isFinite(
    Number.parseFloat(TRIMMED.replace(",", "."))
  )
}

export { IsValidMoney }
