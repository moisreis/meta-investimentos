import { z } from "zod";

import { created, ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import {
  accessRoleSchema,
  entityIdParam,
  entityIdSchema,
} from "@/app/api/_core/schemas";
import { grantPortfolioAccess } from "@/business/use-cases/user/grant-portfolio-access.uc";
import { listPortfolioAccess } from "@/business/use-cases/user/list-portfolio-access.uc";

/**
 * The JSON body accepted when granting access to a portfolio.
 */
const GRANT_BODY = z.object({
  userId: entityIdSchema,
  role: accessRoleSchema,
});

/**
 * Lists all users granted access to a portfolio.
 *
 * Only the portfolio owner may list access entries.
 */
export const GET = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const portfolioId = entityIdParam.parse(params.portfolioId);
    const entries = await runtime.unitOfWork.run((tx) =>
      listPortfolioAccess(tx, { actorId: actor.actorId, portfolioId }),
    );
    return ok(entries);
  },
});

/**
 * Grants a user access to a portfolio.
 *
 * Only the portfolio owner may grant access.
 */
export const POST = apiHandler({
  bodySchema: GRANT_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const portfolioId = entityIdParam.parse(params.portfolioId);
    const dto = await grantPortfolioAccess(runtime.unitOfWork, {
      actorId: actor.actorId,
      portfolioId,
      ...body,
    });
    return created(dto);
  },
});
