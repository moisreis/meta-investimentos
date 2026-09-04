import Decimal from "decimal.js";

import {
  calculateCashFlowNet,
  calculateEarnings,
  calculateReturn,
} from "@/business/calculators";
import { PositionPerformance } from "@/business/entities/performance/position-performance.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { GrowthFactor } from "@/business/value-objects/growth-factor.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import type { QuotaPrice } from "@/business/value-objects/quota-price.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

/**
 * The cumulative (non-reversed) application and withdrawal totals of a
 * position up to a given date.
 */
export interface PositionFlowTotals {
  applicationAmount: Decimal;
  applicationQuotas: Decimal;
  withdrawalAmount: Decimal;
  withdrawalQuotas: Decimal;
}

/**
 * The inputs required to compute the daily performance of a single
 * position.
 */
export interface PositionPerformanceInput {
  /**
   * The id of the position.
   */
  positionId: string;

  /**
   * The date of the performance being computed.
   */
  date: Date;

  /**
   * The cumulative application/withdrawal amounts and quotas up to (and
   * including) the date, excluding reversed transactions.
   */
  flowTotals: PositionFlowTotals;

  /**
   * The daily growth factor of the position for the current day (the
   * ratio of the current day value to the previous day value, adjusted
   * for that day's cash flow). When `null`, the daily return is assumed
   * to be flat (zero).
   */
  dailyGrowthFactor: GrowthFactor | null;

  /**
   * The daily growth factors that make up each of the trailing periods
   * (monthly, yearly, last 12 months). The keys identify the period.
   */
  trailingPeriods: Record<string, GrowthFactor[]>;

  /**
   * The quota price of the fund on the date.
   */
  quotaPrice: QuotaPrice;

  /**
   * The allocation of this position within its portfolio, as a decimal
   * percentage (e.g. `35.5` represents 35.5%).
   */
  allocation: Decimal;

  /**
   * The position's initial balance, when set.
   */
  initialBalance: Decimal;
}

/**
 * Computes the immutable {@link PositionPerformance} row for a single
 * position on a single date.
 *
 * The calculator produces a fully hydrated performance entity that can be
 * persisted verbatim.
 */
export function calculatePositionPerformance(
  input: PositionPerformanceInput,
): PositionPerformance {
  const QUANTITY = Decimal.max(
    input.flowTotals.applicationQuotas.minus(input.flowTotals.withdrawalQuotas),
    0,
  );
  const QUOTAS_HELD = QuotaQuantity.create(QUANTITY);

  const PATRIMONY = PositiveMoney.create(
    input.quotaPrice.value.times(QUOTAS_HELD.value),
  );

  const APPLICATION_TOTAL = PositiveMoney.create(
    input.flowTotals.applicationAmount,
  );
  const REDEMPTION_TOTAL = PositiveMoney.create(
    input.flowTotals.withdrawalAmount,
  );
  const CASH_FLOW_NET = calculateCashFlowNet({
    applications: APPLICATION_TOTAL,
    withdrawals: REDEMPTION_TOTAL,
  });

  const EARNINGS = calculateEarnings({
    currentBalance: SignedMoney.create(PATRIMONY.value),
    initialBalance: input.initialBalance.greaterThan(0)
      ? SignedMoney.create(input.initialBalance)
      : SignedMoney.create("0"),
    cashFlow: CASH_FLOW_NET,
  });

  const DAILY_FACTORS = input.dailyGrowthFactor
    ? [{ value: input.dailyGrowthFactor }]
    : [];
  const RETURN_DAILY = calculateReturn({ dailyGrowthFactors: DAILY_FACTORS });

  const PERIOD_RETURNS = computePeriodReturns(input.trailingPeriods);

  return PositionPerformance.create({
    positionId: EntityId.create(input.positionId),
    date: input.date,
    quotasHeld: QUOTAS_HELD,
    patrimony: PATRIMONY,
    applicationTotal: APPLICATION_TOTAL,
    redemptionTotal: REDEMPTION_TOTAL,
    cashFlowNet: CASH_FLOW_NET,
    earnings: EARNINGS,
    returnDaily: RETURN_DAILY,
    returnMonthly: PERIOD_RETURNS.monthly,
    returnYearly: PERIOD_RETURNS.yearly,
    returnLast12m: PERIOD_RETURNS.last12m,
    allocation: SignedPercentage.create(input.allocation),
  });
}

/**
 * Computes the trailing-period returns from the accumulated growth
 * factors.
 */
function computePeriodReturns(
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
        ? calculateReturn({
            dailyGrowthFactors: monthlyFactors.map((value) => ({ value })),
          })
        : null,
    yearly:
      yearlyFactors.length > 0
        ? calculateReturn({
            dailyGrowthFactors: yearlyFactors.map((value) => ({ value })),
          })
        : null,
    last12m:
      last12mFactors.length > 0
        ? calculateReturn({
            dailyGrowthFactors: last12mFactors.map((value) => ({ value })),
          })
        : null,
  };
}
