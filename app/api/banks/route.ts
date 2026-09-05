import { z } from "zod";

import {
  created,
  type PaginationMeta,
  paginated,
} from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { pageBounds, snapshotPaginationMeta } from "@/app/api/_core/pagination";
import { paginationQuerySchema } from "@/app/api/_core/schemas";
import { createBank } from "@/business/use-cases/bank/create-bank.uc";
import { listBanks } from "@/business/use-cases/bank/list-banks.uc";

/**
 * The JSON body accepted when creating a bank.
 */
const CREATE_BODY = z.object({
  code: z.string().trim().min(1).max(8),
  name: z.string().trim().min(1).max(90),
});

/**
 * Lists banks.
 *
 * Reference data is readable by any authenticated user.
 */
export const GET = apiHandler({
  querySchema: paginationQuerySchema,
  handler: async ({ query, runtime }) => {
    const bounds = pageBounds(query);
    const banks = await runtime.unitOfWork.run((tx) =>
      listBanks(tx, { limit: bounds.pageSize, offset: bounds.offset }),
    );

    const metadata: PaginationMeta = snapshotPaginationMeta({
      ...bounds,
      returned: banks.length,
    });

    return paginated(banks, metadata);
  },
});

/**
 * Creates a bank.
 *
 * Any authenticated user may register bank reference data.
 */
export const POST = apiHandler({
  bodySchema: CREATE_BODY,
  handler: async ({ actor, body, runtime }) => {
    const dto = await createBank(runtime.unitOfWork, {
      actorId: actor.actorId,
      ...body,
    });
    return created(dto);
  },
});
