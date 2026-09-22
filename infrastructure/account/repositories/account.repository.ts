import { and, eq, inArray } from "drizzle-orm"
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core"

import { Account } from "@domain/account/entities/account.entity"
import type { IAccount } from "@domain/account/interfaces/account.interface"
import { EntityId } from "@/value-objects"
import { toDomain, toInsert, toUpdate } from "../mappers/account.mapper"
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
   *
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

    return row ? toDomain(row) : null
  }

  /**
   * @summary
   * Retrieves the account linked to a provider and account id.
   *
   * @remarks
   * Returns `null` when no row matches the pair.
   *
   * @explanation
   * Use this method to load an account by its unique
   * provider/account id pair. Callers must handle the
   * null result.
   *
   * @param providerId - The provider of the account.
   * @param accountId - The external account identifier.
   *
   * @returns The entity or `null`.
   *
   * @example
   * const ACCOUNT = await ACCOUNT_REPO
   *   .findByProviderAndAccountId(PROVIDER_ID, ACCOUNT_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-17
   */
  async findByProviderAndAccountId(
    providerId: string,
    accountId: string
  ): Promise<Account | null> {
    const [row] = await this.db
      .select()
      .from(account)
      .where(
        and(
          eq(account.providerId, providerId),
          eq(account.accountId, accountId)
        )
      )
      .limit(1)

    return row ? toDomain(row) : null
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
   *
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

    return rows.map((row) => toDomain(row))
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
   *
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
  async findAllByUserIds(userIds: EntityId[]): Promise<Account[]> {
    if (userIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(account)
      .where(inArray(account.userId, userIds))

    return rows.map((row) => toDomain(row))
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
   *
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
        .set(toUpdate(persisted))
        .where(eq(account.id, persisted.id))
        .returning()

      if (!row) {
        throw new NotFoundError(
          `Account with id ${persisted.id} was not found.`
        )
      }

      return toDomain(row)
    }

    const [row] = await this.db
      .insert(account)
      .values(toInsert(persisted))
      .returning()

    return toDomain(row)
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
