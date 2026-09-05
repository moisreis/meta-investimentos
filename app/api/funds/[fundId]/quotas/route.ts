import { z } from "zod";

import { created, paginated } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { slicePage } from "@/app/api/_core/pagination";
import {
  dateStringSchema,
  entityIdParam,
  paginationQuerySchema,
  positiveMoneySchema,
} from "@/app/api/_core/schemas";
import { createQuota } from "@/business/use-cases/fund/create-quota.uc";
import { listFundQuotas } from "@/business/use-cases/fund/list-fund-quotas.uc";

/**
 * The JSON body accepted when creating a quota.
 */
const CREATE_BODY = z.object({
  date: dateStringSchema,
  price: positiveMoneySchema,
});

/**
 * Lists every quota registered for a fund.
 */
export const GET = apiHandler({
  querySchema: paginationQuerySchema,
  handler: async ({ params, query, runtime }) => {
    const fundId = entityIdParam.parse(params.fundId);
    const quotas = await runtime.unitOfWork.run((tx) =>
      listFundQuotas(tx, { fundId }),
    );
    const page = slicePage(quotas, query);
    return paginated(page.items, page.meta);
  },
});

/**
 * Creates a quota for a fund on a given date.
 *
 * Any authenticated user may register quota prices.
 */
export const POST = apiHandler({
  bodySchema: CREATE_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const fundId = entityIdParam.parse(params.fundId);
    const dto = await createQuota(runtime.unitOfWork, {
      actorId: actor.actorId,
      fundId,
      date: body.date,
      price: body.price,
    });
    return created(dto);
  },
});
