import Decimal from "decimal.js"

export interface NormCompliancePolicy {
  // Display name of the norm.
  name: string
  // Article number of the norm, such as `Art. 7º I`.
  articleNumber: string
  // Category the norm enquadrates.
  categoryName: string
  // Target allocation of the policy, in percent.
  targetAllocation: string
  // Minimum allocation of the policy, in percent.
  minAllocation: string
  // Maximum allocation of the policy, in percent.
  maxAllocation: string
}

export interface NormComplianceAllocation {
  // Category of the portfolio slice, or `null` when the
  // position holds no category.
  categoryName: string | null
  // Current share of the portfolio, in percent.
  weight: string
}

export interface NormComplianceRow {
  articleNumber: string
  // Policy label, as `name - articleNumber`.
  policy: string
  // Current share of the portfolio under the policy.
  current: string
  target: string
  maximum: string
  minimum: string
  // Whether the current share sits inside the closed
  // `[minimum, maximum]` range of the policy.
  compliant: boolean
}

/**
 * @summary
 * Checks the portfolio allocation against the registered
 * investment policy.
 *
 * @remarks
 * For every policy, reads the current allocation of its
 * category and flags the policy as compliant when the
 * current share sits inside the closed `[minimum,
 * maximum]` range. A category with no position resolves to
 * a current share of `0.00`.
 *
 * @explanation
 * Use this calculator to resolve the compliance table of
 * the statement report. The ranges come from the norm
 * registry and the overrides of the portfolio, never from
 * the report itself.
 *
 * @param policies - The registered policies, in order.
 * @param allocation - The current allocation by category.
 *
 * @returns One compliance row per policy, in order.
 *
 * @example
 * const ROWS = calculateNormCompliance({
 *   policies: [
 *     {
 *       name: "Resolução 5.272/25",
 *       articleNumber: "Art. 7º I",
 *       categoryName: "Renda Fixa",
 *       targetAllocation: "100.00",
 *       minAllocation: "0.00",
 *       maxAllocation: "100.00",
 *     },
 *   ],
 *   allocation: [{ categoryName: "Renda Fixa", weight: "100.00" }],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function calculateNormCompliance(props: {
  policies: readonly NormCompliancePolicy[]
  allocation: readonly NormComplianceAllocation[]
}): NormComplianceRow[] {
  const WEIGHT_BY_CATEGORY = new Map<string, string>()

  for (const SLICE of props.allocation) {
    if (SLICE.categoryName === null) continue
    WEIGHT_BY_CATEGORY.set(SLICE.categoryName, SLICE.weight)
  }

  return props.policies.map((policy) => {
    const CURRENT =
      WEIGHT_BY_CATEGORY.get(policy.categoryName) ?? "0.00"
    const MINIMUM = new Decimal(policy.minAllocation)
    const MAXIMUM = new Decimal(policy.maxAllocation)
    const VALUE = new Decimal(CURRENT)

    return {
      articleNumber: policy.articleNumber,
      policy: `${policy.name} - ${policy.articleNumber}`,
      current: CURRENT,
      target: policy.targetAllocation,
      maximum: policy.maxAllocation,
      minimum: policy.minAllocation,
      compliant:
        VALUE.greaterThanOrEqualTo(MINIMUM) &&
        VALUE.lessThanOrEqualTo(MAXIMUM),
    }
  })
}
