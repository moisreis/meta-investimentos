import { z } from "zod";

import { created, ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import {
  entityIdParam,
  entityIdSchema,
  percentageSchema,
} from "@/app/api/_core/schemas";
import { applyNormToPortfolio } from "@/business/use-cases/norm/apply-norm-to-portfolio.uc";
import { listPortfolioNorms } from "@/business/use-cases/norm/list-portfolio-norms.uc";

/**
 * The JSON body accepted when applying a norm to a portfolio.
 */
const APPLY_BODY = z.object({
  normId: entityIdSchema,
  minAllocation: percentageSchema,
  maxAllocation: percentageSchema,
  targetAllocation: percentageSchema,
});

/**
 * Lists the norms applied to a portfolio.
 */
export const GET = apiHandler({
  handler: async ({ params, runtime }) => {
    const portfolioId = entityIdParam.parse(params.portfolioId);
    const norms = await runtime.unitOfWork.run((tx) =>
      listPortfolioNorms(tx, { portfolioId }),
    );
    return ok(norms);
  },
});

/**
 * Applies a norm to a portfolio.
 *
 * Only the portfolio owner or an editor may apply norms.
 */
export const POST = apiHandler({
  bodySchema: APPLY_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const portfolioId = entityIdParam.parse(params.portfolioId);
    const dto = await applyNormToPortfolio(runtime.unitOfWork, {
      actorId: actor.actorId,
      portfolioId,
      ...body,
    });
    return created(dto);
  },
});
