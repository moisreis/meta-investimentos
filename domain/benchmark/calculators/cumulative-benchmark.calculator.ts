import Decimal from "decimal.js"

import { SignedPercentage } from "@/value-objects"

interface CalculatePortfolioCumulativeBenchmarkProps {
  monthlyIndexValues: { value: SignedPercentage }[]
}

/**
 * @summary
 * Calculates the cumulative value of a reference index.
 *
 * @remarks
 * Chains monthly index values to compute cumulative return.
 * Works for **IPCA**, **CDI**, or **Ibovespa** indices.
 *
 * @explanation
 * Use this function to compute the cumulative benchmark value
 * over multiple months. It compounds each monthly index value
 * in chronological order.
 *
 * @param monthlyIndexValues - Monthly index values in
 *   chronological order.
 * @returns The cumulative value.
 *
 * @example
 * const RESULT = calculatePortfolioCumulativeBenchmark({
 *   monthlyIndexValues: [
 *     { value: SignedPercentage.create("0.45") },
 *     { value: SignedPercentage.create("0.42") },
 *     { value: SignedPercentage.create("0.51") },
 *   ],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export function calculatePortfolioCumulativeBenchmark({
  monthlyIndexValues,
}: CalculatePortfolioCumulativeBenchmarkProps): SignedPercentage {
  const CUMULATIVE_FACTOR = monthlyIndexValues.reduce(
    (acc, monthlyIndexValue) =>
      acc.times(
        new Decimal(1).plus(monthlyIndexValue.value.value.dividedBy(100))
      ),
    new Decimal(1)
  )

  return SignedPercentage.create(CUMULATIVE_FACTOR.minus(1).times(100))
}
