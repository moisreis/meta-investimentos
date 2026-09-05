import { z } from "zod";

import { noContent, ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam } from "@/app/api/_core/schemas";
import { deletePortfolio } from "@/business/use-cases/portfolio/delete-portfolio.uc";
import { getPortfolio } from "@/business/use-cases/portfolio/get-portfolio.uc";
import { updatePortfolio } from "@/business/use-cases/portfolio/update-portfolio.uc";

/**
 * The JSON body accepted when updating a portfolio.
 */
const UPDATE_BODY = z
  .object({
    name: z.string().trim().min(1).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided.",
  });

/**
 * Retrieves a portfolio the authenticated user can access.
 */
export const GET = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const portfolioId = entityIdParam.parse(params.portfolioId);
    const dto = await runtime.unitOfWork.run((tx) =>
      getPortfolio(tx, { actorId: actor.actorId, portfolioId }),
    );
    return ok(dto);
  },
});

/**
 * Updates a portfolio.
 *
 * Only the owner may rename a portfolio.
 */
export const PATCH = apiHandler({
  bodySchema: UPDATE_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const portfolioId = entityIdParam.parse(params.portfolioId);
    const dto = await updatePortfolio(runtime.unitOfWork, {
      actorId: actor.actorId,
      portfolioId,
      name: body.name,
    });
    return ok(dto);
  },
});

/**
 * Deletes a portfolio.
 *
 * Only the owner may delete a portfolio.
 */
export const DELETE = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const portfolioId = entityIdParam.parse(params.portfolioId);
    await deletePortfolio(runtime.unitOfWork, {
      actorId: actor.actorId,
      portfolioId,
    });
    return noContent();
  },
});
