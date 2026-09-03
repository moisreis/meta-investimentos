import { calculateDailyFactor } from "@/business/calculators/position/daily-factor.calculator";
import type { GrowthFactor } from "@/business/value-objects/growth-factor.vo";
import { QuotaPrice } from "@/business/value-objects/quota-price.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";

/**
 * Represents the inputs required to build
 * daily position growth factors for a test scenario.
 *
 * The quota values map each date to its quota price.
 * The pre-application and post-application quotas
 * are the quota quantities before and after the
 * application. The application date is the date of
 * the application. The application value is the
 * monetary amount of the application.
 */
interface BuildPositionDailyGrowthFactorsProps {
  quotaValues: Record<string, string>;
  preApplicationQuotas: string;
  postApplicationQuotas: string;
  applicationDate: string;
  applicationValue: string;
}

/**
 * Builds an array of daily position growth factors
 * for a given set of quota values and one application.
 *
 * The function calculates the daily growth factor
 * for each consecutive pair of quota values using
 * {@link calculateDailyFactor}. It applies the
 * pre-application quota quantity before the
 * application date and the post-application quota
 * quantity on and after the application date.
 *
 * @param quotaValues - The daily quota price keyed by date.
 * @param preApplicationQuotas - The quota quantity before
 *                               the application.
 * @param postApplicationQuotas - The quota quantity after
 *                                the application.
 * @param applicationDate - The date of the application.
 * @param applicationValue - The monetary amount of the
 *                           application.
 *
 * @returns The list of daily growth factors. Each element
 *          contains a {@link GrowthFactor} value.
 */
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
