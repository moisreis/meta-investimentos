import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { UserDto } from "./user.dtos";
import { toUserDto } from "./user.mapper";

/**
 * Input for {@link updateUser}.
 */
export interface UpdateUserInput {
  /**
   * The id of the acting user required to authorize the update.
   */
  actorId: string;

  /**
   * The id of the user to update.
   */
  userId: string;

  /**
   * The updated full name.
   */
  name?: string;

  /**
   * The updated first name.
   */
  firstName?: string;

  /**
   * The updated last name.
   */
  lastName?: string;

  /**
   * The updated profile image url.
   */
  image?: string | null;
}

/**
 * Updates a user's profile fields.
 *
 * A user may only update their own profile. The update is performed
 * inside one `UnitOfWork` transaction so the profile change and its
 * audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The actor, target user, and fields to update.
 * @returns The updated {@link UserDto}.
 *
 * @throws {NotFoundError} When the target user does not exist or the
 *   actor is not authorized to update it.
 */
export async function updateUser(
  unitOfWork: UnitOfWork,
  input: UpdateUserInput,
): Promise<UserDto> {
  if (input.actorId !== input.userId) {
    throw new NotFoundError(`User with id ${input.userId} was not found.`);
  }

  return unitOfWork.run(
    async (tx) => {
      const existing = await tx.users.findById(EntityId.create(input.userId));

      if (existing === null) {
        throw new NotFoundError(`User with id ${input.userId} was not found.`);
      }

      const updated = existing.updateProfile({
        name: input.name,
        firstName: input.firstName,
        lastName: input.lastName,
        image: input.image,
      });

      const saved = await tx.users.save(updated);

      return toUserDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
