import { eq, inArray } from "drizzle-orm"
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core"

import { BankAccount } from "@domain/bank-account/entities/bank-account.entity"
import type { IBankAccount } from "@domain/bank-account/interfaces/bank-account.interface"
import { EntityId } from "@/value-objects"
import { toDomain, toInsert, toUpdate } from "../mappers/bank-account.mapper"
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
   *
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

    return row ? toDomain(row) : null
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
   *
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

    return rows.map((row) => toDomain(row))
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
   *
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
  async findAllByPortfolioIds(
    portfolioIds: EntityId[]
  ): Promise<BankAccount[]> {
    if (portfolioIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(bankAccount)
      .where(inArray(bankAccount.portfolioId, portfolioIds))

    return rows.map((row) => toDomain(row))
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
   *
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

    return rows.map((row) => toDomain(row))
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
   *
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
  async findAllByBankIds(bankIds: EntityId[]): Promise<BankAccount[]> {
    if (bankIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(bankAccount)
      .where(inArray(bankAccount.bankId, bankIds))

    return rows.map((row) => toDomain(row))
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
   *
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
        .set(toUpdate(persisted))
        .where(eq(bankAccount.id, persisted.id))
        .returning()

      if (!row) {
        throw new NotFoundError(
          `BankAccount with id ${persisted.id} was not found.`
        )
      }

      return toDomain(row)
    }

    const [row] = await this.db
      .insert(bankAccount)
      .values(toInsert(persisted))
      .returning()

    return toDomain(row)
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
