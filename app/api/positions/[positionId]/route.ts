import { z } from "zod";

import { noContent, ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import {
  dateStringSchema,
  entityIdParam,
  positiveMoneySchema,
} from "@/app/api/_core/schemas";
import { deletePosition } from "@/business/use-cases/position/delete-position.uc";
import { getPosition } from "@/business/use-cases/position/get-position.uc";
import { updatePosition } from "@/business/use-cases/position/update-position.uc";

/**
 * The JSON body accepted when setting the initial balance of a
 * position.
 */
const UPDATE_BODY = z.object({
  initialBalance: positiveMoneySchema,
  initialBalanceDate: dateStringSchema,
});

/**
 * Retrieves a position the authenticated user can access.
 */
export const GET = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const positionId = entityIdParam.parse(params.positionId);
    const dto = await runtime.unitOfWork.run((tx) =>
      getPosition(tx, { actorId: actor.actorId, positionId }),
    );
    return ok(dto);
  },
});

/**
 * Sets the initial balance of a position.
 *
 * Only the portfolio owner or an editor may set an initial balance.
 */
export const PATCH = apiHandler({
  bodySchema: UPDATE_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const positionId = entityIdParam.parse(params.positionId);
    const dto = await updatePosition(runtime.unitOfWork, {
      actorId: actor.actorId,
      positionId,
      initialBalance: body.initialBalance,
      initialBalanceDate: body.initialBalanceDate,
    });
    return ok(dto);
  },
});

/**
 * Deletes a position.
 *
 * Only the portfolio owner or an editor may delete a position, and it
 * must not have any applications or withdrawals.
 */
export const DELETE = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const positionId = entityIdParam.parse(params.positionId);
    await deletePosition(runtime.unitOfWork, {
      actorId: actor.actorId,
      positionId,
    });
    return noContent();
  },
});
