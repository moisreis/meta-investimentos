import type { User } from "@/business/entities/user/user.entity";
import { NotFoundError } from "@/shared/errors";

/**
 * The repository surface required to authorize a manager mutation.
 */
export interface ManagerAuthorizationRepositories {
  users: {
    findById(id: string): Promise<User | null>;
  };
}

/**
 * Requires the acting user to hold the `MANAGER` role.
 *
 * Reference and administration mutations are restricted to managers.
 * When the actor does not exist or is not a manager, a `NotFoundError`
 * is thrown so the actor's existence or role is not leaked to callers.
 *
 * @param repos - The repositories used to load the actor.
 * @param actorId - The id of the acting user.
 * @returns The acting user when they hold the `MANAGER` role.
 *
 * @throws {NotFoundError} When the actor does not exist or is not a
 * manager.
 */
export async function requireManager(
  repos: ManagerAuthorizationRepositories,
  actorId: string,
): Promise<User> {
  const actor = await repos.users.findById(actorId);

  if (actor === null) {
    throw new NotFoundError(`User with id ${actorId} was not found.`);
  }

  if (actor.role !== "MANAGER") {
    throw new NotFoundError(`User with id ${actorId} was not found.`);
  }

  return actor;
}
