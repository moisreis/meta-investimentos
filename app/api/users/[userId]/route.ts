import { ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam } from "@/app/api/_core/schemas";
import { toUserApiDto } from "@/app/api/_core/serializers/user.serializer";
import { getUser } from "@/business/use-cases/user/get-user.uc";

/**
 * Retrieves a user.
 *
 * The acting user can only retrieve their own record; any other target
 * resolves to a `NotFoundError` without leaking record existence.
 */
export const GET = apiHandler({
  querySchema: undefined,
  bodySchema: undefined,
  handler: async ({ actor, params, runtime }) => {
    const userId = entityIdParam.parse(params.userId);
    const dto = await runtime.unitOfWork.run((tx) =>
      getUser(tx, { actorId: actor.actorId, userId }),
    );
    return ok(toUserApiDto(dto));
  },
});
