import type { IFund } from "@/business/interfaces/fund/fund.interface";
import type { IQuota } from "@/business/interfaces/fund/quota.interface";

/**
 * A single date where some funds are missing quota data.
 */
export interface QuotaGap {
  date: Date;
  missingFundCount: number;
  totalFundCount: number;
  missingFundIds: string[];
}

/**
 * Detects dates where some funds have quota data but others do not,
 * indicating a gap in the data.
 *
 * The function looks at a date range and for each date that at least
 * one fund has a quota, checks if any fund is missing.
 *
 * @param ctx - The fund and quota repositories.
 * @param startDate - The start of the range to check (inclusive).
 * @param endDate - The end of the range to check (inclusive).
 * @returns The detected gaps sorted by date ascending.
 */
export async function listQuotaGaps(
  ctx: Pick<IFund, "findAll"> & Pick<IQuota, "findAllByFundIdsInPeriod">,
  startDate: Date,
  endDate: Date,
): Promise<QuotaGap[]> {
  const FUNDS = await ctx.findAll();
  const FUND_IDS: string[] = [];

  for (const FUND of FUNDS) {
    if (FUND.id) {
      FUND_IDS.push(FUND.id);
    }
  }

  if (FUND_IDS.length === 0) {
    return [];
  }

  const QUOTAS = await ctx.findAllByFundIdsInPeriod(
    FUND_IDS,
    startDate,
    endDate,
  );

  const QUOTA_BY_DATE = new Map<number, Set<string>>();

  for (const Q of QUOTAS) {
    const DATE_KEY = Q.date.getTime();

    if (!QUOTA_BY_DATE.has(DATE_KEY)) {
      QUOTA_BY_DATE.set(DATE_KEY, new Set());
    }

    QUOTA_BY_DATE.get(DATE_KEY)?.add(Q.fundId);
  }

  const GAPS: QuotaGap[] = [];

  for (const [DATE_KEY, PRESENT] of QUOTA_BY_DATE) {
    if (PRESENT.size === FUND_IDS.length) {
      continue;
    }

    const MISSING = FUND_IDS.filter((ID) => !PRESENT.has(ID));

    if (MISSING.length > 0) {
      GAPS.push({
        date: new Date(DATE_KEY),
        missingFundCount: MISSING.length,
        totalFundCount: FUND_IDS.length,
        missingFundIds: MISSING,
      });
    }
  }

  GAPS.sort((A, B) => A.date.getTime() - B.date.getTime());

  return GAPS;
}
