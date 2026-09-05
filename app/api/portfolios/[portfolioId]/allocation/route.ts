import { z } from "zod";

import { ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam, percentageSchema } from "@/app/api/_core/schemas";
import { updatePortfolioAllocation } from "@/business/use-cases/portfolio/update-portfolio-allocation.uc";

/**
 * The JSON body accepted when updating the allocation targets of a
 * portfolio.
 */
const ALLOCATION_BODY = z.object({
  minAllocation: percentageSchema,
  targetAllocation: percentageSchema,
  maxAllocation: percentageSchema,
});

/**
 * Updates the allocation targets of a portfolio.
 *
 * Only the owner or an editor may change allocation targets.
 */
export const PATCH = apiHandler({
  bodySchema: ALLOCATION_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const portfolioId = entityIdParam.parse(params.portfolioId);
    const dto = await updatePortfolioAllocation(runtime.unitOfWork, {
      actorId: actor.actorId,
      portfolioId,
      ...body,
    });
    return ok(dto);
  },
});
