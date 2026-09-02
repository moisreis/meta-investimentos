import Decimal from "decimal.js";

import { calculatePortfolioDailyFactor } from "@/business/calculators/portfolio/daily-factor.calculator";
import type { GrowthFactor } from "@/business/value-objects/growth-factor.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";

interface BuildPortfolioDailyGrowthFactorsProps {
  businessDays: string[];
  positions: [fundId: number, quotas: string][];
  quotaValues: Record<number, Record<string, string>>;
  cashFlows: [fundId: number, date: string, quotas: string, value: string][];
}

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
