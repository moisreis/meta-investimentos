import { z } from "zod";

import { noContent, ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam, percentageSchema } from "@/app/api/_core/schemas";
import { deleteBenchmarkHistory } from "@/business/use-cases/benchmark/delete-benchmark-history.uc";
import { updateBenchmarkHistory } from "@/business/use-cases/benchmark/update-benchmark-history.uc";

/**
 * The JSON body accepted when updating a benchmark history entry.
 */
const UPDATE_BODY = z.object({
  rate: percentageSchema,
});

/**
 * Updates the rate of a benchmark history entry.
 *
 * Reference and administration mutations are restricted to managers.
 */
export const PATCH = apiHandler({
  bodySchema: UPDATE_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const benchmarkHistoryId = entityIdParam.parse(params.benchmarkHistoryId);
    const dto = await updateBenchmarkHistory(runtime.unitOfWork, {
      actorId: actor.actorId,
      benchmarkHistoryId,
      rate: body.rate,
    });
    return ok(dto);
  },
});

/**
 * Deletes a benchmark history entry.
 *
 * Reference and administration mutations are restricted to managers.
 */
export const DELETE = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const benchmarkHistoryId = entityIdParam.parse(params.benchmarkHistoryId);
    await deleteBenchmarkHistory(runtime.unitOfWork, {
      actorId: actor.actorId,
      benchmarkHistoryId,
    });
    return noContent();
  },
});
