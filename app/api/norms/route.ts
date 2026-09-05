import { z } from "zod";

import { created, ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdSchema, percentageSchema } from "@/app/api/_core/schemas";
import { createNorm } from "@/business/use-cases/norm/create-norm.uc";
import { listNormsByCategory } from "@/business/use-cases/norm/list-norms-by-category.uc";

/**
 * The JSON body accepted when creating a norm.
 */
const CREATE_BODY = z.object({
  articleNumber: z.string().trim().min(1).max(40),
  name: z.string().trim().min(1).max(90),
  categoryId: entityIdSchema,
  minAllocation: percentageSchema,
  maxAllocation: percentageSchema,
  targetAllocation: percentageSchema,
});

/**
 * The query parameters accepted when listing norms.
 */
const LIST_QUERY = z.object({
  categoryId: entityIdSchema.optional(),
});

/**
 * Lists regulatory norms, optionally filtered by the fund category they
 * constrain.
 */
export const GET = apiHandler({
  querySchema: LIST_QUERY,
  handler: async ({ query, runtime }) => {
    const categoryId = query.categoryId;
    const norms = categoryId
      ? await runtime.unitOfWork.run((tx) =>
          listNormsByCategory(tx, { categoryId }),
        )
      : [];
    return ok(norms);
  },
});

/**
 * Creates a regulatory norm.
 *
 * Any authenticated user may register norms.
 */
export const POST = apiHandler({
  bodySchema: CREATE_BODY,
  handler: async ({ actor, body, runtime }) => {
    const dto = await createNorm(runtime.unitOfWork, {
      actorId: actor.actorId,
      ...body,
    });
    return created(dto);
  },
});
