import { z } from "zod";

import { type PaginationMeta, paginated } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { pageBounds, snapshotPaginationMeta } from "@/app/api/_core/pagination";
import { paginationQuerySchema } from "@/app/api/_core/schemas";
import { toJobRunApiDto } from "@/app/api/_core/serializers/job-run.serializer";
import type { JobRunStatus } from "@/business/entities/inngest/job-run.entity";

const RECENT_QUERY = paginationQuerySchema.extend({
  status: z
    .enum(["PENDING", "RUNNING", "COMPLETED", "FAILED", "CANCELLED"])
    .optional(),
});

/**
 * Lists the most recent job-run ledger records, newest first, optionally
 * filtered by lifecycle status.
 */
export const GET = apiHandler({
  querySchema: RECENT_QUERY,
  handler: async ({ query, runtime }) => {
    const bounds = pageBounds(query);
    const status = query.status as JobRunStatus | undefined;

    const runs = await runtime.unitOfWork.run((tx) =>
      status === undefined
        ? tx.jobRuns.findRecent(bounds.pageSize)
        : tx.jobRuns.findByStatus(status, bounds.pageSize),
    );

    const metadata: PaginationMeta = snapshotPaginationMeta({
      ...bounds,
      returned: runs.length,
    });

    return paginated(runs.map(toJobRunApiDto), metadata);
  },
});
