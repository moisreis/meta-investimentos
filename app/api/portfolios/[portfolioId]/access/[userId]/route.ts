import { z } from "zod";

import { noContent, ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { accessRoleSchema, entityIdParam } from "@/app/api/_core/schemas";
import { revokePortfolioAccess } from "@/business/use-cases/user/revoke-portfolio-access.uc";
import { updatePortfolioAccess } from "@/business/use-cases/user/update-portfolio-access.uc";

/**
 * The JSON body accepted when updating a portfolio access entry.
 */
const UPDATE_BODY = z.object({
  role: accessRoleSchema,
});

/**
 * Updates a user's access level on a portfolio.
 *
 * Only the portfolio owner may update access.
 */
export const PATCH = apiHandler({
  bodySchema: UPDATE_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const portfolioId = entityIdParam.parse(params.portfolioId);
    const userId = entityIdParam.parse(params.userId);
    const dto = await updatePortfolioAccess(runtime.unitOfWork, {
      actorId: actor.actorId,
      portfolioId,
      userId,
      role: body.role,
    });
    return ok(dto);
  },
});

/**
 * Revokes a user's access to a portfolio.
 *
 * Only the portfolio owner may revoke access.
 */
export const DELETE = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const portfolioId = entityIdParam.parse(params.portfolioId);
    const userId = entityIdParam.parse(params.userId);
    await revokePortfolioAccess(runtime.unitOfWork, {
      actorId: actor.actorId,
      portfolioId,
      userId,
    });
    return noContent();
  },
});
