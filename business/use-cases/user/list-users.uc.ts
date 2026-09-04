import { AuditLog } from "@/business/entities/audit/audit-log.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { UserDto } from "./user.dtos";
import { toUserDto } from "./user.mapper";

/**
 * Input for {@link listUsers}.
 */
export interface ListUsersInput {
  /**
   * The id of the acting user performing the administration lookup.
   */
  actorId: string;

  /**
   * The maximum number of users to return.
   */
  limit?: number;

  /**
   * The offset from which to start returning users.
   */
  offset?: number;
}

/**
 * Lists users for administration.
 *
 * Only users with the `MANAGER` role may list users. The lookup reads
 * through the transaction-scoped user repository.
 *
 * Because listing exposes other users' personal information, the read
 * is audited: every listed user's record produces a `READ` audit entry
 * attributed to the acting manager, written atomically with the read
 * inside one `UnitOfWork` transaction.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The actor and optional pagination parameters.
 * @returns The collection of {@link UserDto}.
 *
 * @throws {NotFoundError} When the actor is not a manager.
 */
export async function listUsers(
  unitOfWork: UnitOfWork,
  input: ListUsersInput,
): Promise<UserDto[]> {
  const ACTOR_ID = EntityId.create(input.actorId);

  return unitOfWork.run(
    async (tx) => {
      const actor = await tx.users.findById(ACTOR_ID);

      if (actor === null) {
        throw new NotFoundError(`User with id ${input.actorId} was not found.`);
      }

      if (actor.role !== "MANAGER") {
        throw new NotFoundError(`User with id ${input.actorId} was not found.`);
      }

      const users = await tx.users.findAll({
        limit: input.limit,
        offset: input.offset,
      });

      for (const user of users) {
        if (user.id !== undefined) {
          await tx.auditLogs.save(
            AuditLog.create({
              entity: "User",
              entityId: user.id,
              action: "READ",
              userId: ACTOR_ID,
            }),
          );
        }
      }

      return users.map((user) => toUserDto(user));
    },
    { userId: ACTOR_ID },
  );
}
