import { type PaginationMeta, paginated } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { pageBounds, snapshotPaginationMeta } from "@/app/api/_core/pagination";
import { paginationQuerySchema } from "@/app/api/_core/schemas";
import { toUserApiDto } from "@/app/api/_core/serializers/user.serializer";
import { listUsers } from "@/business/use-cases/user/list-users.uc";

/**
 * Lists users for administration.
 *
 * Only managers can list users; the use case resolves non-managers to a
 * `NotFoundError`. The listing reads are audited inside the same
 * transaction.
 */
export const GET = apiHandler({
  querySchema: paginationQuerySchema,
  handler: async ({ actor, query, runtime }) => {
    const bounds = pageBounds(query);
    const users = await listUsers(runtime.unitOfWork, {
      actorId: actor.actorId,
      limit: bounds.pageSize,
      offset: bounds.offset,
    });

    const metadata: PaginationMeta = snapshotPaginationMeta({
      ...bounds,
      returned: users.length,
    });

    return paginated(users.map(toUserApiDto), metadata);
  },
});
