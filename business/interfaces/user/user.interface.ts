import type { User } from "@/business/entities/user/user.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * Represents the repository contract for persisting and retrieving
 * `User` entities.
 *
 * An `IUser`:
 * - persists users through {@link IUser.save}.
 * - retrieves users by id, email, and cpf.
 * - removes users by id.
 *
 * Implementations are responsible for mapping database rows to
 * `User` entities and back.
 */
export interface IUser {
  /**
   * Retrieves the user with the provided id.
   *
   * @param id - The unique identifier of the user.
   * @returns A promise resolving to the `User` or `null` when
   * not found.
   */
  findById(id: EntityId): Promise<User | null>;

  /**
   * Retrieves the user with the provided email.
   *
   * @param email - The email of the user.
   * @returns A promise resolving to the `User` or `null` when
   * not found.
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Retrieves the user with the provided cpf.
   *
   * @param cpf - The cpf of the user.
   * @returns A promise resolving to the `User` or `null` when
   * not found.
   */
  findByCpf(cpf: string): Promise<User | null>;

  /**
   * Retrieves a paginated collection of users.
   *
   * @param options - The pagination bounds.
   * @returns A promise resolving to the matching `User` entities,
   * ordered by creation date ascending.
   */
  findAll(options?: { limit?: number; offset?: number }): Promise<User[]>;

  /**
   * Persists the provided user.
   *
   * When the user has no id, the implementation inserts a new
   * record and the persisted `User` (with its generated id) is
   * returned; otherwise the existing record is updated.
   *
   * @param user - The user to persist.
   * @returns A promise resolving to the persisted `User`.
   */
  save(user: User): Promise<User>;

  /**
   * Removes the user with the provided id.
   *
   * @param id - The unique identifier of the user.
   * @returns A promise that resolves when the user is removed.
   */
  delete(id: EntityId): Promise<void>;
}
