import Decimal from "decimal.js"

export interface CategoryAllocationEntry {
  // Category of the invested money, or `null` when the
  // fund holds no category.
  categoryName: string | null
  // Money invested through the entry, as a decimal
  // string. Can be negative when a position redeemed
  // more than it earned.
  investedValue: string
}

export interface CategoryAllocationRow {
  // Category of the group, preserved as `null` so the
  // caller decides how to label an uncategorized entry.
  categoryName: string | null
  // Sum of the invested values of the group.
  investedValue: string
  // Share of the total the group holds, in percent,
  // with two decimals.
  weight: string
}

/**
 * @summary
 * Aggregates invested values into per-category allocation
 * rows.
 *
 * @remarks
 * Groups the entries by category, sums the invested value
 * of each group and derives the share of the total each
 * group holds. Rows are sorted by invested value, largest
 * first. When the total is zero, every weight is `0.00`,
 * so an empty or fully redeemed portfolio never divides
 * by zero.
 *
 * @explanation
 * Use this calculator to resolve the per-category slice
 * of a portfolio before a table or chart renders it. It
 * only regroups what the caller provides, so the registry
 * lookups stay outside.
 *
 * @param entries - The invested values to aggregate,
 *   already grouped by nothing. `null` category names
 *   stay grouped together.
 *
 * @returns The allocation rows, largest group first.
 *
 * @example
 * const ROWS = calculatePortfolioCategoryAllocation({
 *   entries: [
 *     { categoryName: "Renda Fixa", investedValue: "800.00" },
 *     { categoryName: null, investedValue: "200.00" },
 *   ],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function calculatePortfolioCategoryAllocation(
  entries: readonly CategoryAllocationEntry[]
): CategoryAllocationRow[] {
  const TOTAL = entries.reduce(
    (sum, entry) => sum.plus(new Decimal(entry.investedValue)),
    new Decimal(0)
  )

  const BY_CATEGORY = new Map<string | null, Decimal>()
  for (const ENTRY of entries) {
    BY_CATEGORY.set(
      ENTRY.categoryName,
      (
        BY_CATEGORY.get(ENTRY.categoryName) ?? new Decimal(0)
      ).plus(new Decimal(ENTRY.investedValue))
    )
  }

  const ROWS: CategoryAllocationRow[] = [
    ...BY_CATEGORY.entries(),
  ].map(([CATEGORY_NAME, VALUE]) => ({
    categoryName: CATEGORY_NAME,
    investedValue: VALUE.toFixed(2),
    weight: TOTAL.isZero()
      ? "0.00"
      : VALUE.div(TOTAL).times(100).toFixed(2),
  }))

  return ROWS.sort((left, right) =>
    new Decimal(right.investedValue).cmp(left.investedValue)
  )
}
