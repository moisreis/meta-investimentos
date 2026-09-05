import { z } from "zod";

import { noContent, ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam } from "@/app/api/_core/schemas";
import { deleteBenchmark } from "@/business/use-cases/benchmark/delete-benchmark.uc";
import { getBenchmark } from "@/business/use-cases/benchmark/get-benchmark.uc";
import { updateBenchmark } from "@/business/use-cases/benchmark/update-benchmark.uc";

/**
 * The JSON body accepted when updating a benchmark.
 */
const UPDATE_BODY = z
  .object({
    acronym: z.string().trim().min(1).max(12).optional(),
    name: z.string().trim().min(1).max(90).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided.",
  });

/**
 * Retrieves a single benchmark.
 */
export const GET = apiHandler({
  handler: async ({ params, runtime }) => {
    const benchmarkId = entityIdParam.parse(params.benchmarkId);
    const dto = await runtime.unitOfWork.run((tx) =>
      getBenchmark(tx, { benchmarkId }),
    );
    return ok(dto);
  },
});

/**
 * Updates a benchmark.
 *
 * Reference and administration mutations are restricted to managers.
 */
export const PATCH = apiHandler({
  bodySchema: UPDATE_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const benchmarkId = entityIdParam.parse(params.benchmarkId);
    const dto = await updateBenchmark(runtime.unitOfWork, {
      actorId: actor.actorId,
      benchmarkId,
      ...body,
    });
    return ok(dto);
  },
});

/**
 * Deletes a benchmark.
 *
 * Reference and administration mutations are restricted to managers.
 */
export const DELETE = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const benchmarkId = entityIdParam.parse(params.benchmarkId);
    await deleteBenchmark(runtime.unitOfWork, {
      actorId: actor.actorId,
      benchmarkId,
    });
    return noContent();
  },
});
