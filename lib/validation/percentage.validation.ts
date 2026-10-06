/**
 * @summary
 * Validates a **percentage** value between `0` and
 * `999,99`.
 *
 * @remarks
 * Accepts comma or dot decimal separators and at most
 * two decimals, matching the `numeric(5,2)` column
 * limit.
 *
 * @explanation
 * Use in fund and portfolio form schemas to validate
 * the masked percentage fields before submitting. It
 * rejects empty, negative, or out-of-range values.
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

/**
 * @summary
 * Validates a **signed percentage** value between `-999,99`
 * and `999,99`.
 *
 * @remarks
 * A periodic return is a delta, so it can be negative, while
 * `IsValidPercentage` guards a bound that cannot be. Both
 * accept a comma or a dot separator and at most two decimals,
 * so they read the same text; the only difference is the sign
 * the pattern allows.
 *
 * @explanation
 * Use for a rate field, such as the rate of an index history
 * entry, where a loss is a real value. Keep
 * `IsValidPercentage` for allocations and fees, where it is
 * not.
 *
 * @param value - Masked or raw percentage string.
 *
 * @returns Validity of the signed percentage.
 *
 * @example
 * const VALID = IsValidSignedPercentage("-1,23");
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function IsValidSignedPercentage(value: string): boolean {
  const NORMALIZED = value.trim().replace(",", ".")

  if (!/^-?\d{1,3}(\.\d{1,2})?$/.test(NORMALIZED)) {
    return false
  }

  return (
    Number(NORMALIZED) >= -999.99 && Number(NORMALIZED) <= 999.99
  )
}

export { IsValidPercentage, IsValidSignedPercentage }
