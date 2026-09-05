import { z } from "zod";

import { ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { dateStringSchema } from "@/app/api/_core/schemas";
import { listQuotaGaps } from "@/business/use-cases/cvm/list-quota-gaps.uc";

/**
 * The query parameters accepted by the quota-gaps endpoint.
 */
const GAPS_QUERY = z.object({
  startDate: dateStringSchema,
  endDate: dateStringSchema,
});

/**
 * Detects dates where some funds have quota data but others do not.
 */
export const GET = apiHandler({
  querySchema: GAPS_QUERY,
  handler: async ({ query, runtime }) => {
    const gaps = await runtime.unitOfWork.run((tx) =>
      listQuotaGaps(
        {
          findAll: (options) => tx.funds.findAll(options),
          findAllByFundIdsInPeriod: (fundIds, start, end) =>
            tx.quotas.findAllByFundIdsInPeriod(fundIds, start, end),
        },
        query.startDate,
        query.endDate,
      ),
    );
    return ok(gaps);
  },
});
