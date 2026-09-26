import Decimal from "decimal.js"

import { SignedPercentage } from "@/value-objects"
import { ValidationError } from "@errors/validation.error"

// The percentage a position holds when it is the only one.
const FULL_ALLOCATION = new Decimal(100)

interface CalculatePositionAllocationProps {
  // How many positions share the portfolio.
  positionsCount: number
}

/**
 * @summary
 * Calculates the even allocation of a position.
 *
 * @remarks
 * Splits the whole portfolio evenly between every
 * position, so a single position holds 100% and two
 * positions hold 50% each. Result is normalized by
 * `SignedPercentage`.
 *
 * @explanation
 * Use this function whenever a position joins a
 * portfolio and every allocation must be recomputed.
 * A new position always redistributes the portfolio
 * evenly, so the sum stays at 100%.
 *
 * @param props - The calculation input.
 * @param props.positionsCount - How many positions
 * share the portfolio.
 *
 * @returns The even allocation percentage.
 *
 * @example
 * const RESULT = calculatePositionAllocation({
 *   positionsCount: 2,
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function calculatePositionAllocation({
  positionsCount,
}: CalculatePositionAllocationProps): SignedPercentage {
  if (!Number.isInteger(positionsCount) || positionsCount < 1) {
    throw new ValidationError(
      "`Position` allocation requires at least one position."
    )
  }

  return SignedPercentage.create(
    FULL_ALLOCATION.dividedBy(positionsCount)
  )
}
