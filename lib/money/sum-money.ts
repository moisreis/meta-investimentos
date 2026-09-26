import { NormalizeMoney } from "./money.validator"

// The number of decimal places of a **BRL** amount.
const MONEY_SCALE = 2

// The decimal places kept for the other precise measures of
// the platform, such as quota quantities and quota prices.
const PRECISE_SCALE = 6

/**
 * @summary
 * Converts a money string into an exact scaled integer.
 *
 * @remarks
 * Works on the digits of the string, so no binary float
 * ever touches a monetary amount. Rounds a value with more
 * decimals than the scale by truncation, and rejects a
 * value that does not match the money shape.
 *
 * @param value - Masked or raw money string.
 * @param scale - The decimal places of the target unit.
 * @returns The scaled integer, or `null` when invalid.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function ToScaledUnits(
  value: string,
  scale: number
): bigint | null {
  const NORMALIZED = NormalizeMoney(value)

  if (NORMALIZED === null) return null

  const NEGATIVE = NORMALIZED.startsWith("-")
  const UNSIGNED = NEGATIVE ? NORMALIZED.slice(1) : NORMALIZED
  const [WHOLE = "0", FRACTION = ""] = UNSIGNED.split(".")

  const PADDED = (FRACTION + "0".repeat(scale)).slice(0, scale)
  const UNITS = BigInt(WHOLE + PADDED)

  return NEGATIVE ? UNITS * BigInt(-1) : UNITS
}

/**
 * @summary
 * Converts an exact scaled integer back into a decimal
 * string.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function FromScaledUnits(units: bigint, scale: number): string {
  const NEGATIVE = units < BigInt(0)
  const ABSOLUTE = NEGATIVE ? units * BigInt(-1) : units
  const DIVISOR = BigInt(10) ** BigInt(scale)
  const WHOLE = (ABSOLUTE / DIVISOR).toString()
  const FRACTION = (ABSOLUTE % DIVISOR)
    .toString()
    .padStart(scale, "0")
  const SIGN = NEGATIVE ? "-" : ""

  return scale === 0
    ? `${SIGN}${WHOLE}`
    : `${SIGN}${WHOLE}.${FRACTION}`
}

/**
 * @summary
 * Sums decimal strings exactly and returns a decimal
 * string.
 *
 * @remarks
 * Adds the values as scaled integers, so the total never
 * drifts the way a sum of binary floats does. Nil and
 * unparseable entries are skipped, which keeps a single
 * malformed row from turning a whole total into a fallback.
 *
 * @explanation
 * Use for any total rendered on a card or a table footer.
 * Returns a plain decimal string, ready for a presenter.
 *
 * @param values - The values to add.
 * @param scale - The decimal places of the result.
 * @returns The exact total as a decimal string.
 *
 * @example
 * const TOTAL = SumMoney(["10.10", "0.20"]);
 * // returns "10.30"
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function SumDecimals(
  values: readonly (string | number | null | undefined)[],
  scale: number
): string {
  let TOTAL = BigInt(0)

  for (const VALUE of values) {
    if (VALUE === null || VALUE === undefined) continue

    const UNITS = ToScaledUnits(String(VALUE), scale)

    if (UNITS !== null) TOTAL += UNITS
  }

  return FromScaledUnits(TOTAL, scale)
}

/**
 * @summary
 * Sums money values exactly and returns a decimal string.
 *
 * @remarks
 * Sums at two decimal places, the precision of a **BRL**
 * amount, so the result is the total the user expects to
 * read on screen.
 *
 * @explanation
 * Use for currency totals. Never sum money with `parseFloat`
 * and `+`: that accumulates binary representation error
 * across the rows.
 *
 * @param values - The money values to add.
 * @returns The exact total as a decimal string.
 *
 * @example
 * const TOTAL = SumMoney(ROWS.map((ROW) => ROW.amount));
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function SumMoney(
  values: readonly (string | number | null | undefined)[]
): string {
  return SumDecimals(values, MONEY_SCALE)
}

/**
 * @summary
 * Sums quota values exactly and returns a decimal string.
 *
 * @remarks
 * Sums at the precision a quota carries, which is higher
 * than a currency amount.
 *
 * @explanation
 * Use for quota totals, such as the quotas of a
 * withdrawal or an application.
 *
 * @param values - The quota values to add.
 * @returns The exact total as a decimal string.
 *
 * @example
 * const TOTAL = SumQuotas(ROWS.map((ROW) => ROW.quotas));
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function SumQuotas(
  values: readonly (string | number | null | undefined)[]
): string {
  return SumDecimals(values, PRECISE_SCALE)
}

export { MONEY_SCALE, SumDecimals, SumMoney, SumQuotas }
