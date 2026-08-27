import { calculateDailyFactor } from "@/business/calculators/position/daily-factor.calculator";
import type GrowthFactor from "@/business/value-objects/growth-factor.vo";
import QuotaPrice from "@/business/value-objects/quota-price.vo";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";
import SignedMoney from "@/business/value-objects/signed-money.vo";

interface BuildPositionDailyGrowthFactorsProps {
  quotaValues: Record<string, string>;
  preApplicationQuotas: string;
  postApplicationQuotas: string;
  applicationDate: string;
  applicationValue: string;
}

export function buildPositionDailyGrowthFactors({
  quotaValues,
  preApplicationQuotas,
  postApplicationQuotas,
  applicationDate,
  applicationValue,
}: BuildPositionDailyGrowthFactorsProps): { value: GrowthFactor }[] {
  const PRE_APPLICATION_QUOTAS = QuotaQuantity.create(preApplicationQuotas);
  const POST_APPLICATION_QUOTAS = QuotaQuantity.create(postApplicationQuotas);
  const APPLICATION_VALUE = SignedMoney.create(applicationValue);
  const QUOTA_VALUE_ENTRIES = Object.entries(quotaValues);
  const APPLICATION_INDEX = QUOTA_VALUE_ENTRIES.findIndex(
    ([date]) => date === applicationDate,
  );

  return QUOTA_VALUE_ENTRIES.slice(1).map(
    ([date, currentQuotaValue], slicedIndex) => {
      const ORIGINAL_INDEX = slicedIndex + 1;
      const [, previousQuotaValue] = QUOTA_VALUE_ENTRIES[ORIGINAL_INDEX - 1];
      const IS_APPLICATION_DAY = date === applicationDate;
      const CURRENT_IS_ON_OR_AFTER_APPLICATION =
        ORIGINAL_INDEX >= APPLICATION_INDEX;
      const PREVIOUS_IS_ON_OR_AFTER_APPLICATION =
        ORIGINAL_INDEX - 1 >= APPLICATION_INDEX;

      return {
        value: calculateDailyFactor({
          currentDayQuotaValue: QuotaPrice.create(currentQuotaValue),
          currentDayQuotaQuantity: CURRENT_IS_ON_OR_AFTER_APPLICATION
            ? POST_APPLICATION_QUOTAS
            : PRE_APPLICATION_QUOTAS,
          currentDayCashFlow: IS_APPLICATION_DAY
            ? APPLICATION_VALUE
            : SignedMoney.create("0"),
          previousDayQuotaValue: QuotaPrice.create(previousQuotaValue),
          previousDayQuotaQuantity: PREVIOUS_IS_ON_OR_AFTER_APPLICATION
            ? POST_APPLICATION_QUOTAS
            : PRE_APPLICATION_QUOTAS,
        }),
      };
    },
  );
}
