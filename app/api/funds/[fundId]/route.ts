import { z } from "zod";

import { noContent, ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import {
  entityIdParam,
  entityIdSchema,
  percentageSchema,
} from "@/app/api/_core/schemas";
import { deleteFund } from "@/business/use-cases/fund/delete-fund.uc";
import { getFund } from "@/business/use-cases/fund/get-fund.uc";
import { updateFund } from "@/business/use-cases/fund/update-fund.uc";

/**
 * The JSON body accepted when updating a fund.
 */
const UPDATE_BODY = z
  .object({
    name: z.string().trim().min(1).max(90).optional(),
    administrationFee: percentageSchema.nullable().optional(),
    performanceFee: percentageSchema.nullable().optional(),
    benchmarkId: entityIdSchema.nullable().optional(),
    categoryId: entityIdSchema.nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided.",
  });

/**
 * Retrieves a single fund.
 */
export const GET = apiHandler({
  handler: async ({ params, runtime }) => {
    const fundId = entityIdParam.parse(params.fundId);
    const dto = await runtime.unitOfWork.run((tx) => getFund(tx, { fundId }));
    return ok(dto);
  },
});

/**
 * Updates a fund.
 *
 * Reference and administration mutations are restricted to managers.
 */
export const PATCH = apiHandler({
  bodySchema: UPDATE_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const fundId = entityIdParam.parse(params.fundId);
    const dto = await updateFund(runtime.unitOfWork, {
      actorId: actor.actorId,
      fundId,
      ...body,
    });
    return ok(dto);
  },
});

/**
 * Deletes a fund.
 *
 * Reference and administration mutations are restricted to managers.
 */
export const DELETE = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const fundId = entityIdParam.parse(params.fundId);
    await deleteFund(runtime.unitOfWork, {
      actorId: actor.actorId,
      fundId,
    });
    return noContent();
  },
});
