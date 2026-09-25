import { asc, eq, inArray } from "drizzle-orm"
import type {
  PgAsyncDatabase,
  PgQueryResultHKT,
} from "drizzle-orm/pg-core"

import { Bank } from "@domain/bank/entities/bank.entity"
import type { IBank } from "@domain/bank/interfaces/bank.interface"
import type { EntityId } from "@/value-objects"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "../mappers/bank.mapper"
import { bank } from "@db-schemas/bank.schema"
import { NotFoundError } from "@errors/not-found.error"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Implements the bank persistence contract.
 *
 * @remarks
 * Maps `bank` rows to `Bank` entities and back. Lookups
 * rely on the primary key and the code unique constraint.
 *
 * @explanation
 * Use this repository for all bank data access in the
 * infrastructure layer. It translates rows into domain
 * entities and persists entity changes.
 *
 * @example
 * const REPO = new BankRepository(DB_CLIENT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class BankRepository implements IBank {
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
   * const REPO = new BankRepository(DB_CLIENT);
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
   * Retrieves the bank with the provided id.
   *
   * @remarks
   * Returns null when no row matches the id.
   *
   * @explanation
   * Use this method to load a bank by its primary key.
   * Callers must handle the null result.
   *
   * @param id - The unique identifier of the bank.
   *
   * @returns The entity or `null`.
   *
   * @example
   * const BANK = await BANK_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(id: EntityId): Promise<Bank | null> {
    const [ROW] = await this.db
      .select()
      .from(bank)
      .where(eq(bank.id, id))
      .limit(1)

    return ROW ? ToDomain(ROW) : null
  }

  /**
   * @summary
   * Retrieves the bank with the provided code.
   *
   * @remarks
   * Returns null when no row matches the code.
   *
   * @explanation
   * Use this method to load a bank by its unique code.
   * Callers must handle the null result.
   *
   * @param code - The unique code of the bank.
   *
   * @returns The entity or `null`.
   *
   * @example
   * const BANK = await BANK_REPO.findByCode("001");
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findByCode(code: string): Promise<Bank | null> {
    const [ROW] = await this.db
      .select()
      .from(bank)
      .where(eq(bank.code, code))
      .limit(1)

    return ROW ? ToDomain(ROW) : null
  }

  /**
   * @summary
   * Retrieves all banks, optionally paginated.
   *
   * @remarks
   * Results are sorted by `code` ascending. Defaults to
   * a limit of 100 rows.
   *
   * @explanation
   * Use this method to list all banks. Pass pagination
   * options to control the window of results.
   *
   * @param options - Optional pagination parameters.
   *
   * @returns The matching entities.
   *
   * @example
   * const BANKS = await BANK_REPO.findAll({
   *   limit: 10,
   *   offset: 0,
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAll(options?: {
    limit?: number
    offset?: number
  }): Promise<Bank[]> {
    const ROWS = await this.db
      .select()
      .from(bank)
      .orderBy(asc(bank.code))
      .limit(options?.limit ?? 100)
      .offset(options?.offset ?? 0)

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Retrieves all banks with any of the provided ids.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns
   * an empty array when no ids match.
   *
   * @explanation
   * Use this method to hydrate many banks in one query
   * instead of one query per id.
   *
   * @param ids - The ids of the banks to retrieve.
   *
   * @returns The matching banks.
   *
   * @example
   * const BANKS = await BANK_REPO.findAllByIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByIds(ids: EntityId[]): Promise<Bank[]> {
    if (ids.length === 0) {
      return []
    }

    const ROWS = await this.db
      .select()
      .from(bank)
      .where(inArray(bank.id, ids))

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Persists the provided bank.
   *
   * @remarks
   * Inserts a new row when the entity has no id. Updates
   * the existing row otherwise.
   *
   * @explanation
   * Use this method to create or update a bank. Returns
   * the persisted entity with its id.
   *
   * @param persisted - The bank to persist.
   *
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await BANK_REPO.save(BANK);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(persisted: Bank): Promise<Bank> {
    if (persisted.id) {
      const [ROW] = await this.db
        .update(bank)
        .set(ToUpdate(persisted))
        .where(eq(bank.id, persisted.id))
        .returning()

      if (!ROW) {
        throw new NotFoundError(
          `Bank with id ${persisted.id} was not found.`
        )
      }

      return ToDomain(ROW)
    }

    const [ROW] = await this.db
      .insert(bank)
      .values(ToInsert(persisted))
      .returning()

    return ToDomain(ROW)
  }

  /**
   * @summary
   * Removes the bank with the provided id.
   *
   * @remarks
   * Resolves when the row is removed.
   *
   * @explanation
   * Use this method to delete a bank by its primary key.
   *
   * @param id - The unique identifier of the bank.
   *
   * @example
   * await BANK_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(bank).where(eq(bank.id, id))
  }

  /**
   * @summary
   * Removes the banks with the provided ids.
   *
   * @remarks
   * A batched delete avoids an N+1 query pattern. Resolves
   * when the rows are removed; a no-op for an empty input.
   *
   * @explanation
   * Use this method to delete many banks in one query.
   *
   * @param ids - The ids of the banks to remove.
   *
   * @example
   * await BANK_REPO.deleteByIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async deleteByIds(ids: EntityId[]): Promise<void> {
    if (ids.length === 0) {
      return
    }

    await this.db.delete(bank).where(inArray(bank.id, ids))
  }
}
