import { ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam } from "@/app/api/_core/schemas";
import { getLatestQuota } from "@/business/use-cases/fund/get-latest-quota.uc";

/**
 * Retrieves the most recent quota of a fund.
 */
export const GET = apiHandler({
  handler: async ({ params, runtime }) => {
    const fundId = entityIdParam.parse(params.fundId);
    const dto = await runtime.unitOfWork.run((tx) =>
      getLatestQuota(tx, { fundId }),
    );
    return ok(dto);
  },
});
