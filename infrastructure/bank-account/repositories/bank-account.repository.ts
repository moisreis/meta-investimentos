import { eq, inArray } from "drizzle-orm"
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core"

import { BankAccount } from "@domain/bank-account/entities/bank-account.entity"
import type { IBankAccount } from "@domain/bank-account/interfaces/bank-account.interface"
import { EntityId } from "@/value-objects"
import { bankAccount } from "@db-schemas/bank-account.schema"
import { NotFoundError } from "@errors/not-found.error"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Implements the bank account persistence contract.
 *
 * @remarks
 * Maps `bank_account` rows to `BankAccount` entities and
 * back. Lookups rely on the primary key, the portfolio
 * index, and the bank index.
 *
 * @explanation
 * Use this repository for all bank account data access in
 * the infrastructure layer. It translates rows into domain
 * entities and persists entity changes.
 *
 * @example
 * const REPO = new BankAccountRepository(DB_CLIENT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class BankAccountRepository implements IBankAccount {
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
   * const REPO = new BankAccountRepository(DB_CLIENT);
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
   * const ENTITY = TO_ENTITY(ROW);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toEntity(row: typeof bankAccount.$inferSelect): BankAccount {
    return BankAccount.create(
      {
        portfolioId: EntityId.create(row.portfolioId),
        bankId: EntityId.create(row.bankId),
        agency: row.agency,
        accountNumber: row.accountNumber,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
      row.id
    )
  }

  /**
   * @summary
   * Maps an entity to its insert values.
   *
   * @remarks
   * Returns the columns required by the `bank_account`
   * insert statement.
   *
   * @explanation
   * Translates domain properties into the column shape
   * expected by the **Drizzle** insert call.
   *
   * @param entity - The bank account to persist.
   * @returns The insert values.
   *
   * @example
   * const VALUES = TO_INSERT(ACCOUNT);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toInsert(entity: BankAccount): typeof bankAccount.$inferInsert {
    return {
      portfolioId: entity.portfolioId,
      bankId: entity.bankId,
      agency: entity.agency,
      accountNumber: entity.accountNumber,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }

  /**
   * @summary
   * Maps an entity to its update values.
   *
   * @remarks
   * Omits `createdAt` and `updatedAt`. The column
   * `updatedAt` is refreshed by the `$onUpdate` hook.
   *
   * @explanation
   * Translates domain properties into the column shape
   * expected by the **Drizzle** update call.
   *
   * @param entity - The bank account to persist.
   * @returns The update values.
   *
   * @example
   * const VALUES = TO_UPDATE(ACCOUNT);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toUpdate(
    entity: BankAccount
  ): Partial<typeof bankAccount.$inferInsert> {
    return {
      portfolioId: entity.portfolioId,
      bankId: entity.bankId,
      agency: entity.agency,
      accountNumber: entity.accountNumber,
    }
  }

  /**
   * @summary
   * Retrieves the bank account with the provided id.
   *
   * @remarks
   * Returns null when no row matches the id.
   *
   * @explanation
   * Use this method to load a bank account by its primary
   * key. Callers must handle the null result.
   *
   * @param id - The unique identifier of the bank account.
   * @returns The entity or `null`.
   *
   * @example
   * const ACCOUNT = await BANK_ACCOUNT_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(id: EntityId): Promise<BankAccount | null> {
    const [row] = await this.db
      .select()
      .from(bankAccount)
      .where(eq(bankAccount.id, id))
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  /**
   * @summary
   * Retrieves all bank accounts for the provided portfolio.
   *
   * @remarks
   * Returns an empty array when no rows match.
   *
   * @explanation
   * Use this method to load all bank accounts that belong
   * to a given portfolio.
   *
   * @param portfolioId - The id of the portfolio.
   * @returns The matching entities.
   *
   * @example
   * const ACCOUNTS = await BANK_ACCOUNT_REPO
   *   .findAllByPortfolioId(PORTFOLIO_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByPortfolioId(portfolioId: EntityId): Promise<BankAccount[]> {
    const rows = await this.db
      .select()
      .from(bankAccount)
      .where(eq(bankAccount.portfolioId, portfolioId))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves all bank accounts for the provided portfolio ids.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns
   * an empty array when no rows match.
   *
   * @explanation
   * Use this method to hydrate bank accounts across many
   * portfolios in one query instead of one per id.
   *
   * @param portfolioIds - The ids of the portfolios.
   * @returns The matching entities.
   *
   * @example
   * const ACCOUNTS = await BANK_ACCOUNT_REPO
   *   .findAllByPortfolioIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByPortfolioIds(portfolioIds: string[]): Promise<BankAccount[]> {
    if (portfolioIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(bankAccount)
      .where(inArray(bankAccount.portfolioId, portfolioIds))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves all bank accounts for the provided bank id.
   *
   * @remarks
   * Returns an empty array when no rows match.
   *
   * @explanation
   * Use this method to load all bank accounts that belong
   * to a given bank.
   *
   * @param bankId - The id of the bank.
   * @returns The matching entities.
   *
   * @example
   * const ACCOUNTS = await BANK_ACCOUNT_REPO
   *   .findAllByBankId(BANK_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByBankId(bankId: EntityId): Promise<BankAccount[]> {
    const rows = await this.db
      .select()
      .from(bankAccount)
      .where(eq(bankAccount.bankId, bankId))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves all bank accounts for the provided bank ids.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns
   * an empty array when no rows match.
   *
   * @explanation
   * Use this method to hydrate bank accounts across many
   * banks in one query instead of one per id.
   *
   * @param bankIds - The ids of the banks.
   * @returns The matching entities.
   *
   * @example
   * const ACCOUNTS = await BANK_ACCOUNT_REPO
   *   .findAllByBankIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByBankIds(bankIds: string[]): Promise<BankAccount[]> {
    if (bankIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(bankAccount)
      .where(inArray(bankAccount.bankId, bankIds))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Persists the provided bank account.
   *
   * @remarks
   * Inserts a new row when the entity has no id. Updates
   * the existing row otherwise.
   *
   * @explanation
   * Use this method to create or update a bank account.
   * Returns the persisted entity with its id.
   *
   * @param persisted - The bank account to persist.
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await BANK_ACCOUNT_REPO
   *   .save(ACCOUNT);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(persisted: BankAccount): Promise<BankAccount> {
    if (persisted.id) {
      const [row] = await this.db
        .update(bankAccount)
        .set(this.toUpdate(persisted))
        .where(eq(bankAccount.id, persisted.id))
        .returning()

      if (!row) {
        throw new NotFoundError(
          `BankAccount with id ${persisted.id} was not found.`
        )
      }

      return this.toEntity(row)
    }

    const [row] = await this.db
      .insert(bankAccount)
      .values(this.toInsert(persisted))
      .returning()

    return this.toEntity(row)
  }

  /**
   * @summary
   * Removes the bank account with the provided id.
   *
   * @remarks
   * Resolves when the row is removed.
   *
   * @explanation
   * Use this method to delete a bank account by its
   * primary key.
   *
   * @param id - The unique identifier of the bank account.
   *
   * @example
   * await BANK_ACCOUNT_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(bankAccount).where(eq(bankAccount.id, id))
  }
}
