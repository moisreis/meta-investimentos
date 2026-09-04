import type { Fund } from "@/business/entities/fund/fund.entity";
import type { Quota } from "@/business/entities/fund/quota.entity";
import type { IFund } from "@/business/interfaces/fund/fund.interface";
import type { IQuota } from "@/business/interfaces/fund/quota.interface";

/**
 * A single fund's staleness entry.
 */
export interface FundStaleness {
  fund: Fund;
  latestQuotaDate: Date | null;
  daysSinceLatest: number | null;
}

/**
 * Lists every fund and how stale its quota data is.
 *
 * A fund with no quota at all has `null` for both the latest date and
 * the staleness count.
 *
 * @param ctx - The fund and quota repositories.
 * @param asOf - The date to compute staleness against (defaults to
 *   now).
 * @returns The funds sorted by staleness (most stale first).
 */
export async function listFundStaleness(
  ctx: Pick<IFund, "findAll"> & Pick<IQuota, "findLatestByFundIds">,
  asOf: Date = new Date(),
): Promise<FundStaleness[]> {
  const FUNDS = await ctx.findAll();
  const FUND_IDS: string[] = [];

  for (const FUND of FUNDS) {
    if (FUND.id) {
      FUND_IDS.push(FUND.id);
    }
  }

  const LATEST = await ctx.findLatestByFundIds(FUND_IDS);
  const LATEST_MAP = new Map<string, Quota>();

  for (const Q of LATEST) {
    LATEST_MAP.set(Q.fundId, Q);
  }

  const AS_OF = asOf.getTime();

  const ENTRIES: FundStaleness[] = FUNDS.map((FUND) => {
    const LATEST_QUOTA = FUND.id ? (LATEST_MAP.get(FUND.id) ?? null) : null;
    const LATEST_DATE = LATEST_QUOTA?.date ?? null;
    const DAYS = LATEST_DATE
      ? Math.floor((AS_OF - LATEST_DATE.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    return {
      fund: FUND,
      latestQuotaDate: LATEST_DATE,
      daysSinceLatest: DAYS,
    };
  });

  ENTRIES.sort((A, B) => {
    if (A.daysSinceLatest === null && B.daysSinceLatest === null) return 0;
    if (A.daysSinceLatest === null) return 1;
    if (B.daysSinceLatest === null) return -1;
    return B.daysSinceLatest - A.daysSinceLatest;
  });

  return ENTRIES;
}
