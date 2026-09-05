import { z } from "zod";

import { created, paginated } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { slicePage } from "@/app/api/_core/pagination";
import { paginationQuerySchema } from "@/app/api/_core/schemas";
import { createCategory } from "@/business/use-cases/fund/create-category.uc";
import { listCategories } from "@/business/use-cases/fund/list-categories.uc";

/**
 * The JSON body accepted when creating a category.
 */
const CREATE_BODY = z.object({
  name: z.string().trim().min(1).max(60),
});

/**
 * Lists fund categories.
 *
 * Reference data is readable by any authenticated user.
 */
export const GET = apiHandler({
  querySchema: paginationQuerySchema,
  handler: async ({ query, runtime }) => {
    const categories = await runtime.unitOfWork.run((tx) => listCategories(tx));
    const page = slicePage(categories, query);
    return paginated(page.items, page.meta);
  },
});

/**
 * Creates a fund category.
 *
 * Any authenticated user may register categories.
 */
export const POST = apiHandler({
  bodySchema: CREATE_BODY,
  handler: async ({ actor, body, runtime }) => {
    const dto = await createCategory(runtime.unitOfWork, {
      actorId: actor.actorId,
      name: body.name,
    });
    return created(dto);
  },
});
