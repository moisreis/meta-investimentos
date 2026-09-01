import { and, eq, inArray } from "drizzle-orm";

import { Account } from "@/business/entities/user/account.entity";
import type { IAccount } from "@/business/interfaces/user/account.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { account } from "@/infrastructure/database/schemas";

import type { DbClient } from "../types";

/**
 * PostgreSQL-backed implementation of the {@link IAccount} contract.
 *
 * Maps `account` rows to `Account` entities and back. Lookups rely on
 * the issuer/account id unique index (`findByIssuerAndAccountId`) and
 * the user id index (`findAllByUserId`).
 *
 * A save inserts a new row when the entity has no id and updates the
 * existing row otherwise. Updates omit `updatedAt` so the `$onUpdate`
 * hook keeps the timestamp in sync with the mutation.
 */
export class AccountRepository implements IAccount {
  // --------------------------------------
  // FIELDS
  // --------------------------------------

  private readonly db: DbClient;

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates an `AccountRepository` bound to the provided database
   * client.
   *
   * @param db - The database client to run queries against.
   */
  constructor(db: DbClient) {
    this.db = db;
  }

  // --------------------------------------
  // MAPPING METHODS
  // --------------------------------------

  /**
   * Maps the provided `account` row to an {@link Account} entity.
   *
   * @param row - The database row.
   * @returns The hydrated `Account` entity.
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
      row.id,
    );
  }

  /**
   * Maps the provided entity to the insert values of the `account`
   * table.
   *
   * @param entity - The account to persist.
   * @returns The insert values.
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
    };
  }

  /**
   * Maps the provided entity to the mutable update values of the
   * `account` table.
   *
   * `createdAt` and `updatedAt` are left out: `createdAt` never
   * changes and `updatedAt` is refreshed by the `$onUpdate` hook.
   *
   * @param entity - The account to persist.
   * @returns The update values.
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
    };
  }

  // --------------------------------------
  // QUERY METHODS
  // --------------------------------------

  /**
   * Retrieves the account with the provided id.
   *
   * @see {@link IAccount.findById}
   */
  async findById(id: string): Promise<Account | null> {
    const [row] = await this.db
      .select()
      .from(account)
      .where(eq(account.id, id))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves the account linked to the provided issuer and account
   * id.
   *
   * @see {@link IAccount.findByIssuerAndAccountId}
   */
  async findByIssuerAndAccountId(
    issuer: string,
    accountId: string,
  ): Promise<Account | null> {
    const [row] = await this.db
      .select()
      .from(account)
      .where(and(eq(account.issuer, issuer), eq(account.accountId, accountId)))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all accounts belonging to the provided user id.
   *
   * @see {@link IAccount.findAllByUserId}
   */
  async findAllByUserId(userId: string): Promise<Account[]> {
    const rows = await this.db
      .select()
      .from(account)
      .where(eq(account.userId, userId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all accounts belonging to any of the provided user ids.
   *
   * Batched lookup for hydrating accounts across many users without
   * falling into an N+1 query pattern.
   *
   * @param userIds - The ids of the users to retrieve accounts for.
   * @returns A promise resolving to the matching `Account` entities.
   */
  async findAllByUserIds(userIds: string[]): Promise<Account[]> {
    if (userIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(account)
      .where(inArray(account.userId, userIds));

    return rows.map((row) => this.toEntity(row));
  }

  // --------------------------------------
  // COMMAND METHODS
  // --------------------------------------

  /**
   * Persists the provided account.
   *
   * @see {@link IAccount.save}
   */
  async save(persisted: Account): Promise<Account> {
    if (persisted.id) {
      const [row] = await this.db
        .update(account)
        .set(this.toUpdate(persisted))
        .where(eq(account.id, persisted.id))
        .returning();

      if (!row) {
        throw new Error(`Account with id ${persisted.id} was not found.`);
      }

      return this.toEntity(row);
    }

    const [row] = await this.db
      .insert(account)
      .values(this.toInsert(persisted))
      .returning();

    return this.toEntity(row);
  }

  /**
   * Removes the account with the provided id.
   *
   * @see {@link IAccount.delete}
   */
  async delete(id: string): Promise<void> {
    await this.db.delete(account).where(eq(account.id, id));
  }
}
