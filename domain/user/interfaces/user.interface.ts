import type { User } from "@domain/user/entities/user.entity"
import type { CPF, EntityId } from "@/value-objects"

/**
 * @summary
 * Defines the repository contract for `User` entities.
 *
 * @remarks
 * An `IUser` persists, retrieves, and removes users.
 * Supports lookup by id, email, and **CPF**.
 *
 * @explanation
 * Use this interface to implement data access for users.
 * Persistence implementations map rows to `User` entities.
 *
 * @example
 * const USER = await USER_REPO.findById(ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export interface IUser {
  /**
   * @summary
   * Retrieves the user with the provided id.
   *
   * @remarks
   * Returns null when no user matches.
   *
   * @explanation
   * Use this method to look up a single user by its
   * unique identifier. Callers check null for existence.
   *
   * @param id - The unique identifier of the user.
   *
   * @returns The entry or `null`.
   *
   * @example
   * const USER = await USER_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findById(id: EntityId): Promise<User | null>

  /**
   * @summary
   * Retrieves all users with the provided ids.
   *
   * @remarks
   * Returns an empty array when no users match.
   *
   * @explanation
   * Use this method to list users linked to several
   * ids. Returns an empty array for no matches.
   *
   * @param ids - The unique identifiers of the users.
   *
   * @returns The matching entries.
   *
   * @example
   * const USERS = await USER_REPO.findAllByIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  findAllByIds(ids: EntityId[]): Promise<User[]>

  /**
   * @summary
   * Retrieves the user with the provided email.
   *
   * @remarks
   * Returns null when no user matches.
   *
   * @explanation
   * Use this method to look up a user by email address.
   * Callers check null for existence.
   *
   * @param email - The email of the user.
   *
   * @returns The entry or `null`.
   *
   * @example
   * const USER = await USER_REPO.findByEmail(EMAIL);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findByEmail(email: string): Promise<User | null>

  /**
   * @summary
   * Retrieves the user with the provided **CPF**.
   *
   * @remarks
   * Returns null when no user matches.
   *
   * @explanation
   * Use this method to look up a user by **CPF** number.
   * Callers check null for existence.
   *
   * @param cpf - The **CPF** value object of the user.
   *
   * @returns The entry or `null`.
   *
   * @example
   * const USER = await USER_REPO.findByCpf(CPF);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findByCpf(cpf: CPF): Promise<User | null>

  /**
   * @summary
   * Retrieves all users, optionally paginated.
   *
   * @remarks
   * Use limit and offset to paginate results.
   *
   * @explanation
   * Use this method to list all users. Pass options
   * to paginate when the dataset is large.
   *
   * @param options - The pagination options.
   * @param options.limit - Maximum users to return.
   * @param options.offset - Starting offset.
   *
   * @returns The matching entries.
   *
   * @example
   * const USERS = await USER_REPO.findAll();
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAll(options?: {
    limit?: number
    offset?: number
  }): Promise<User[]>

  /**
   * @summary
   * Persists the provided user.
   *
   * @remarks
   * Inserts a new record when the user has no id;
   * otherwise updates the existing record.
   *
   * @explanation
   * Use this method to create or update a user record.
   * The persisted entity with its id is returned.
   *
   * @param user - The user to persist.
   *
   * @returns The persisted entry.
   *
   * @example
   * const USER = await USER_REPO.save(NEW_USER);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(user: User): Promise<User>

  /**
   * @summary
   * Removes the user with the provided id.
   *
   * @remarks
   * Resolves when the user is removed.
   *
   * @explanation
   * Use this method to delete a user record.
   * The promise resolves once the operation completes.
   *
   * @param id - The unique identifier of the user.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await USER_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  delete(id: EntityId): Promise<void>
}
