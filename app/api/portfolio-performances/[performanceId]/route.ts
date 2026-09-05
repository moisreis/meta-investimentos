import { ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam } from "@/app/api/_core/schemas";
import { getPortfolioPerformance } from "@/business/use-cases/performance/get-portfolio-performance.uc";

/**
 * Retrieves a single portfolio performance the actor can access.
 */
export const GET = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const performanceId = entityIdParam.parse(params.performanceId);
    const performance = await runtime.unitOfWork.run((tx) =>
      getPortfolioPerformance(tx, {
        actorId: actor.actorId,
        performanceId,
      }),
    );
    return ok(performance);
  },
});
