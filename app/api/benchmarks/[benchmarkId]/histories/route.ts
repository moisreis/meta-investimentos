import { z } from "zod";

import { created, paginated } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { slicePage } from "@/app/api/_core/pagination";
import {
  dateStringSchema,
  entityIdParam,
  paginationQuerySchema,
  percentageSchema,
} from "@/app/api/_core/schemas";
import { createBenchmarkHistory } from "@/business/use-cases/benchmark/create-benchmark-history.uc";
import { listBenchmarkHistories } from "@/business/use-cases/benchmark/list-benchmark-histories.uc";

/**
 * The JSON body accepted when creating a benchmark history entry.
 */
const CREATE_BODY = z.object({
  date: dateStringSchema,
  rate: percentageSchema,
});

/**
 * Lists every history entry of a benchmark.
 */
export const GET = apiHandler({
  querySchema: paginationQuerySchema,
  handler: async ({ params, query, runtime }) => {
    const benchmarkId = entityIdParam.parse(params.benchmarkId);
    const histories = await runtime.unitOfWork.run((tx) =>
      listBenchmarkHistories(tx, { benchmarkId }),
    );
    const page = slicePage(histories, query);
    return paginated(page.items, page.meta);
  },
});

/**
 * Creates a benchmark history entry.
 *
 * Any authenticated user may register benchmark rates.
 */
export const POST = apiHandler({
  bodySchema: CREATE_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const benchmarkId = entityIdParam.parse(params.benchmarkId);
    const dto = await createBenchmarkHistory(runtime.unitOfWork, {
      actorId: actor.actorId,
      benchmarkId,
      date: body.date,
      rate: body.rate,
    });
    return created(dto);
  },
});
