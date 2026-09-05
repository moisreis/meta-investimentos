import { ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam } from "@/app/api/_core/schemas";
import { getPositionPerformance } from "@/business/use-cases/performance/get-position-performance.uc";

/**
 * Retrieves a single position performance the actor can access.
 */
export const GET = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const performanceId = entityIdParam.parse(params.performanceId);
    const performance = await runtime.unitOfWork.run((tx) =>
      getPositionPerformance(tx, {
        actorId: actor.actorId,
        performanceId,
      }),
    );
    return ok(performance);
  },
});
