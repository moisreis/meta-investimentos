import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
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
 * @param ctx - The transaction-scoped repositories.
 * @param input - The actor and optional pagination parameters.
 * @returns The collection of {@link UserDto}.
 *
 * @throws {NotFoundError} When the actor is not a manager.
 */
export async function listUsers(
  ctx: Pick<UnitOfWorkContext, "users">,
  input: ListUsersInput,
): Promise<UserDto[]> {
  const actor = await ctx.users.findById(EntityId.create(input.actorId));

  if (actor === null) {
    throw new NotFoundError(`User with id ${input.actorId} was not found.`);
  }

  if (actor.role !== "MANAGER") {
    throw new NotFoundError(`User with id ${input.actorId} was not found.`);
  }

  const users = await ctx.users.findAll({
    limit: input.limit,
    offset: input.offset,
  });

  return users.map((user) => toUserDto(user));
}
