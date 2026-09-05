import { ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { resolveReferenceDate } from "@/app/api/_core/reference-date";
import { referenceDateQuerySchema } from "@/app/api/_core/schemas";
import { listFundStaleness } from "@/business/use-cases/cvm/list-fund-staleness.uc";
import { toFundDto } from "@/business/use-cases/fund/fund.dtos";

/**
 * Lists every fund and how stale its quota data is.
 */
export const GET = apiHandler({
  querySchema: referenceDateQuerySchema,
  handler: async ({ query, runtime }) => {
    const referenceDate = resolveReferenceDate(query.referenceDate);
    const entries = await runtime.unitOfWork.run((tx) =>
      listFundStaleness(
        {
          findAll: (options) => tx.funds.findAll(options),
          findLatestByFundIds: (fundIds) =>
            tx.quotas.findLatestByFundIds(fundIds),
        },
        referenceDate,
      ),
    );
    return ok({
      data: entries.map((entry) => ({
        fund: toFundDto(entry.fund),
        latestQuotaDate: entry.latestQuotaDate?.toISOString() ?? null,
        daysSinceLatest: entry.daysSinceLatest,
      })),
    });
  },
});
