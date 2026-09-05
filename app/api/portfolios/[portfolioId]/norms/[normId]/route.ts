import { noContent } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam } from "@/app/api/_core/schemas";
import { removeNormFromPortfolio } from "@/business/use-cases/norm/remove-norm-from-portfolio.uc";

/**
 * Removes a norm from a portfolio.
 *
 * Only the portfolio owner or an editor may remove norms.
 */
export const DELETE = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const portfolioId = entityIdParam.parse(params.portfolioId);
    const normId = entityIdParam.parse(params.normId);
    await removeNormFromPortfolio(runtime.unitOfWork, {
      actorId: actor.actorId,
      portfolioId,
      normId,
    });
    return noContent();
  },
});
