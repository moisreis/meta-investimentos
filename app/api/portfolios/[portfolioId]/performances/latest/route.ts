import { ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam } from "@/app/api/_core/schemas";
import { getLatestPortfolioPerformance } from "@/business/use-cases/performance/get-latest-portfolio-performance.uc";

/**
 * Retrieves the most recent portfolio performance of a portfolio the
 * actor can access.
 */
export const GET = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const portfolioId = entityIdParam.parse(params.portfolioId);
    const performance = await runtime.unitOfWork.run((tx) =>
      getLatestPortfolioPerformance(tx, {
        actorId: actor.actorId,
        portfolioId,
      }),
    );
    return ok(performance);
  },
});
