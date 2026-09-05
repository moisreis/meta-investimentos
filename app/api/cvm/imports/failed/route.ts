import { z } from "zod";

import { ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { toCvmImportApiDto } from "@/app/api/_core/serializers/cvm-import.serializer";
import { getFailedImports } from "@/business/use-cases/cvm/get-import-status.uc";

/**
 * The query parameters accepted by the failed-imports endpoint.
 */
const FAILED_QUERY = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

/**
 * Lists the most recent failed CVM import summaries.
 */
export const GET = apiHandler({
  querySchema: FAILED_QUERY,
  handler: async ({ query, runtime }) => {
    const entries = await runtime.unitOfWork.run((tx) =>
      getFailedImports(tx.cvmImports, query.limit),
    );
    return ok(entries.map(toCvmImportApiDto));
  },
});
