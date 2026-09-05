import { z } from "zod";

import { noContent, ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam, positiveMoneySchema } from "@/app/api/_core/schemas";
import { deleteQuota } from "@/business/use-cases/fund/delete-quota.uc";
import { getQuota } from "@/business/use-cases/fund/get-quota.uc";
import { updateQuota } from "@/business/use-cases/fund/update-quota.uc";

/**
 * The JSON body accepted when updating a quota.
 */
const UPDATE_BODY = z.object({
  price: positiveMoneySchema,
});

/**
 * Retrieves a single quota.
 */
export const GET = apiHandler({
  handler: async ({ params, runtime }) => {
    const quotaId = entityIdParam.parse(params.quotaId);
    const dto = await runtime.unitOfWork.run((tx) => getQuota(tx, { quotaId }));
    return ok(dto);
  },
});

/**
 * Updates the price of a quota.
 *
 * Reference and administration mutations are restricted to managers.
 */
export const PATCH = apiHandler({
  bodySchema: UPDATE_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const quotaId = entityIdParam.parse(params.quotaId);
    const dto = await updateQuota(runtime.unitOfWork, {
      actorId: actor.actorId,
      quotaId,
      price: body.price,
    });
    return ok(dto);
  },
});

/**
 * Deletes a quota.
 *
 * Reference and administration mutations are restricted to managers.
 */
export const DELETE = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const quotaId = entityIdParam.parse(params.quotaId);
    await deleteQuota(runtime.unitOfWork, {
      actorId: actor.actorId,
      quotaId,
    });
    return noContent();
  },
});
