import { z } from "zod";

import { noContent, ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam } from "@/app/api/_core/schemas";
import { deleteCategory } from "@/business/use-cases/fund/delete-category.uc";
import { getCategory } from "@/business/use-cases/fund/get-category.uc";
import { updateCategory } from "@/business/use-cases/fund/update-category.uc";

/**
 * The JSON body accepted when updating a category.
 */
const UPDATE_BODY = z.object({
  name: z.string().trim().min(1).max(60),
});

/**
 * Retrieves a single fund category.
 */
export const GET = apiHandler({
  handler: async ({ params, runtime }) => {
    const categoryId = entityIdParam.parse(params.categoryId);
    const dto = await runtime.unitOfWork.run((tx) =>
      getCategory(tx, { categoryId }),
    );
    return ok(dto);
  },
});

/**
 * Updates a fund category.
 *
 * Reference and administration mutations are restricted to managers.
 */
export const PATCH = apiHandler({
  bodySchema: UPDATE_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const categoryId = entityIdParam.parse(params.categoryId);
    const dto = await updateCategory(runtime.unitOfWork, {
      actorId: actor.actorId,
      categoryId,
      name: body.name,
    });
    return ok(dto);
  },
});

/**
 * Deletes a fund category.
 *
 * Reference and administration mutations are restricted to managers.
 */
export const DELETE = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const categoryId = entityIdParam.parse(params.categoryId);
    await deleteCategory(runtime.unitOfWork, {
      actorId: actor.actorId,
      categoryId,
    });
    return noContent();
  },
});
