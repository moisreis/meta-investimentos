import { ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam } from "@/app/api/_core/schemas";
import { getLatestPositionPerformance } from "@/business/use-cases/performance/get-latest-position-performance.uc";

/**
 * Retrieves the most recent position performance of a position the actor
 * can access.
 */
export const GET = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const positionId = entityIdParam.parse(params.positionId);
    const performance = await runtime.unitOfWork.run((tx) =>
      getLatestPositionPerformance(tx, {
        actorId: actor.actorId,
        positionId,
      }),
    );
    return ok(performance);
  },
});
