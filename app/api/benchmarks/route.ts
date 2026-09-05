import { z } from "zod";

import {
  created,
  type PaginationMeta,
  paginated,
} from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { pageBounds, snapshotPaginationMeta } from "@/app/api/_core/pagination";
import { paginationQuerySchema } from "@/app/api/_core/schemas";
import { createBenchmark } from "@/business/use-cases/benchmark/create-benchmark.uc";
import { listBenchmarks } from "@/business/use-cases/benchmark/list-benchmarks.uc";

/**
 * The JSON body accepted when creating a benchmark.
 */
const CREATE_BODY = z.object({
  acronym: z.string().trim().min(1).max(12),
  name: z.string().trim().min(1).max(90),
});

/**
 * Lists benchmarks.
 *
 * Reference data is readable by any authenticated user.
 */
export const GET = apiHandler({
  querySchema: paginationQuerySchema,
  handler: async ({ query, runtime }) => {
    const bounds = pageBounds(query);
    const benchmarks = await runtime.unitOfWork.run((tx) =>
      listBenchmarks(tx, { limit: bounds.pageSize, offset: bounds.offset }),
    );

    const metadata: PaginationMeta = snapshotPaginationMeta({
      ...bounds,
      returned: benchmarks.length,
    });

    return paginated(benchmarks, metadata);
  },
});

/**
 * Creates a benchmark.
 *
 * Any authenticated user may register benchmark reference data.
 */
export const POST = apiHandler({
  bodySchema: CREATE_BODY,
  handler: async ({ actor, body, runtime }) => {
    const dto = await createBenchmark(runtime.unitOfWork, {
      actorId: actor.actorId,
      ...body,
    });
    return created(dto);
  },
});
