import { z } from "zod";

import { created, paginated } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { slicePage } from "@/app/api/_core/pagination";
import {
  dateStringSchema,
  entityIdParam,
  paginationQuerySchema,
  positiveMoneySchema,
} from "@/app/api/_core/schemas";
import { createWithdrawal } from "@/business/use-cases/withdrawal/create-withdrawal.uc";
import { listPositionWithdrawals } from "@/business/use-cases/withdrawal/list-position-withdrawals.uc";

/**
 * The JSON body accepted when creating a withdrawal.
 */
const CREATE_BODY = z.object({
  date: dateStringSchema,
  amount: positiveMoneySchema,
});

/**
 * Lists all withdrawals of a position the authenticated user can
 * access.
 */
export const GET = apiHandler({
  querySchema: paginationQuerySchema,
  handler: async ({ actor, params, query, runtime }) => {
    const positionId = entityIdParam.parse(params.positionId);
    const withdrawals = await runtime.unitOfWork.run((tx) =>
      listPositionWithdrawals(tx, { actorId: actor.actorId, positionId }),
    );
    const page = slicePage(withdrawals, query);
    return paginated(page.items, page.meta);
  },
});

/**
 * Creates a withdrawal against a position.
 *
 * Only the portfolio owner or an editor may withdraw funds. The fund
 * must have a quota price on the withdrawal date and the position must
 * hold enough poolable quotas.
 */
export const POST = apiHandler({
  bodySchema: CREATE_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const positionId = entityIdParam.parse(params.positionId);
    const dto = await createWithdrawal(runtime.unitOfWork, {
      actorId: actor.actorId,
      positionId,
      date: body.date,
      amount: body.amount,
    });
    return created(dto);
  },
});
