import { ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam } from "@/app/api/_core/schemas";
import { listPositionPerformances } from "@/business/use-cases/performance/list-position-performances.uc";

/**
 * Lists the performances of a position the actor can access.
 */
export const GET = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const positionId = entityIdParam.parse(params.positionId);
    const performances = await runtime.unitOfWork.run((tx) =>
      listPositionPerformances(tx, {
        actorId: actor.actorId,
        positionId,
      }),
    );
    return ok(performances);
  },
});
