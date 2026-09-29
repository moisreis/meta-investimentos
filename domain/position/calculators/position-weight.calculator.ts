import Decimal from "decimal.js"

import { SignedMoney, SignedPercentage } from "@/value-objects"
import { ValidationError } from "@errors/validation.error"

// The whole portfolio, in percent units.
const FULL_WEIGHT = new Decimal(100)

// The neutral money value.
const NO_BALANCE = new Decimal(0)

interface CalculatePositionWeightProps {
  // Money currently invested in the position.
  positionBalance: SignedMoney
  // Money currently invested across every position of the
  // portfolio the position belongs to.
  portfolioBalance: SignedMoney
}

/**
 * @summary
 * Calculates the share of the portfolio a position holds,
 * weighted by the money invested in it.
 *
 * @remarks
 * Divides the balance of the position by the balance of its
 * portfolio and scales the ratio to percent units, so a
 * position holding R$ 90.000 of a R$ 100.000 portfolio weighs
 * 90% and the R$ 10.000 position weighs 10%. Result is
 * normalized by `SignedPercentage`.
 *
 * This is the **effective** weight of a position, driven by
 * how much money it actually holds. It differs from
 * `calculatePositionAllocation`, which returns the nominal
 * even split a position receives when it joins a portfolio
 * and is persisted as the target share.
 *
 * @explanation
 * Use this function to report how much of a portfolio a
 * position represents, such as the share rendered under the
 * fund name of a position picker. Feed it the invested value
 * of the position and the invested value of its portfolio,
 * summing the balances the same way for every position of
 * that portfolio so the reported shares add up to 100%.
 *
 * A drained position can report a negative share, so both
 * balances are `SignedMoney` and the result may be negative.
 * A negative sibling has the mirror effect, so a position can
 * also weigh more than 100% while the shares still add up.
 * The portfolio balance must be greater than zero, because
 * there is no share of nothing.
 *
 * @param props - The calculation input.
 * @param props.positionBalance - Money invested in the
 * position.
 * @param props.portfolioBalance - Money invested across the
 * positions of the portfolio.
 *
 * @returns The share of the portfolio the position holds.
 *
 * @example
 * const RESULT = calculatePositionWeight({
 *   positionBalance: SignedMoney.create("90000.00"),
 *   portfolioBalance: SignedMoney.create("100000.00"),
 * });
 * // returns 90%
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function calculatePositionWeight({
  positionBalance,
  portfolioBalance,
}: CalculatePositionWeightProps): SignedPercentage {
  if (portfolioBalance.value.lessThanOrEqualTo(NO_BALANCE)) {
    throw new ValidationError(
      "`Position` weight requires a portfolio balance greater than zero."
    )
  }

  return SignedPercentage.create(
    positionBalance.value
      .dividedBy(portfolioBalance.value)
      .times(FULL_WEIGHT)
  )
}
