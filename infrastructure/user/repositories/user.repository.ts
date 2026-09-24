import { asc, eq, inArray } from "drizzle-orm"
import type {
  PgAsyncDatabase,
  PgQueryResultHKT,
} from "drizzle-orm/pg-core"

import { User } from "@domain/user/entities/user.entity"
import type { IUser } from "@domain/user/interfaces/user.interface"
import { CPF, EntityId } from "@/value-objects"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "../mappers/user.mapper"
import { user } from "@db-schemas/user.schema"
import { NotFoundError } from "@errors/not-found.error"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Implements the user persistence contract.
 *
 * @remarks
 * Maps `user` rows to `User` entities and back. Lookups
 * rely on the primary key, the email unique constraint,
 * and the cpf unique constraint.
 *
 * @explanation
 * Use this repository for all user data access in the
 * infrastructure layer. It translates rows into domain
 * entities and persists entity changes.
 *
 * @example
 * const REPO = new UserRepository(DB_CLIENT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class UserRepository implements IUser {
  private readonly db: DbClient

  /**
   * @summary
   * Binds the repository to a database client.
   *
   * @remarks
   * The client runs every query issued by the
   * repository.
   *
   * @explanation
   * Use this constructor to provide the **PostgreSQL**
   * client used by all repository operations.
   *
   * @param db - The **Drizzle** database client.
   *
   * @example
   * const REPO = new UserRepository(DB_CLIENT);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  constructor(db: DbClient) {
    this.db = db
  }

  /**
   * @summary
   * Retrieves the user with the provided id.
   *
   * @remarks
   * Returns null when no row matches the id.
   *
   * @explanation
   * Use this method to load a user by its primary key.
   * Callers must handle the null result.
   *
   * @param id - The unique identifier of the user.
   *
   * @returns The entity or `null`.
   *
   * @example
   * const USER = await USER_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(id: EntityId): Promise<User | null> {
    const [ROW] = await this.db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1)

    return ROW ? ToDomain(ROW) : null
  }

  /**
   * @summary
   * Retrieves the user with the provided email.
   *
   * @remarks
   * Returns null when no row matches the email.
   *
   * @explanation
   * Use this method to look up a user by its unique
   * email address. Callers must handle the null
   * result.
   *
   * @param email - The email address to search for.
   *
   * @returns The entity or `null`.
   *
   * @example
   * const USER = await USER_REPO.findByEmail(EMAIL);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findByEmail(email: string): Promise<User | null> {
    const [ROW] = await this.db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1)

    return ROW ? ToDomain(ROW) : null
  }

  /**
   * @summary
   * Retrieves the user with the provided cpf.
   *
   * @remarks
   * Returns null when no row matches the cpf.
   *
   * @explanation
   * Use this method to look up a user by its unique
   * cpf. Callers must handle the null result.
   *
   * @param cpf - The cpf to search for.
   *
   * @returns The entity or `null`.
   *
   * @example
   * const USER = await USER_REPO.findByCpf(CPF);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findByCpf(cpf: CPF): Promise<User | null> {
    const [ROW] = await this.db
      .select()
      .from(user)
      .where(eq(user.cpf, cpf.value))
      .limit(1)

    return ROW ? ToDomain(ROW) : null
  }

  /**
   * @summary
   * Retrieves all users with any of the provided ids.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern.
   * Returns an empty array when no ids match.
   *
   * @explanation
   * Use this method to hydrate many users in one
   * query instead of one query per id.
   *
   * @param ids - The ids of the users to retrieve.
   *
   * @returns The matching users.
   *
   * @example
   * const USERS = await USER_REPO.findAllByIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByIds(ids: EntityId[]): Promise<User[]> {
    if (ids.length === 0) {
      return []
    }

    const ROWS = await this.db
      .select()
      .from(user)
      .where(inArray(user.id, ids))

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Retrieves a paginated collection of users.
   *
   * @remarks
   * Orders by `createdAt` ascending. Defaults to a
   * limit of 100 and an offset of 0.
   *
   * @explanation
   * Use this method to list users in pages. Adjust
   * `limit` and `offset` to control pagination.
   *
   * @param options - Optional pagination parameters.
   *
   * @returns The matching users.
   *
   * @example
   * const USERS = await USER_REPO.findAll({
   *   limit: 20, offset: 0
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAll(options?: {
    limit?: number
    offset?: number
  }): Promise<User[]> {
    const ROWS = await this.db
      .select()
      .from(user)
      .orderBy(asc(user.createdAt))
      .limit(options?.limit ?? 100)
      .offset(options?.offset ?? 0)

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Persists the provided user.
   *
   * @remarks
   * Inserts a new row when the entity has no id.
   * Updates the existing row otherwise.
   *
   * @explanation
   * Use this method to create or update a user.
   * Returns the persisted entity with its id.
   *
   * @param persisted - The user to persist.
   *
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await USER_REPO.save(USER);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(persisted: User): Promise<User> {
    if (persisted.id) {
      const [ROW] = await this.db
        .update(user)
        .set(ToUpdate(persisted))
        .where(eq(user.id, persisted.id))
        .returning()

      if (!ROW) {
        throw new NotFoundError(
          `User with id ${persisted.id} was not found.`
        )
      }

      return ToDomain(ROW)
    }

    const [ROW] = await this.db
      .insert(user)
      .values(ToInsert(persisted))
      .returning()

    return ToDomain(ROW)
  }

  /**
   * @summary
   * Removes the user with the provided id.
   *
   * @remarks
   * Resolves when the row is removed.
   *
   * @explanation
   * Use this method to delete a user by its primary
   * key.
   *
   * @param id - The unique identifier of the user.
   *
   * @example
   * await USER_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(user).where(eq(user.id, id))
  }
}
