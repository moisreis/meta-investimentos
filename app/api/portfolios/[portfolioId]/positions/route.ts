import { z } from "zod";

import { created, ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam, entityIdSchema } from "@/app/api/_core/schemas";
import { createPosition } from "@/business/use-cases/position/create-position.uc";
import { listPortfolioPositions } from "@/business/use-cases/position/list-portfolio-positions.uc";

/**
 * The JSON body accepted when creating a position.
 */
const CREATE_BODY = z.object({
  fundId: entityIdSchema,
});

/**
 * Lists all positions of a portfolio the authenticated user can access.
 */
export const GET = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const portfolioId = entityIdParam.parse(params.portfolioId);
    const positions = await runtime.unitOfWork.run((tx) =>
      listPortfolioPositions(tx, { actorId: actor.actorId, portfolioId }),
    );
    return ok(positions);
  },
});

/**
 * Creates a position for a fund within a portfolio.
 *
 * Only the portfolio owner or an editor may create positions.
 */
export const POST = apiHandler({
  bodySchema: CREATE_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const portfolioId = entityIdParam.parse(params.portfolioId);
    const dto = await createPosition(runtime.unitOfWork, {
      actorId: actor.actorId,
      portfolioId,
      fundId: body.fundId,
    });
    return created(dto);
  },
});
