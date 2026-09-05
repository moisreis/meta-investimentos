import { ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam } from "@/app/api/_core/schemas";
import { listPortfolioPerformances } from "@/business/use-cases/performance/list-portfolio-performances.uc";

/**
 * Lists the performances of a portfolio the actor can access.
 */
export const GET = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const portfolioId = entityIdParam.parse(params.portfolioId);
    const performances = await runtime.unitOfWork.run((tx) =>
      listPortfolioPerformances(tx, {
        actorId: actor.actorId,
        portfolioId,
      }),
    );
    return ok(performances);
  },
});
