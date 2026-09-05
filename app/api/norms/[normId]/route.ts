import { z } from "zod";

import { noContent, ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import {
  entityIdParam,
  entityIdSchema,
  percentageSchema,
} from "@/app/api/_core/schemas";
import { deleteNorm } from "@/business/use-cases/norm/delete-norm.uc";
import { getNorm } from "@/business/use-cases/norm/get-norm.uc";
import { updateNorm } from "@/business/use-cases/norm/update-norm.uc";

/**
 * The JSON body accepted when updating a norm.
 */
const UPDATE_BODY = z
  .object({
    articleNumber: z.string().trim().min(1).max(40).optional(),
    name: z.string().trim().min(1).max(90).optional(),
    categoryId: entityIdSchema.optional(),
    minAllocation: percentageSchema.optional(),
    maxAllocation: percentageSchema.optional(),
    targetAllocation: percentageSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided.",
  });

/**
 * Retrieves a single regulatory norm.
 */
export const GET = apiHandler({
  handler: async ({ params, runtime }) => {
    const normId = entityIdParam.parse(params.normId);
    const dto = await runtime.unitOfWork.run((tx) => getNorm(tx, { normId }));
    return ok(dto);
  },
});

/**
 * Updates a regulatory norm.
 *
 * Reference and administration mutations are restricted to managers.
 */
export const PATCH = apiHandler({
  bodySchema: UPDATE_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const normId = entityIdParam.parse(params.normId);
    const dto = await updateNorm(runtime.unitOfWork, {
      actorId: actor.actorId,
      normId,
      ...body,
    });
    return ok(dto);
  },
});

/**
 * Deletes a regulatory norm.
 *
 * Reference and administration mutations are restricted to managers.
 */
export const DELETE = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const normId = entityIdParam.parse(params.normId);
    await deleteNorm(runtime.unitOfWork, {
      actorId: actor.actorId,
      normId,
    });
    return noContent();
  },
});
