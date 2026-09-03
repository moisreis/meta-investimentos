import Decimal from "decimal.js";

import { calculatePortfolioDailyFactor } from "@/business/calculators/portfolio/daily-factor.calculator";
import type { GrowthFactor } from "@/business/value-objects/growth-factor.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";

/**
 * Represents the inputs required to build
 * daily portfolio growth factors for a test scenario.
 *
 * The business days are strings in `YYYY-MM-DD`
 * format. Each position is a tuple of fund ID and
 * quota quantity. The quota values map each fund to
 * its daily quota price. The cash flows describe
 * quota subscriptions or redemptions per fund and date.
 */
interface BuildPortfolioDailyGrowthFactorsProps {
  businessDays: string[];
  positions: [fundId: number, quotas: string][];
  quotaValues: Record<number, Record<string, string>>;
  cashFlows: [fundId: number, date: string, quotas: string, value: string][];
}

/**
 * Builds an array of daily portfolio growth factors
 * for a given set of business days, positions,
 * quota values, and cash flows.
 *
 * The function iterates over each business day,
 * applies cash flows to quota balances, and
 * calculates the daily growth factor using
 * {@link calculatePortfolioDailyFactor}. The first
 * day has no growth factor because there is no
 * previous day value.
 *
 * @param businessDays - The ordered list of business days to process.
 * @param positions - The initial quota balances per fund.
 * @param quotaValues - The daily quota price per fund and date.
 * @param cashFlows - The quota subscriptions or redemptions
 *                     per fund, date, quota quantity, and value.
 *
 * @returns The list of daily growth factors. Each element
 *          contains a {@link GrowthFactor} value.
 */
export function buildPortfolioDailyGrowthFactors({
  businessDays,
  positions,
  quotaValues,
  cashFlows,
}: BuildPortfolioDailyGrowthFactorsProps): { value: GrowthFactor }[] {
  const QUOTA_BALANCES = new Map<number, Decimal>(
    positions.map(([fundId, quotas]) => [fundId, new Decimal(quotas)]),
  );

  const DAILY_GROWTH_FACTORS: { value: GrowthFactor }[] = [];

  let previousDayPortfolioValue: SignedMoney | null = null;

  const PORTFOLIO_VALUE_ON = (date: string): Decimal =>
    [...QUOTA_BALANCES.entries()].reduce(
      (acc, [fundId, balance]) =>
        acc.plus(balance.times(quotaValues[fundId][date])),
      new Decimal(0),
    );

  for (const currentDay of businessDays) {
    for (const [fundId, date, quotas] of cashFlows) {
      if (date !== currentDay) continue;

      const BALANCE = QUOTA_BALANCES.get(fundId);
      if (BALANCE) {
        QUOTA_BALANCES.set(fundId, BALANCE.plus(quotas));
      }
    }

    const CURRENT_DAY_PORTFOLIO_VALUE = SignedMoney.create(
      PORTFOLIO_VALUE_ON(currentDay),
    );

    if (previousDayPortfolioValue) {
      const CURRENT_DAY_CASH_FLOW = SignedMoney.create(
        cashFlows.reduce(
          (acc, [, date, , value]) =>
            date === currentDay ? acc.plus(value) : acc,
          new Decimal(0),
        ),
      );

      DAILY_GROWTH_FACTORS.push({
        value: calculatePortfolioDailyFactor({
          currentDayPortfolioValue: CURRENT_DAY_PORTFOLIO_VALUE,
          currentDayCashFlow: CURRENT_DAY_CASH_FLOW,
          previousDayPortfolioValue,
        }),
      });
    }

    previousDayPortfolioValue = CURRENT_DAY_PORTFOLIO_VALUE;
  }

  return DAILY_GROWTH_FACTORS;
}
