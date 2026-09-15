import { and, eq, inArray } from "drizzle-orm"
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core"

import { Account } from "@domain/account/entities/account.entity"
import type { IAccount } from "@domain/account/interfaces/account.interface"
import { EntityId } from "@/value-objects"
import { account } from "@db-schemas/account.schema"
import { NotFoundError } from "@errors/not-found.error"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Implements the account persistence contract.
 *
 * @remarks
 * Maps `account` rows to `Account` entities and back.
 * Lookups rely on the primary key, the issuer/account id
 * unique index, and the user id index.
 *
 * @explanation
 * Use this repository for all account data access in the
 * infrastructure layer. It translates rows into domain
 * entities and persists entity changes.
 *
 * @example
 * const REPO = new AccountRepository(DB_CLIENT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class AccountRepository implements IAccount {
  private readonly db: DbClient

  /**
   * @summary
   * Binds the repository to a database client.
   *
   * @remarks
   * The client runs every query issued by the repository.
   *
   * @explanation
   * Use this constructor to provide the **PostgreSQL**
   * client used by all repository operations.
   *
   * @param db - The **Drizzle** database client.
   *
   * @example
   * const REPO = new AccountRepository(DB_CLIENT);
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
   * Maps a database row to a domain entity.
   *
   * @remarks
   * Hydrates value objects through their `create` method.
   *
   * @explanation
   * Converts persisted columns into the domain shape so
   * services work with entities, not raw rows.
   *
   * @param row - The row returned by the query.
   * @returns The hydrated entity.
   *
   * @example
   * const ENTITY = toEntity(ROW);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toEntity(row: typeof account.$inferSelect): Account {
    return Account.create(
      {
        issuer: row.issuer,
        providerId: row.providerId,
        accountId: row.accountId,
        userId: EntityId.create(row.userId),
        accessToken: row.accessToken,
        refreshToken: row.refreshToken,
        idToken: row.idToken,
        accessTokenExpiresAt: row.accessTokenExpiresAt,
        refreshTokenExpiresAt: row.refreshTokenExpiresAt,
        scope: row.scope,
        password: row.password,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
      row.id
    )
  }

  /**
   * @summary
   * Maps a domain entity to insert values.
   *
   * @remarks
   * Maps entity fields to their database column names.
   *
   * @explanation
   * Converts an entity into the shape expected by
   * **Drizzle** insert operations.
   *
   * @param entity - The entity to serialize.
   * @returns The insert values.
   *
   * @example
   * const VALUES = toInsert(ENTITY);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toInsert(entity: Account): typeof account.$inferInsert {
    return {
      issuer: entity.issuer,
      providerId: entity.providerId,
      accountId: entity.accountId,
      userId: entity.userId,
      accessToken: entity.accessToken,
      refreshToken: entity.refreshToken,
      idToken: entity.idToken,
      accessTokenExpiresAt: entity.accessTokenExpiresAt,
      refreshTokenExpiresAt: entity.refreshTokenExpiresAt,
      scope: entity.scope,
      password: entity.password,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }

  /**
   * @summary
   * Maps a domain entity to update values.
   *
   * @remarks
   * Omits `createdAt` and `updatedAt`. The first never
   * changes; the second refreshes via `$onUpdate`.
   *
   * @explanation
   * Converts an entity into the shape expected by
   * **Drizzle** update operations.
   *
   * @param entity - The entity to serialize.
   * @returns The update values.
   *
   * @example
   * const VALUES = toUpdate(ENTITY);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toUpdate(entity: Account): Partial<typeof account.$inferInsert> {
    return {
      issuer: entity.issuer,
      providerId: entity.providerId,
      accountId: entity.accountId,
      userId: entity.userId,
      accessToken: entity.accessToken,
      refreshToken: entity.refreshToken,
      idToken: entity.idToken,
      accessTokenExpiresAt: entity.accessTokenExpiresAt,
      refreshTokenExpiresAt: entity.refreshTokenExpiresAt,
      scope: entity.scope,
      password: entity.password,
    }
  }

  /**
   * @summary
   * Retrieves the account with the provided id.
   *
   * @remarks
   * Returns `null` when no row matches the id.
   *
   * @explanation
   * Use this method to load an account by its primary key.
   * Callers must handle the null result.
   *
   * @param id - The unique identifier of the account.
   * @returns The entity or `null`.
   *
   * @example
   * const ACCOUNT = await ACCOUNT_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(id: EntityId): Promise<Account | null> {
    const [row] = await this.db
      .select()
      .from(account)
      .where(eq(account.id, id))
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  /**
   * @summary
   * Retrieves the account linked to an issuer and account id.
   *
   * @remarks
   * Returns `null` when no row matches the pair.
   *
   * @explanation
   * Use this method to load an account by its unique
   * issuer/account id pair. Callers must handle the
   * null result.
   *
   * @param issuer - The issuer of the account.
   * @param accountId - The external account identifier.
   * @returns The entity or `null`.
   *
   * @example
   * const ACCOUNT = await ACCOUNT_REPO
   *   .findByIssuerAndAccountId(ISSUER, ACCOUNT_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findByIssuerAndAccountId(
    issuer: string,
    accountId: string
  ): Promise<Account | null> {
    const [row] = await this.db
      .select()
      .from(account)
      .where(and(eq(account.issuer, issuer), eq(account.accountId, accountId)))
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  /**
   * @summary
   * Retrieves all accounts belonging to a user id.
   *
   * @remarks
   * Returns an empty array when no accounts exist for the
   * user.
   *
   * @explanation
   * Use this method to load all accounts of a single user.
   *
   * @param userId - The id of the user.
   * @returns The matching accounts.
   *
   * @example
   * const ACCOUNTS = await ACCOUNT_REPO
   *   .findAllByUserId(USER_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByUserId(userId: EntityId): Promise<Account[]> {
    const rows = await this.db
      .select()
      .from(account)
      .where(eq(account.userId, userId))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves all accounts with any of the provided user ids.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns
   * an empty array when no ids match.
   *
   * @explanation
   * Use this method to hydrate accounts across many users
   * in one query instead of one query per user.
   *
   * @param userIds - The ids of the users.
   * @returns The matching accounts.
   *
   * @example
   * const ACCOUNTS = await ACCOUNT_REPO
   *   .findAllByUserIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByUserIds(userIds: string[]): Promise<Account[]> {
    if (userIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(account)
      .where(inArray(account.userId, userIds))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Persists the provided account.
   *
   * @remarks
   * Inserts a new row when the entity has no id. Updates
   * the existing row otherwise.
   *
   * @explanation
   * Use this method to create or update an account. Returns
   * the persisted entity with its id.
   *
   * @param persisted - The account to persist.
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await ACCOUNT_REPO.save(ACCOUNT);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(persisted: Account): Promise<Account> {
    if (persisted.id) {
      const [row] = await this.db
        .update(account)
        .set(this.toUpdate(persisted))
        .where(eq(account.id, persisted.id))
        .returning()

      if (!row) {
        throw new NotFoundError(
          `Account with id ${persisted.id} was not found.`
        )
      }

      return this.toEntity(row)
    }

    const [row] = await this.db
      .insert(account)
      .values(this.toInsert(persisted))
      .returning()

    return this.toEntity(row)
  }

  /**
   * @summary
   * Removes the account with the provided id.
   *
   * @remarks
   * Resolves when the row is removed.
   *
   * @explanation
   * Use this method to delete an account by its primary key.
   *
   * @param id - The unique identifier of the account.
   *
   * @example
   * await ACCOUNT_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(account).where(eq(account.id, id))
  }
}
