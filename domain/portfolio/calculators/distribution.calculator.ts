import Decimal from "decimal.js"

export interface DistributionEntry {
  // Label of the group.
  label: string
  // Value of the group, as a decimal string. May be
  // negative.
  value: string
}

export interface DistributionRow {
  label: string
  // Sum of the values of the group.
  value: string
  // Share of the total the group holds, in percent, with
  // two decimals.
  weight: string
}

/**
 * @summary
 * Aggregates labeled values into distribution rows.
 *
 * @remarks
 * Groups the entries by label, sums the value of each
 * group and derives the share of the total each group
 * holds. Rows are sorted by value, largest first. When the
 * total is zero, every weight is `0.00`, so an empty
 * distribution never divides by zero.
 *
 * @explanation
 * Use this calculator to resolve any labeled share of the
 * statement (by fund, by reference index or by financial
 * institution) before a table or chart renders it.
 *
 * @param entries - The labeled values to aggregate.
 *
 * @returns The distribution rows, largest group first.
 *
 * @example
 * const ROWS = calculateDistribution([
 *   { label: "Fundo A", value: "800.00" },
 *   { label: "Fundo B", value: "200.00" },
 * ]);
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function calculateDistribution(
  entries: readonly DistributionEntry[]
): DistributionRow[] {
  const TOTAL = entries.reduce(
    (sum, entry) => sum.plus(new Decimal(entry.value)),
    new Decimal(0)
  )

  const BY_LABEL = new Map<string, Decimal>()
  for (const ENTRY of entries) {
    BY_LABEL.set(
      ENTRY.label,
      (BY_LABEL.get(ENTRY.label) ?? new Decimal(0)).plus(
        new Decimal(ENTRY.value)
      )
    )
  }

  return [...BY_LABEL.entries()]
    .map(([LABEL, VALUE]) => ({
      label: LABEL,
      value: VALUE.toFixed(2),
      weight: TOTAL.isZero()
        ? "0.00"
        : VALUE.dividedBy(TOTAL).times(100).toFixed(2),
    }))
    .sort((left, right) =>
      new Decimal(right.value).cmp(new Decimal(left.value))
    )
}
