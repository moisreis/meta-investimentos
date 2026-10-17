import Decimal from "decimal.js"

export interface HoldingAggregationEntry {
  // Label of the group the holding belongs to.
  label: string
  // Money invested through the holding, as a decimal string.
  patrimony: string
  // Earnings of the holding in the reference month, as a
  // decimal string.
  earnings: string
}

export interface HoldingAggregationRow {
  label: string
  // Sum of the patrimony of the group, with two decimals.
  patrimony: string
  // Sum of the earnings of the group, with two decimals.
  earnings: string
  // Share of the total patrimony the group holds, in percent,
  // with two decimals.
  weight: string
}

/**
 * @summary
 * Aggregates holdings into labeled patrimony and earnings
 * rows.
 *
 * @remarks
 * Groups the entries by label, sums the patrimony and the
 * earnings of each group and derives the share of the total
 * patrimony each group holds. Rows are sorted by patrimony,
 * largest first. When the total patrimony is zero, every
 * weight is `0.00`, so an empty portfolio never divides by
 * zero.
 *
 * @explanation
 * Use this calculator to resolve the groups of the statement
 * report — by reference index and by asset type — before a
 * table or a chart renders them. It only regroups what the
 * caller provides, so the registry lookups and the group
 * labels stay outside.
 *
 * @param entries - The holdings to aggregate, already
 *   labeled by the caller.
 *
 * @returns The aggregation rows, largest group first.
 *
 * @example
 * const ROWS = calculateHoldingAggregation([
 *   { label: "CDI", patrimony: "800.00", earnings: "8.00" },
 *   { label: "IPCA", patrimony: "200.00", earnings: "1.00" },
 * ]);
 *
 * @author Moisés Reis
 *
 * @date 2026-10-15
 */
export function calculateHoldingAggregation(
  entries: readonly HoldingAggregationEntry[]
): HoldingAggregationRow[] {
  const TOTAL = entries.reduce(
    (sum, entry) => sum.plus(new Decimal(entry.patrimony)),
    new Decimal(0)
  )

  const BY_LABEL = new Map<
    string,
    { patrimony: Decimal; earnings: Decimal }
  >()

  for (const ENTRY of entries) {
    const GROUP = BY_LABEL.get(ENTRY.label) ?? {
      patrimony: new Decimal(0),
      earnings: new Decimal(0),
    }

    GROUP.patrimony = GROUP.patrimony.plus(
      new Decimal(ENTRY.patrimony)
    )
    GROUP.earnings = GROUP.earnings.plus(
      new Decimal(ENTRY.earnings)
    )
    BY_LABEL.set(ENTRY.label, GROUP)
  }

  return [...BY_LABEL.entries()]
    .map(([LABEL, GROUP]) => ({
      label: LABEL,
      patrimony: GROUP.patrimony.toFixed(2),
      earnings: GROUP.earnings.toFixed(2),
      weight: TOTAL.isZero()
        ? "0.00"
        : GROUP.patrimony.dividedBy(TOTAL).times(100).toFixed(2),
    }))
    .sort((left, right) =>
      new Decimal(right.patrimony).cmp(
        new Decimal(left.patrimony)
      )
    )
}
