import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { UserDto } from "./user.dtos";
import { toUserDto } from "./user.mapper";

/**
 * Input for {@link getUser}.
 */
export interface GetUserInput {
  /**
   * The id of the acting user required to authorize the lookup.
   */
  actorId: string;

  /**
   * The id of the user to retrieve.
   */
  userId: string;
}

/**
 * Retrieves a user.
 *
 * A user may only retrieve their own record. Attempting to retrieve
 * another user's record resolves to a `NotFoundError` so that the
 * existence of other records is not leaked.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The actor and the user id to retrieve.
 * @returns The {@link UserDto} of the requested user.
 *
 * @throws {NotFoundError} When the requested user does not exist or
 *   the actor is not authorized to view it.
 */
export async function getUser(
  ctx: Pick<UnitOfWorkContext, "users">,
  input: GetUserInput,
): Promise<UserDto> {
  if (input.actorId !== input.userId) {
    throw new NotFoundError(`User with id ${input.userId} was not found.`);
  }

  const user = await ctx.users.findById(EntityId.create(input.userId));

  if (user === null) {
    throw new NotFoundError(`User with id ${input.userId} was not found.`);
  }

  return toUserDto(user);
}
