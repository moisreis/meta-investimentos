import { z } from "zod";

import { noContent, ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { toUserApiDto } from "@/app/api/_core/serializers/user.serializer";
import { deleteUser } from "@/business/use-cases/user/delete-user.uc";
import { getCurrentActor } from "@/business/use-cases/user/get-current-actor.uc";
import { updateUser } from "@/business/use-cases/user/update-user.uc";

/**
 * The JSON body accepted when updating the current user.
 */
const UPDATE_BODY = z.object({
  name: z.string().trim().min(1).optional(),
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
  image: z.string().url().nullable().optional(),
});

/**
 * Returns the profile of the authenticated user.
 */
export const GET = apiHandler({
  handler: async ({ actor, runtime }) => {
    const dto = await runtime.unitOfWork.run((tx) =>
      getCurrentActor(tx, { actorId: actor.actorId }),
    );
    return ok({ ...dto, id: dto.id as string });
  },
});

/**
 * Updates the profile of the authenticated user.
 */
export const PATCH = apiHandler({
  bodySchema: UPDATE_BODY,
  handler: async ({ actor, body, runtime }) => {
    const dto = await updateUser(runtime.unitOfWork, {
      actorId: actor.actorId,
      userId: actor.actorId,
      ...body,
    });
    return ok(toUserApiDto(dto));
  },
});

/**
 * Deletes the account of the authenticated user.
 */
export const DELETE = apiHandler({
  handler: async ({ actor, runtime }) => {
    await deleteUser(runtime.unitOfWork, {
      actorId: actor.actorId,
      userId: actor.actorId,
    });
    return noContent();
  },
});
