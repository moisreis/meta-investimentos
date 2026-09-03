import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { CurrentActorDto } from "./user.dtos";
import { toCurrentActorDto } from "./user.mapper";

/**
 * Input for {@link getCurrentActor}.
 */
export interface GetCurrentActorInput {
  /**
   * The id of the currently authenticated actor.
   */
  actorId: string;
}

/**
 * Retrieves the currently authenticated actor.
 *
 * A read-only use case that resolves the acting user by id. It does
 * not open a transaction because a single read does not need atomic
 * coordination.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The actor id of the current user.
 * @returns The {@link CurrentActorDto} of the acting user.
 *
 * @throws {NotFoundError} When the actor does not exist.
 */
export async function getCurrentActor(
  ctx: Pick<UnitOfWorkContext, "users">,
  input: GetCurrentActorInput,
): Promise<CurrentActorDto> {
  const user = await ctx.users.findById(EntityId.create(input.actorId));

  if (user === null) {
    throw new NotFoundError(`User with id ${input.actorId} was not found.`);
  }

  return toCurrentActorDto(user);
}
