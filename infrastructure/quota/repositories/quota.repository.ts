import { and, desc, eq, gte, inArray, lte, or, sql } from "drizzle-orm"
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core"

import { Quota } from "@domain/quota/entities/quota.entity"
import type {
  IQuota,
  UpsertQuota,
  UpsertQuotaResult,
} from "@domain/quota/interfaces/quota.interface"
import { EntityId, QuotaPrice } from "@/value-objects"
import { quota } from "@db-schemas/quota.schema"
import { NotFoundError } from "@errors/not-found.error"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Implements the quota persistence contract.
 *
 * @remarks
 * Maps `quota` rows to entities and back. Lookups rely on
 * the primary key and the `(fund_id, date)` unique pair and
 * the matching composite index. The `price` column returns
 * as a string from **PostgreSQL** and hydrates into a
 * `QuotaPrice` value object.
 *
 * @explanation
 * Use this repository for all quota data access in the
 * infrastructure layer. It translates persisted price rows
 * into domain entities.
 *
 * @example
 * const REPO = new QuotaRepository(DB_CLIENT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class QuotaRepository implements IQuota {
  private readonly db: DbClient

  /**
   * @summary
   * Binds the repository to a database client.
   *
   * @remarks
   * The client runs every query issued by the repository.
   *
   * @explanation
   * Use this constructor to provide the **PostgreSQL** client
   * used by all repository operations.
   *
   * @param db - The **Drizzle** database client.
   *
   * @example
   * const REPO = new QuotaRepository(DB_CLIENT);
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
   * Hydrates the price through its `create` method.
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
  private toEntity(row: typeof quota.$inferSelect): Quota {
    return Quota.create(
      {
        fundId: EntityId.create(row.fundId),
        date: row.date,
        price: QuotaPrice.create(row.price),
        createdAt: row.createdAt,
      },
      row.id
    )
  }

  /**
   * @summary
   * Maps a domain entity to insert values.
   *
   * @remarks
   * Serializes the price with `.value.toString()`.
   *
   * @explanation
   * Use this mapper to build the row inserted when the
   * entity has no id.
   *
   * @param entity - The quota to persist.
   * @returns The insert values.
   *
   * @example
   * const VALUES = toInsert(ENTITY);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toInsert(entity: Quota): typeof quota.$inferInsert {
    return {
      fundId: entity.fundId,
      date: entity.date,
      price: entity.price.value.toString(),
      createdAt: entity.createdAt,
    }
  }

  /**
   * @summary
   * Maps a domain entity to update values.
   *
   * @remarks
   * `createdAt` never changes and is left out of the
   * update.
   *
   * @explanation
   * Use this mapper to build the row updated when the
   * entity already has an id.
   *
   * @param entity - The quota to persist.
   * @returns The update values.
   *
   * @example
   * const VALUES = toUpdate(ENTITY);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toUpdate(entity: Quota): Partial<typeof quota.$inferInsert> {
    return {
      fundId: entity.fundId,
      date: entity.date,
      price: entity.price.value.toString(),
    }
  }

  /**
   * @summary
   * Retrieves the quota with the provided id.
   *
   * @remarks
   * Returns null when no row matches the id.
   *
   * @explanation
   * Use this method to load a quota by its primary key.
   * Callers must handle the null result.
   *
   * @param id - The unique identifier of the quota.
   * @returns The entity or `null`.
   *
   * @example
   * const QUOTA = await QUOTA_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(id: EntityId): Promise<Quota | null> {
    const [row] = await this.db
      .select()
      .from(quota)
      .where(eq(quota.id, id))
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  /**
   * @summary
   * Retrieves every quota of the provided fund id.
   *
   * @remarks
   * Returns an empty array when no rows match.
   *
   * @explanation
   * Use this method to load the full price series of a
   * single fund.
   *
   * @param fundId - The id of the fund.
   * @returns The matching quotas.
   *
   * @example
   * const QUOTAS = await QUOTA_REPO.findAllByFundId(FUND_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByFundId(fundId: EntityId): Promise<Quota[]> {
    const rows = await this.db
      .select()
      .from(quota)
      .where(eq(quota.fundId, fundId))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves every quota of any provided fund id.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns an
   * empty array when no ids match.
   *
   * @explanation
   * Use this method to hydrate the price series across many
   * funds in one query instead of one query per fund.
   *
   * @param fundIds - The ids of the funds.
   * @returns The matching quotas.
   *
   * @example
   * const QUOTAS = await QUOTA_REPO.findAllByFundIds(FUND_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByFundIds(fundIds: string[]): Promise<Quota[]> {
    if (fundIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(quota)
      .where(inArray(quota.fundId, fundIds))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves the quota for a fund on a given date.
   *
   * @remarks
   * Returns null when no row matches the pair.
   *
   * @explanation
   * Use this method to load one quota per fund and date.
   * Callers must handle the null result.
   *
   * @param fundId - The id of the fund.
   * @param date - The quota date to match.
   * @returns The entity or `null`.
   *
   * @example
   * const QUOTA = await QUOTA_REPO
   *   .findByFundIdAndDate(FUND_ID, DATE);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findByFundIdAndDate(
    fundId: EntityId,
    date: Date
  ): Promise<Quota | null> {
    const [row] = await this.db
      .select()
      .from(quota)
      .where(and(eq(quota.fundId, fundId), eq(quota.date, date)))
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  /**
   * @summary
   * Retrieves quotas of the funds within a period.
   *
   * @remarks
   * The period is inclusive on both ends. Batched lookup
   * avoids an N+1 query pattern.
   *
   * @explanation
   * Use this method to load the price series of many funds
   * inside a date window in one query.
   *
   * @param fundIds - The ids of the funds.
   * @param startDate - The start of the period.
   * @param endDate - The end of the period.
   * @returns The matching quotas.
   *
   * @example
   * const QUOTAS = await QUOTA_REPO
   *   .findAllByFundIdsInPeriod(FUND_IDS, START, END);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByFundIdsInPeriod(
    fundIds: string[],
    startDate: Date,
    endDate: Date
  ): Promise<Quota[]> {
    if (fundIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(quota)
      .where(
        and(
          inArray(quota.fundId, fundIds),
          gte(quota.date, startDate),
          lte(quota.date, endDate)
        )
      )

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves the latest quota for the provided fund id.
   *
   * @remarks
   * Orders rows by date descending and takes the first one.
   * Returns null when the fund has no rows.
   *
   * @explanation
   * Use this method to load the most recent quota of a
   * single fund in one query.
   *
   * @param fundId - The id of the fund.
   * @returns The entity or `null`.
   *
   * @example
   * const QUOTA = await QUOTA_REPO
   *   .findLatestByFundId(FUND_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findLatestByFundId(fundId: EntityId): Promise<Quota | null> {
    const [row] = await this.db
      .select()
      .from(quota)
      .where(eq(quota.fundId, fundId))
      .orderBy(desc(quota.date))
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  /**
   * @summary
   * Retrieves the latest quota per fund id.
   *
   * @remarks
   * Uses `DISTINCT ON (fund_id)` to resolve the latest
   * row per fund in one query. Returns an empty array when
   * no ids match.
   *
   * @explanation
   * Use this method to hydrate the latest quota across many
   * funds instead of one query per fund.
   *
   * @param fundIds - The ids of the funds.
   * @returns The latest quotas.
   *
   * @example
   * const QUOTAS = await QUOTA_REPO
   *   .findLatestByFundIds(FUND_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findLatestByFundIds(fundIds: string[]): Promise<Quota[]> {
    if (fundIds.length === 0) {
      return []
    }

    const rows = await this.db
      .selectDistinctOn([quota.fundId])
      .from(quota)
      .where(inArray(quota.fundId, fundIds))
      .orderBy(quota.fundId, desc(quota.date))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Upserts a batch of quota rows in bulk.
   *
   * @remarks
   * First queries the existing `(fundId, date)` pairs. Then
   * runs one `INSERT ... ON CONFLICT DO UPDATE` statement and
   * reports the action taken for each record.
   *
   * @explanation
   * Use this method to create or update many quotas in one
   * round trip. Result actions are either `INSERT` or
   * `UPDATE`.
   *
   * @param records - The quotas to upsert.
   * @returns The upsert results.
   *
   * @example
   * const RESULTS = await QUOTA_REPO.upsertMany(RECORDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async upsertMany(records: UpsertQuota[]): Promise<UpsertQuotaResult[]> {
    if (records.length === 0) {
      return []
    }

    const CONDITIONS = records.map((r) =>
      and(eq(quota.fundId, r.fundId), eq(quota.date, r.date))
    )

    const EXISTING = await this.db
      .select({ fundId: quota.fundId, date: quota.date })
      .from(quota)
      .where(or(...CONDITIONS))

    const EXISTING_SET = new Set(
      EXISTING.map((e) => `${e.fundId}:${e.date.getTime()}`)
    )

    await this.db
      .insert(quota)
      .values(
        records.map((r) => ({
          fundId: r.fundId,
          date: r.date,
          price: r.price,
        }))
      )
      .onConflictDoUpdate({
        target: [quota.fundId, quota.date],
        set: { price: sql`excluded.price` },
      })

    return records.map((r) => ({
      fundId: r.fundId,
      date: r.date,
      price: r.price,
      action: EXISTING_SET.has(`${r.fundId}:${r.date.getTime()}`)
        ? "UPDATE"
        : "INSERT",
    }))
  }

  /**
   * @summary
   * Persists the provided quota.
   *
   * @remarks
   * Inserts a new row when the entity has no id. Updates
   * the existing row or throws `NotFoundError` when missing.
   *
   * @explanation
   * Use this method to create or update a quota. Returns the
   * persisted entity with its id.
   *
   * @param persisted - The quota to persist.
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await QUOTA_REPO.save(QUOTA);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(persisted: Quota): Promise<Quota> {
    if (persisted.id) {
      const [row] = await this.db
        .update(quota)
        .set(this.toUpdate(persisted))
        .where(eq(quota.id, persisted.id))
        .returning()

      if (!row) {
        throw new NotFoundError(`Quota with id ${persisted.id} was not found.`)
      }

      return this.toEntity(row)
    }

    const [row] = await this.db
      .insert(quota)
      .values(this.toInsert(persisted))
      .returning()

    return this.toEntity(row)
  }

  /**
   * @summary
   * Removes the quota with the provided id.
   *
   * @remarks
   * Resolves when the row is removed.
   *
   * @explanation
   * Use this method to delete a quota by its primary key.
   *
   * @param id - The unique identifier of the quota.
   *
   * @example
   * await QUOTA_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(quota).where(eq(quota.id, id))
  }
}
