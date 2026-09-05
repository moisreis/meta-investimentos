import { z } from "zod";

import { noContent, ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam, moneySchema } from "@/app/api/_core/schemas";
import { deleteCheckingAccount } from "@/business/use-cases/bank/delete-checking-account.uc";
import { getCheckingAccount } from "@/business/use-cases/bank/get-checking-account.uc";
import { updateCheckingAccount } from "@/business/use-cases/bank/update-checking-account.uc";

/**
 * The JSON body accepted when updating a checking account transaction.
 */
const UPDATE_BODY = z.object({
  value: moneySchema,
});

/**
 * Retrieves a single checking account transaction.
 */
export const GET = apiHandler({
  handler: async ({ params, runtime }) => {
    const checkingAccountId = entityIdParam.parse(params.checkingAccountId);
    const dto = await runtime.unitOfWork.run((tx) =>
      getCheckingAccount(tx, { checkingAccountId }),
    );
    return ok(dto);
  },
});

/**
 * Updates a checking account transaction.
 *
 * Only the portfolio owner or an editor may update transactions.
 */
export const PATCH = apiHandler({
  bodySchema: UPDATE_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const checkingAccountId = entityIdParam.parse(params.checkingAccountId);
    const dto = await updateCheckingAccount(runtime.unitOfWork, {
      actorId: actor.actorId,
      checkingAccountId,
      value: body.value,
    });
    return ok(dto);
  },
});

/**
 * Deletes a checking account transaction.
 *
 * Only the portfolio owner or an editor may delete transactions.
 */
export const DELETE = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const checkingAccountId = entityIdParam.parse(params.checkingAccountId);
    await deleteCheckingAccount(runtime.unitOfWork, {
      actorId: actor.actorId,
      checkingAccountId,
    });
    return noContent();
  },
});
