import { eq, inArray, sql } from "drizzle-orm"
import type {
  PgAsyncDatabase,
  PgQueryResultHKT,
} from "drizzle-orm/pg-core"

import { BankAccount } from "@domain/bank-account/entities/bank-account.entity"
import type {
  BankRowCount,
  IBankAccount,
  PortfolioRowCount,
} from "@domain/bank-account/interfaces/bank-account.interface"
import { EntityId } from "@/value-objects"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "../mappers/bank-account.mapper"
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
    const [ROW] = await this.db
      .select()
      .from(bankAccount)
      .where(eq(bankAccount.id, id))
      .limit(1)

    return ROW ? ToDomain(ROW) : null
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
  async findAllByPortfolioId(
    portfolioId: EntityId
  ): Promise<BankAccount[]> {
    const ROWS = await this.db
      .select()
      .from(bankAccount)
      .where(eq(bankAccount.portfolioId, portfolioId))

    return ROWS.map((row) => ToDomain(row))
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

    const ROWS = await this.db
      .select()
      .from(bankAccount)
      .where(inArray(bankAccount.portfolioId, portfolioIds))

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Counts the bank account rows linked per provided portfolio.
   *
   * @remarks
   * Runs a grouped query so no rows are hydrated. Returns
   * an empty array when the input is empty.
   *
   * @explanation
   * Use this method to tally bank accounts across many
   * portfolios in a single aggregated query.
   *
   * @param portfolioIds - The ids of the portfolios.
   *
   * @returns The count per portfolio.
   *
   * @example
   * const COUNTS = await BANK_ACCOUNT_REPO
   *   .countByPortfolioIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async countByPortfolioIds(
    portfolioIds: EntityId[]
  ): Promise<PortfolioRowCount[]> {
    if (portfolioIds.length === 0) {
      return []
    }

    const ROWS = await this.db
      .select({
        portfolioId: bankAccount.portfolioId,
        count: sql<number>`count(*)::int`,
      })
      .from(bankAccount)
      .where(inArray(bankAccount.portfolioId, portfolioIds))
      .groupBy(bankAccount.portfolioId)
      .orderBy(bankAccount.portfolioId)

    return ROWS.map((row) => ({
      portfolioId: EntityId.create(row.portfolioId),
      count: row.count,
    }))
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
  async findAllByBankId(
    bankId: EntityId
  ): Promise<BankAccount[]> {
    const ROWS = await this.db
      .select()
      .from(bankAccount)
      .where(eq(bankAccount.bankId, bankId))

    return ROWS.map((row) => ToDomain(row))
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
  async findAllByBankIds(
    bankIds: EntityId[]
  ): Promise<BankAccount[]> {
    if (bankIds.length === 0) {
      return []
    }

    const ROWS = await this.db
      .select()
      .from(bankAccount)
      .where(inArray(bankAccount.bankId, bankIds))

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Counts the bank account rows linked per provided bank.
   *
   * @remarks
   * Runs a grouped query so no rows are hydrated. Returns
   * an empty array when the input is empty.
   *
   * @explanation
   * Use this method to tally bank accounts across many
   * banks in a single aggregated query.
   *
   * @param bankIds - The ids of the banks.
   *
   * @returns The count per bank.
   *
   * @example
   * const COUNTS = await BANK_ACCOUNT_REPO
   *   .countByBankIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async countByBankIds(
    bankIds: EntityId[]
  ): Promise<BankRowCount[]> {
    if (bankIds.length === 0) {
      return []
    }

    const ROWS = await this.db
      .select({
        bankId: bankAccount.bankId,
        count: sql<number>`count(*)::int`,
      })
      .from(bankAccount)
      .where(inArray(bankAccount.bankId, bankIds))
      .groupBy(bankAccount.bankId)
      .orderBy(bankAccount.bankId)

    return ROWS.map((row) => ({
      bankId: EntityId.create(row.bankId),
      count: row.count,
    }))
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
      const [ROW] = await this.db
        .update(bankAccount)
        .set(ToUpdate(persisted))
        .where(eq(bankAccount.id, persisted.id))
        .returning()

      if (!ROW) {
        throw new NotFoundError(
          `BankAccount with id ${persisted.id} was not found.`
        )
      }

      return ToDomain(ROW)
    }

    const [ROW] = await this.db
      .insert(bankAccount)
      .values(ToInsert(persisted))
      .returning()

    return ToDomain(ROW)
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
    await this.db
      .delete(bankAccount)
      .where(eq(bankAccount.id, id))
  }
}
