import { ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { resolveReferenceDate } from "@/app/api/_core/reference-date";
import {
  entityIdParam,
  referenceDateQuerySchema,
} from "@/app/api/_core/schemas";
import { calculatePositionMarketValue } from "@/business/use-cases/position/calculate-position-market-value.uc";

/**
 * Calculates the market value of a single position on a reference
 * date.
 */
export const GET = apiHandler({
  querySchema: referenceDateQuerySchema,
  handler: async ({ actor, params, query, runtime }) => {
    const positionId = entityIdParam.parse(params.positionId);
    const referenceDate = resolveReferenceDate(query.referenceDate);
    const dto = await runtime.unitOfWork.run((tx) =>
      calculatePositionMarketValue(tx, {
        actorId: actor.actorId,
        positionId,
        referenceDate,
      }),
    );
    return ok(dto);
  },
});
