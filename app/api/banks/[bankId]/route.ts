import { z } from "zod";

import { noContent, ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam } from "@/app/api/_core/schemas";
import { deleteBank } from "@/business/use-cases/bank/delete-bank.uc";
import { getBank } from "@/business/use-cases/bank/get-bank.uc";
import { updateBank } from "@/business/use-cases/bank/update-bank.uc";

/**
 * The JSON body accepted when updating a bank.
 */
const UPDATE_BODY = z
  .object({
    code: z.string().trim().min(1).max(8).optional(),
    name: z.string().trim().min(1).max(90).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided.",
  });

/**
 * Retrieves a single bank.
 */
export const GET = apiHandler({
  handler: async ({ params, runtime }) => {
    const bankId = entityIdParam.parse(params.bankId);
    const dto = await runtime.unitOfWork.run((tx) => getBank(tx, { bankId }));
    return ok(dto);
  },
});

/**
 * Updates a bank.
 *
 * Reference and administration mutations are restricted to managers.
 */
export const PATCH = apiHandler({
  bodySchema: UPDATE_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const bankId = entityIdParam.parse(params.bankId);
    const dto = await updateBank(runtime.unitOfWork, {
      actorId: actor.actorId,
      bankId,
      ...body,
    });
    return ok(dto);
  },
});

/**
 * Deletes a bank.
 *
 * Reference and administration mutations are restricted to managers.
 */
export const DELETE = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const bankId = entityIdParam.parse(params.bankId);
    await deleteBank(runtime.unitOfWork, {
      actorId: actor.actorId,
      bankId,
    });
    return noContent();
  },
});
