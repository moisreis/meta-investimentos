/**
 * @summary
 * Validates a **percentage** value between `0` and `999,99`.
 *
 * @remarks
 * Accepts comma or dot decimal separators and at most two
 * decimals, matching the `numeric(5,2)` column limit.
 *
 * @explanation
 * Use in portfolio form schemas to validate the masked
 * percentage fields before submitting. It rejects empty,
 * negative, or out-of-range values.
 *
 * @param value - Masked or raw percentage string.
 *
 * @returns Validity of the percentage.
 *
 * @example
 * const VALID = IsValidPercentage("10,5");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function IsValidPercentage(value: string): boolean {
  const NORMALIZED = value.trim().replace(",", ".")

  if (!/^\d{1,3}(\.\d{1,2})?$/.test(NORMALIZED)) {
    return false
  }

  return Number(NORMALIZED) >= 0 && Number(NORMALIZED) <= 999.99
}

export { IsValidPercentage }
