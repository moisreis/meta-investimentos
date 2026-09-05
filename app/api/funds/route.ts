import { z } from "zod";

import {
  created,
  type PaginationMeta,
  paginated,
} from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { pageBounds, snapshotPaginationMeta } from "@/app/api/_core/pagination";
import {
  cnpjSchema,
  entityIdSchema,
  paginationQuerySchema,
  percentageSchema,
} from "@/app/api/_core/schemas";
import { createFund } from "@/business/use-cases/fund/create-fund.uc";
import { listFunds } from "@/business/use-cases/fund/list-funds.uc";

/**
 * The JSON body accepted when creating a fund.
 */
const CREATE_BODY = z.object({
  cnpj: cnpjSchema,
  name: z.string().trim().min(1).max(90),
  administrationFee: percentageSchema.nullable().optional(),
  performanceFee: percentageSchema.nullable().optional(),
  bankId: entityIdSchema,
  benchmarkId: entityIdSchema.nullable().optional(),
  categoryId: entityIdSchema.nullable().optional(),
});

/**
 * Lists funds.
 *
 * Reference data is readable by any authenticated user.
 */
export const GET = apiHandler({
  querySchema: paginationQuerySchema,
  handler: async ({ query, runtime }) => {
    const bounds = pageBounds(query);
    const funds = await runtime.unitOfWork.run((tx) =>
      listFunds(tx, { limit: bounds.pageSize, offset: bounds.offset }),
    );

    const metadata: PaginationMeta = snapshotPaginationMeta({
      ...bounds,
      returned: funds.length,
    });

    return paginated(funds, metadata);
  },
});

/**
 * Creates a fund.
 *
 * Any authenticated user may register fund reference data.
 */
export const POST = apiHandler({
  bodySchema: CREATE_BODY,
  handler: async ({ actor, body, runtime }) => {
    const dto = await createFund(runtime.unitOfWork, {
      actorId: actor.actorId,
      ...body,
    });
    return created(dto);
  },
});
