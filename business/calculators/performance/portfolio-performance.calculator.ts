import Decimal from "decimal.js";

import {
  calculatePortfolioCashFlowNet,
  calculatePortfolioCumulativeTarget,
  calculatePortfolioEarnings,
  calculatePortfolioInflationSpread,
  calculatePortfolioMarketSpread,
  calculatePortfolioReturn,
  calculatePortfolioRiskFreeSpread,
} from "@/business/calculators";
import { PortfolioPerformance } from "@/business/entities/performance/portfolio-performance.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { GrowthFactor } from "@/business/value-objects/growth-factor.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";
import type { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

/**
 * The inputs required to compute the daily performance of a portfolio.
 */
export interface PortfolioPerformanceInput {
  /**
   * The id of the portfolio.
   */
  portfolioId: string;

  /**
   * The date of the performance being computed.
   */
  date: Date;

  /**
   * The sum of the portfolios across the positions (patrimony).
   */
  portfolioValue: Decimal;

  /**
   * The sum of the initial balances across the positions.
   */
  sumOfInitialBalances: Decimal;

  /**
   * The cumulative application amounts and quotas across all positions.
   */
  applicationTotal: Decimal;
  applicationQuotas: Decimal;

  /**
   * The cumulative withdrawal amounts and quotas across all positions.
   */
  withdrawalTotal: Decimal;
  withdrawalQuotas: Decimal;

  /**
   * The daily growth factor of the portfolio for the current day.
   */
  dailyGrowthFactor: GrowthFactor | null;

  /**
   * The daily growth factors for each trailing period.
   */
  trailingPeriods: Record<string, GrowthFactor[]>;

  /**
   * The monthly target as a percentage (e.g. `0.5` represents 0.5%). When
   * `null`, the current month's target cannot be derived.
   */
  monthlyTarget: SignedPercentage | null;

  /**
   * The monthly target percentages used to compute the cumulative target.
   */
  cumulativeTargets: SignedPercentage[];

  /**
   * The monthly benchmark rates (@Percentages) for the cumulative
   * benchmark computation.
   */
  monthlyBenchmarkRates: SignedPercentage[];

  /**
   * The trailing-period returns of the portfolio used to compute spreads.
   */
  trailingMonthlyReturn: SignedPercentage | null;

  /**
   * The monthly benchmark index values (IPCA/CDI/Ibovespa) used to
   * compute the spreads.
   */
  inflationIndexReturn: SignedPercentage | null;
  riskFreeIndexReturn: SignedPercentage | null;
  marketIndexReturn: SignedPercentage | null;
}

/**
 * Computes the immutable {@link PortfolioPerformance} row for a single
 * portfolio on a single date.
 */
export function calculatePortfolioPerformance(
  input: PortfolioPerformanceInput,
): PortfolioPerformance {
  const QUOTAS_HELD_RAW = Decimal.max(
    input.applicationQuotas.minus(input.withdrawalQuotas),
    0,
  );

  const PATRIMONY = PositiveMoney.create(Decimal.max(input.portfolioValue, 0));
  const APPLICATION_TOTAL = PositiveMoney.create(input.applicationTotal);
  const REDEMPTION_TOTAL = PositiveMoney.create(input.withdrawalTotal);
  const CASH_FLOW_NET = calculatePortfolioCashFlowNet({
    applications: APPLICATION_TOTAL,
    withdrawals: REDEMPTION_TOTAL,
  });

  const EARNINGS = calculatePortfolioEarnings({
    sumOfPositionCurrentBalances: SignedMoney.create(input.portfolioValue),
    sumOfPositionInitialBalance: SignedMoney.create(input.sumOfInitialBalances),
    cashFlow: CASH_FLOW_NET,
  });

  const DAILY_FACTORS = input.dailyGrowthFactor
    ? [{ value: input.dailyGrowthFactor }]
    : [];
  const RETURN_DAILY = calculatePortfolioReturn({
    dailyGrowthFactors: DAILY_FACTORS,
  });

  const TRAILING = computeTrailingReturns(input.trailingPeriods);
  const CUMULATIVE_TARGET = calculatePortfolioCumulativeTarget({
    monthlyTargets: input.cumulativeTargets.map((value) => ({ value })),
  });

  const INFLATION_SPREAD =
    input.trailingMonthlyReturn && input.inflationIndexReturn
      ? calculatePortfolioInflationSpread({
          portfolioReturn: input.trailingMonthlyReturn,
          inflationRate: input.inflationIndexReturn,
        })
      : null;
  const RISK_FREE_SPREAD =
    input.trailingMonthlyReturn && input.riskFreeIndexReturn
      ? calculatePortfolioRiskFreeSpread({
          portfolioReturn: input.trailingMonthlyReturn,
          riskFreeRate: input.riskFreeIndexReturn,
        })
      : null;
  const MARKET_SPREAD =
    input.trailingMonthlyReturn && input.marketIndexReturn
      ? calculatePortfolioMarketSpread({
          portfolioReturn: input.trailingMonthlyReturn,
          marketRate: input.marketIndexReturn,
        })
      : null;

  return PortfolioPerformance.create({
    portfolioId: EntityId.create(input.portfolioId),
    date: input.date,
    quotasHeld: QuotaQuantity.create(QUOTAS_HELD_RAW),
    patrimony: PATRIMONY,
    applicationTotal: APPLICATION_TOTAL,
    redemptionTotal: REDEMPTION_TOTAL,
    cashFlowNet: CASH_FLOW_NET,
    earnings: EARNINGS,
    returnDaily: RETURN_DAILY,
    returnMonthly: TRAILING.monthly,
    returnYearly: TRAILING.yearly,
    returnLast12m: TRAILING.last12m,
    target: input.monthlyTarget,
    cumulativeTarget: CUMULATIVE_TARGET,
    inflationSpread: INFLATION_SPREAD,
    riskFreeSpread: RISK_FREE_SPREAD,
    marketSpread: MARKET_SPREAD,
  });
}

function computeTrailingReturns(
  trailingPeriods: Record<string, GrowthFactor[]>,
): {
  monthly: SignedPercentage | null;
  yearly: SignedPercentage | null;
  last12m: SignedPercentage | null;
} {
  const monthlyFactors = trailingPeriods.monthly ?? [];
  const yearlyFactors = trailingPeriods.yearly ?? [];
  const last12mFactors = trailingPeriods.last12m ?? [];

  return {
    monthly:
      monthlyFactors.length > 0
        ? calculatePortfolioReturn({
            dailyGrowthFactors: monthlyFactors.map((value) => ({ value })),
          })
        : null,
    yearly:
      yearlyFactors.length > 0
        ? calculatePortfolioReturn({
            dailyGrowthFactors: yearlyFactors.map((value) => ({ value })),
          })
        : null,
    last12m:
      last12mFactors.length > 0
        ? calculatePortfolioReturn({
            dailyGrowthFactors: last12mFactors.map((value) => ({ value })),
          })
        : null,
  };
}
