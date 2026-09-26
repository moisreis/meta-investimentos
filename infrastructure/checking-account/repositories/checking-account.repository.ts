import {
  and,
  asc,
  desc,
  eq,
  gte,
  inArray,
  lte,
} from "drizzle-orm"
import type {
  PgAsyncDatabase,
  PgQueryResultHKT,
} from "drizzle-orm/pg-core"

import { CheckingAccount } from "@domain/checking-account/entities/checking-account.entity"
import type { ICheckingAccount } from "@domain/checking-account/interfaces/checking-account.interface"
import { EntityId, SignedMoney } from "@/value-objects"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "../mappers/checking-account.mapper"
import { checkingAccount } from "@db-schemas/checking-account.schema"
import { NotFoundError } from "@errors/not-found.error"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Implements the checking account persistence contract.
 *
 * @remarks
 * Maps `checking_account` rows to `CheckingAccount`
 * entities and back. Lookups rely on the primary key and
 * the `(bank_account_id, date)` unique pair.
 *
 * @explanation
 * Use this repository for all checking account data access
 * in the infrastructure layer. It translates rows into
 * domain entities and persists entity changes.
 *
 * @example
 * const REPO = new CheckingAccountRepository(DB_CLIENT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class CheckingAccountRepository implements ICheckingAccount {
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
   * const REPO = new CheckingAccountRepository(DB_CLIENT);
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
   * Retrieves the checking account balance with the provided id.
   *
   * @remarks
   * Returns `null` when no row matches the id.
   *
   * @explanation
   * Use this method to load a checking account balance by its
   * primary key. Callers must handle the null result.
   *
   * @param id - The unique identifier of the balance.
   *
   * @returns The entity or `null`.
   *
   * @example
   * const BALANCE = await CHECKING_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(id: EntityId): Promise<CheckingAccount | null> {
    const [ROW] = await this.db
      .select()
      .from(checkingAccount)
      .where(eq(checkingAccount.id, id))
      .limit(1)

    return ROW ? ToDomain(ROW) : null
  }

  /**
   * @summary
   * Retrieves all checking account balances.
   *
   * @remarks
   * Supports optional pagination through limit and
   * offset. Ordered by date descending, newest first.
   *
   * @explanation
   * Use this method to list every checking account
   * balance row through the repository.
   *
   * @param options - Optional pagination parameters.
   *
   * @returns The matching entities.
   *
   * @example
   * const BALANCES = await CHECKING_REPO.findAll();
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async findAll(options?: {
    limit?: number
    offset?: number
  }): Promise<CheckingAccount[]> {
    const QUERY = this.db
      .select()
      .from(checkingAccount)
      .orderBy(desc(checkingAccount.date))

    // Returns every row unless the caller asks for a
    // window. A paginated caller must always set limit,
    // because offset is only valid alongside it.
    const ROWS =
      options?.limit === undefined
        ? await QUERY
        : await QUERY.limit(options.limit).offset(
            options.offset ?? 0
          )

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Retrieves all balances of a bank account.
   *
   * @remarks
   * Returns an empty array when no balances exist for the
   * bank account.
   *
   * @explanation
   * Use this method to load the full balance series of a
   * single bank account.
   *
   * @param bankAccountId - The id of the bank account.
   *
   * @returns The matching balances.
   *
   * @example
   * const BALANCES = await CHECKING_REPO
   *   .findAllByBankAccountId(BANK_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByBankAccountId(
    bankAccountId: EntityId
  ): Promise<CheckingAccount[]> {
    const ROWS = await this.db
      .select()
      .from(checkingAccount)
      .where(eq(checkingAccount.bankAccountId, bankAccountId))

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Retrieves all balances with any of the provided bank
   * account ids.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns
   * an empty array when no ids match.
   *
   * @explanation
   * Use this method to hydrate the balance series of many
   * bank accounts in one query instead of one per account.
   *
   * @param bankAccountIds - The ids of the bank accounts.
   *
   * @returns The matching balances.
   *
   * @example
   * const BALANCES = await CHECKING_REPO
   *   .findAllByBankAccountIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByBankAccountIds(
    bankAccountIds: EntityId[]
  ): Promise<CheckingAccount[]> {
    if (bankAccountIds.length === 0) {
      return []
    }

    const ROWS = await this.db
      .select()
      .from(checkingAccount)
      .where(
        inArray(checkingAccount.bankAccountId, bankAccountIds)
      )

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Retrieves balances of multiple bank accounts in a period.
   *
   * @remarks
   * The period is inclusive of both dates. Batched lookup
   * avoids an N+1 query pattern. Returns an empty array
   * when no ids match. Rows are ordered oldest-first by date.
   *
   * @explanation
   * Use this method to hydrate the balance series of many
   * bank accounts inside a date range for processing or
   * reporting.
   *
   * @param bankAccountIds - The ids of the bank accounts.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   *
   * @returns The matching balances.
   *
   * @example
   * const BALANCES = await CHECKING_REPO
   *   .findAllByBankAccountIdsInPeriod(IDS, START, END);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByBankAccountIdsInPeriod(
    bankAccountIds: EntityId[],
    startDate: Date,
    endDate: Date
  ): Promise<CheckingAccount[]> {
    if (bankAccountIds.length === 0) {
      return []
    }

    const ROWS = await this.db
      .select()
      .from(checkingAccount)
      .where(
        and(
          inArray(checkingAccount.bankAccountId, bankAccountIds),
          gte(checkingAccount.date, startDate),
          lte(checkingAccount.date, endDate)
        )
      )
      .orderBy(asc(checkingAccount.date))

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Retrieves the balance for a bank account and date.
   *
   * @remarks
   * Returns `null` when no row matches the pair.
   *
   * @explanation
   * Use this method to load a single balance by its bank
   * account id and date. Callers must handle the null
   * result.
   *
   * @param bankAccountId - The id of the bank account.
   * @param date - The date of the balance.
   *
   * @returns The entity or `null`.
   *
   * @example
   * const BALANCE = await CHECKING_REPO
   *   .findByBankAccountIdAndDate(BANK_ID, DATE);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findByBankAccountIdAndDate(
    bankAccountId: EntityId,
    date: Date
  ): Promise<CheckingAccount | null> {
    const [ROW] = await this.db
      .select()
      .from(checkingAccount)
      .where(
        and(
          eq(checkingAccount.bankAccountId, bankAccountId),
          eq(checkingAccount.date, date)
        )
      )
      .limit(1)

    return ROW ? ToDomain(ROW) : null
  }

  /**
   * @summary
   * Retrieves all balances with the provided ids.
   *
   * @remarks
   * Returns an empty array when no ids match.
   *
   * @explanation
   * Use this method to hydrate checking account balances
   * by their ids in a single batched query.
   *
   * @param ids - The ids of the balances.
   *
   * @returns The matching entities.
   *
   * @example
   * const BALANCES = await CHECKING_REPO.findAllByIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async findAllByIds(
    ids: EntityId[]
  ): Promise<CheckingAccount[]> {
    if (ids.length === 0) {
      return []
    }

    const ROWS = await this.db
      .select()
      .from(checkingAccount)
      .where(inArray(checkingAccount.id, ids))

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Persists the provided checking account balance.
   *
   * @remarks
   * Inserts a new row when the entity has no id. Updates
   * the existing row otherwise.
   *
   * @explanation
   * Use this method to create or update a checking account
   * balance. Returns the persisted entity with its id.
   *
   * @param persisted - The balance to persist.
   *
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await CHECKING_REPO.save(BALANCE);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(
    persisted: CheckingAccount
  ): Promise<CheckingAccount> {
    if (persisted.id) {
      const [ROW] = await this.db
        .update(checkingAccount)
        .set(ToUpdate(persisted))
        .where(eq(checkingAccount.id, persisted.id))
        .returning()

      if (!ROW) {
        throw new NotFoundError(
          `CheckingAccount with id ${persisted.id} was not found.`
        )
      }

      return ToDomain(ROW)
    }

    const [ROW] = await this.db
      .insert(checkingAccount)
      .values(ToInsert(persisted))
      .returning()

    return ToDomain(ROW)
  }

  /**
   * @summary
   * Removes the checking account balance with the provided id.
   *
   * @remarks
   * Resolves when the row is removed.
   *
   * @explanation
   * Use this method to delete a checking account balance by
   * its primary key.
   *
   * @param id - The unique identifier of the balance.
   *
   * @example
   * await CHECKING_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async delete(id: EntityId): Promise<void> {
    await this.db
      .delete(checkingAccount)
      .where(eq(checkingAccount.id, id))
  }

  /**
   * @summary
   * Removes the balances with the provided ids.
   *
   * @remarks
   * Resolves when the rows are removed.
   *
   * @explanation
   * Use this method to delete many checking account
   * balance rows in one batched operation.
   *
   * @param ids - The unique identifiers of the balances.
   *
   * @example
   * await CHECKING_REPO.deleteByIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async deleteByIds(ids: EntityId[]): Promise<void> {
    if (ids.length === 0) {
      return
    }

    await this.db
      .delete(checkingAccount)
      .where(inArray(checkingAccount.id, ids))
  }
}
