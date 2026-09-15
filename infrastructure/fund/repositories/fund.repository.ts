import { asc, eq, inArray } from "drizzle-orm"
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core"

import { Fund } from "@domain/fund/entities/fund.entity"
import type { IFund } from "@domain/fund/interfaces/fund.interface"
import { CNPJ, EntityId, SignedPercentage } from "@/value-objects"
import { fund } from "@db-schemas/fund.schema"
import { NotFoundError } from "@errors/not-found.error"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Implements the fund persistence contract.
 *
 * @remarks
 * Maps `fund` rows to `Fund` entities and back. Lookups
 * rely on the primary key, the CNPJ unique constraint,
 * and the indexes on bank, benchmark, and category.
 *
 * @explanation
 * Use this repository for all fund data access in the
 * infrastructure layer. It translates rows into domain
 * entities and persists entity changes.
 *
 * @example
 * const REPO = new FundRepository(DB_CLIENT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class FundRepository implements IFund {
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
   * const REPO = new FundRepository(DB_CLIENT);
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
   * Percentage columns are stored as `numeric` in
   * **PostgreSQL**, returned as strings, and hydrated into
   * `SignedPercentage` value objects.
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
  private toEntity(row: typeof fund.$inferSelect): Fund {
    return Fund.create(
      {
        cnpj: CNPJ.create(row.cnpj),
        name: row.name,
        administrationFee: row.administrationFee
          ? SignedPercentage.create(row.administrationFee)
          : null,
        performanceFee: row.performanceFee
          ? SignedPercentage.create(row.performanceFee)
          : null,
        bankId: EntityId.create(row.bankId),
        benchmarkId: row.benchmarkId ? EntityId.create(row.benchmarkId) : null,
        categoryId: row.categoryId ? EntityId.create(row.categoryId) : null,
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
   * Returns the columns required by the `fund` insert
   * statement. Percentage values are serialized via their
   * `.value.toString()` representation.
   *
   * @explanation
   * Translates domain properties into the column shape
   * expected by the **Drizzle** insert call.
   *
   * @param entity - The fund to persist.
   * @returns The insert values.
   *
   * @example
   * const VALUES = TO_INSERT(FUND);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toInsert(entity: Fund): typeof fund.$inferInsert {
    return {
      cnpj: entity.cnpj.value,
      name: entity.name,
      administrationFee: entity.administrationFee?.value.toString() ?? null,
      performanceFee: entity.performanceFee?.value.toString() ?? null,
      bankId: entity.bankId,
      benchmarkId: entity.benchmarkId,
      categoryId: entity.categoryId,
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
   * @param entity - The fund to persist.
   * @returns The update values.
   *
   * @example
   * const VALUES = TO_UPDATE(FUND);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toUpdate(entity: Fund): Partial<typeof fund.$inferInsert> {
    return {
      cnpj: entity.cnpj.value,
      name: entity.name,
      administrationFee: entity.administrationFee?.value.toString() ?? null,
      performanceFee: entity.performanceFee?.value.toString() ?? null,
      bankId: entity.bankId,
      benchmarkId: entity.benchmarkId,
      categoryId: entity.categoryId,
    }
  }

  /**
   * @summary
   * Retrieves the fund with the provided id.
   *
   * @remarks
   * Returns null when no row matches the id.
   *
   * @explanation
   * Use this method to load a fund by its primary key.
   * Callers must handle the null result.
   *
   * @param id - The unique identifier of the fund.
   * @returns The entity or `null`.
   *
   * @example
   * const FUND = await FUND_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(id: EntityId): Promise<Fund | null> {
    const [row] = await this.db
      .select()
      .from(fund)
      .where(eq(fund.id, id))
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  /**
   * @summary
   * Retrieves all funds with any of the provided ids.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns
   * an empty array when no ids match.
   *
   * @explanation
   * Use this method to hydrate many funds in one query
   * instead of one query per id.
   *
   * @param ids - The ids of the funds to retrieve.
   * @returns The matching entities.
   *
   * @example
   * const FUNDS = await FUND_REPO.findAllByIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByIds(ids: string[]): Promise<Fund[]> {
    if (ids.length === 0) {
      return []
    }

    const rows = await this.db.select().from(fund).where(inArray(fund.id, ids))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves the fund with the provided CNPJ.
   *
   * @remarks
   * Returns null when no row matches the CNPJ.
   *
   * @explanation
   * Use this method to load a fund by its unique CNPJ.
   * Callers must handle the null result.
   *
   * @param cnpj - The unique CNPJ of the fund.
   * @returns The entity or `null`.
   *
   * @example
   * const FUND = await FUND_REPO.findByCnpj(
   *   "12345678000199",
   * );
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findByCnpj(cnpj: string): Promise<Fund | null> {
    const [row] = await this.db
      .select()
      .from(fund)
      .where(eq(fund.cnpj, cnpj))
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  /**
   * @summary
   * Retrieves all funds, optionally paginated.
   *
   * @remarks
   * Results are sorted by `name` ascending. Defaults to
   * a limit of 100 rows.
   *
   * @explanation
   * Use this method to list all funds. Pass pagination
   * options to control the window of results.
   *
   * @param options - Optional pagination parameters.
   * @returns The matching entities.
   *
   * @example
   * const FUNDS = await FUND_REPO.findAll({
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
  }): Promise<Fund[]> {
    const rows = await this.db
      .select()
      .from(fund)
      .orderBy(asc(fund.name))
      .limit(options?.limit ?? 100)
      .offset(options?.offset ?? 0)

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves all funds issued by the provided bank id.
   *
   * @remarks
   * Returns an empty array when no rows match.
   *
   * @explanation
   * Use this method to load all funds that belong to a
   * given bank.
   *
   * @param bankId - The id of the bank.
   * @returns The matching entities.
   *
   * @example
   * const FUNDS = await FUND_REPO
   *   .findAllByBankId(BANK_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByBankId(bankId: string): Promise<Fund[]> {
    const rows = await this.db
      .select()
      .from(fund)
      .where(eq(fund.bankId, bankId))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves all funds for the provided benchmark id.
   *
   * @remarks
   * Returns an empty array when no rows match.
   *
   * @explanation
   * Use this method to load all funds benchmarked against
   * a given benchmark.
   *
   * @param benchmarkId - The id of the benchmark.
   * @returns The matching entities.
   *
   * @example
   * const FUNDS = await FUND_REPO
   *   .findAllByBenchmarkId(BENCH_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByBenchmarkId(benchmarkId: string): Promise<Fund[]> {
    const rows = await this.db
      .select()
      .from(fund)
      .where(eq(fund.benchmarkId, benchmarkId))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves all funds for the provided category id.
   *
   * @remarks
   * Returns an empty array when no rows match.
   *
   * @explanation
   * Use this method to load all funds tagged with a given
   * category.
   *
   * @param categoryId - The id of the category.
   * @returns The matching entities.
   *
   * @example
   * const FUNDS = await FUND_REPO
   *   .findAllByCategoryId(CAT_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByCategoryId(categoryId: string): Promise<Fund[]> {
    const rows = await this.db
      .select()
      .from(fund)
      .where(eq(fund.categoryId, categoryId))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Persists the provided fund.
   *
   * @remarks
   * Inserts a new row when the entity has no id. Updates
   * the existing row otherwise.
   *
   * @explanation
   * Use this method to create or update a fund. Returns
   * the persisted entity with its id.
   *
   * @param persisted - The fund to persist.
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await FUND_REPO.save(FUND);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(persisted: Fund): Promise<Fund> {
    if (persisted.id) {
      const [row] = await this.db
        .update(fund)
        .set(this.toUpdate(persisted))
        .where(eq(fund.id, persisted.id))
        .returning()

      if (!row) {
        throw new NotFoundError(`Fund with id ${persisted.id} was not found.`)
      }

      return this.toEntity(row)
    }

    const [row] = await this.db
      .insert(fund)
      .values(this.toInsert(persisted))
      .returning()

    return this.toEntity(row)
  }

  /**
   * @summary
   * Removes the fund with the provided id.
   *
   * @remarks
   * Resolves when the row is removed.
   *
   * @explanation
   * Use this method to delete a fund by its primary key.
   *
   * @param id - The unique identifier of the fund.
   *
   * @example
   * await FUND_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(fund).where(eq(fund.id, id))
  }
}
