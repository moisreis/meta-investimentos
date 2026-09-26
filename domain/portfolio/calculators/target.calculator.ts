import Decimal from "decimal.js"

import { SignedPercentage } from "@/value-objects"
import { ValidationError } from "@/errors"

interface CalculatePortfolioTargetProps {
  annualInterestRate: SignedPercentage
  inflationRate: SignedPercentage
}

/**
 * @summary
 * Calculates the monthly Target return of a Portfolio.
 *
 * @remarks
 * Compounds the monthly inflation index with the
 * monthly portfolio interest rate.
 * Throws if annual interest rate is below -100%.
 *
 * @explanation
 * Use this function to compute the Portfolio's monthly target
 * return. It converts the annual rate to monthly via compound
 * interest, then combines with monthly inflation (**IPCA**).
 *
 * @param annualInterestRate - Annual interest rate (%).
 * @param inflationRate - Monthly inflation index **IPCA** (%).
 *
 * @returns The monthly target.
 *
 * @example
 * const RESULT = calculatePortfolioTarget({
 *   annualInterestRate: SignedPercentage.create("44.30"),
 *   inflationRate: SignedPercentage.create("0.45"),
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export function calculatePortfolioTarget({
  annualInterestRate,
  inflationRate,
}: CalculatePortfolioTargetProps): SignedPercentage {
  const MONTHLY_PORTFOLIO_BASE = new Decimal(1).plus(
    annualInterestRate.value.dividedBy(100)
  )

  if (MONTHLY_PORTFOLIO_BASE.lessThan(0)) {
    throw new ValidationError(
      "`Portfolio` target cannot be calculated with an annual interest rate below -100%."
    )
  }

  const MONTHLY_PORTFOLIO_RATE = MONTHLY_PORTFOLIO_BASE.toPower(
    1 / 12
  ).minus(1)

  const TARGET_RATE = new Decimal(1)
    .plus(MONTHLY_PORTFOLIO_RATE)
    .times(
      new Decimal(1).plus(inflationRate.value.dividedBy(100))
    )
    .minus(1)

  return SignedPercentage.create(TARGET_RATE.times(100))
}
