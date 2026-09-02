import Decimal from "decimal.js";

import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import { ValidationError } from "@/shared/errors";

/**
 * Represents the inputs required to calculate
 * the monthly Target return of a Portfolio.
 *
 * The annual interest rate is represented by {@link SignedPercentage}
 * and expresses the contracted annual rate of the Portfolio, while the
 * inflation rate is represented by {@link SignedPercentage} and
 * expresses the monthly inflation index (IPCA).
 */
interface CalculatePortfolioTargetProps {
  annualInterestRate: SignedPercentage;
  inflationRate: SignedPercentage;
}

/**
 * Calculates the monthly Target return of a Portfolio,
 * defined by the composition between the inflation rate
 * and the Portfolio's interest rate, both converted to
 * a monthly base.
 *
 * The Portfolio's monthly interest rate is derived from the
 * annual interest rate by compound interest conversion, and
 * the Target is the compounded monthly interest factor with
 * the monthly inflation factor.
 *
 * The result is expressed as a percentage, rounded to
 * 2 decimal places, and represented as a {@link SignedPercentage}.
 *
 * @param annualInterestRate - The annual interest rate
 *                             defined for the Portfolio,
 *                             in percentage terms.
 * @param inflationRate - The monthly inflation index (IPCA),
 *                        in percentage terms.
 *
 * @returns The calculated monthly Target return of the Portfolio.
 *
 * @throws {ValidationError} If `annualInterestRate` is below `-100`.
 *
 * @equation Tₜ = (1 + πₜ) · (1 + rᵖₜ) − 1, where rᵖₜ = (1 + rᵖₐ)^(1/12) − 1
 *
 * @example
 * ```ts
 * const RESULT = calculatePortfolioTarget({
 *   annualInterestRate: SignedPercentage.create('44.30'),
 *   inflationRate: SignedPercentage.create('0.45'),
 * })
 *
 * RESULT.value.toString()
 * // '3.57'
 * ```
 */
export function calculatePortfolioTarget({
  annualInterestRate,
  inflationRate,
}: CalculatePortfolioTargetProps): SignedPercentage {
  const MONTHLY_PORTFOLIO_BASE = new Decimal(1).plus(
    annualInterestRate.value.dividedBy(100),
  );

  if (MONTHLY_PORTFOLIO_BASE.lessThan(0)) {
    throw new ValidationError(
      "Portfolio target cannot be calculated with an annual interest rate below -100%.",
    );
  }

  const MONTHLY_PORTFOLIO_RATE = MONTHLY_PORTFOLIO_BASE.toPower(1 / 12).minus(
    1,
  );

  const TARGET_RATE = new Decimal(1)
    .plus(MONTHLY_PORTFOLIO_RATE)
    .times(new Decimal(1).plus(inflationRate.value.dividedBy(100)))
    .minus(1);

  return SignedPercentage.create(TARGET_RATE.times(100));
}
