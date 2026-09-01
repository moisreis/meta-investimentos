import { and, desc, eq, gte, inArray, lte } from "drizzle-orm";

import { Quota } from "@/business/entities/fund/quota.entity";
import type { IQuota } from "@/business/interfaces/fund/quota.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import QuotaPrice from "@/business/value-objects/quota-price.vo";
import { quota } from "@/infrastructure/database/schemas";

import type { DbClient } from "../types";

/**
 * PostgreSQL-backed implementation of the {@link IQuota} contract.
 *
 * Maps `quota` rows to `Quota` entities and back. Lookups rely on the
 * primary key, the `(fund_id, date)` unique pair and the matching
 * composite index.
 *
 * The `price` column is stored as `numeric`, which postgres returns as
 * a string; it is hydrated into a `QuotaPrice` value object and
 * persisted through its `.value.toString()` representation.
 *
 * A save inserts a new row when the entity has no id and updates the
 * existing row otherwise. Batch lookups (period and latest) exist so a
 * price series across several funds is resolved with one query instead
 * of one query per fund.
 */
export class QuotaRepository implements IQuota {
  // --------------------------------------
  // FIELDS
  // --------------------------------------

  private readonly db: DbClient;

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `QuotaRepository` bound to the provided database client.
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
   * Maps the provided `quota` row to a {@link Quota} entity.
   *
   * @param row - The database row.
   * @returns The hydrated `Quota` entity.
   */
  private toEntity(row: typeof quota.$inferSelect): Quota {
    return Quota.create(
      {
        fundId: EntityId.create(row.fundId),
        date: row.date,
        price: QuotaPrice.create(row.price),
        createdAt: row.createdAt,
      },
      row.id,
    );
  }

  /**
   * Maps the provided entity to the insert values of the `quota`
   * table.
   *
   * @param entity - The quota to persist.
   * @returns The insert values.
   */
  private toInsert(entity: Quota): typeof quota.$inferInsert {
    return {
      fundId: entity.fundId,
      date: entity.date,
      price: entity.price.value.toString(),
      createdAt: entity.createdAt,
    };
  }

  /**
   * Maps the provided entity to the mutable update values of the
   * `quota` table.
   *
   * `createdAt` never changes and is left out of the update.
   *
   * @param entity - The quota to persist.
   * @returns The update values.
   */
  private toUpdate(entity: Quota): Partial<typeof quota.$inferInsert> {
    return {
      fundId: entity.fundId,
      date: entity.date,
      price: entity.price.value.toString(),
    };
  }

  // --------------------------------------
  // QUERY METHODS
  // --------------------------------------

  /**
   * Retrieves the quota with the provided id.
   *
   * @see {@link IQuota.findById}
   */
  async findById(id: string): Promise<Quota | null> {
    const [row] = await this.db
      .select()
      .from(quota)
      .where(eq(quota.id, id))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all quotas that belong to the provided fund id.
   *
   * @see {@link IQuota.findAllByFundId}
   */
  async findAllByFundId(fundId: string): Promise<Quota[]> {
    const rows = await this.db
      .select()
      .from(quota)
      .where(eq(quota.fundId, fundId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all quotas that belong to any of the provided fund ids.
   *
   * Batched lookup for hydrating the price series of many funds
   * without falling into an N+1 query pattern.
   *
   * @param fundIds - The ids of the funds to retrieve quotas for.
   * @returns A promise resolving to the matching `Quota` entities.
   */
  async findAllByFundIds(fundIds: string[]): Promise<Quota[]> {
    if (fundIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(quota)
      .where(inArray(quota.fundId, fundIds));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves the quota for the provided fund id and date.
   *
   * @see {@link IQuota.findByFundIdAndDate}
   */
  async findByFundIdAndDate(fundId: string, date: Date): Promise<Quota | null> {
    const [row] = await this.db
      .select()
      .from(quota)
      .where(and(eq(quota.fundId, fundId), eq(quota.date, date)))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all quotas of the provided funds whose date falls within
   * the provided period, inclusive.
   *
   * Batched lookup backing the same analysis as
   * `findAllByFundIdInPeriod` across several funds in one round-trip.
   *
   * @param fundIds - The ids of the funds to retrieve quotas for.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   * @returns A promise resolving to the matching `Quota` entities.
   */
  async findAllByFundIdsInPeriod(
    fundIds: string[],
    startDate: Date,
    endDate: Date,
  ): Promise<Quota[]> {
    if (fundIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(quota)
      .where(
        and(
          inArray(quota.fundId, fundIds),
          gte(quota.date, startDate),
          lte(quota.date, endDate),
        ),
      );

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves the quota with the most recent date for the provided
   * fund id.
   *
   * @see {@link IQuota.findLatestByFundId}
   */
  async findLatestByFundId(fundId: string): Promise<Quota | null> {
    const [row] = await this.db
      .select()
      .from(quota)
      .where(eq(quota.fundId, fundId))
      .orderBy(desc(quota.date))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves the quota with the most recent date for each of the
   * provided fund ids.
   *
   * A `DISTINCT ON (fund_id)` window returns the latest row per fund in
   * a single query, replacing one `findLatestByFundId` call per fund.
   *
   * @param fundIds - The ids of the funds to retrieve quotas for.
   * @returns A promise resolving to the latest `Quota` per provided
   *   fund id.
   */
  async findLatestByFundIds(fundIds: string[]): Promise<Quota[]> {
    if (fundIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .selectDistinctOn([quota.fundId])
      .from(quota)
      .where(inArray(quota.fundId, fundIds))
      .orderBy(quota.fundId, desc(quota.date));

    return rows.map((row) => this.toEntity(row));
  }

  // --------------------------------------
  // COMMAND METHODS
  // --------------------------------------

  /**
   * Persists the provided quota.
   *
   * @see {@link IQuota.save}
   */
  async save(persisted: Quota): Promise<Quota> {
    if (persisted.id) {
      const [row] = await this.db
        .update(quota)
        .set(this.toUpdate(persisted))
        .where(eq(quota.id, persisted.id))
        .returning();

      if (!row) {
        throw new Error(`Quota with id ${persisted.id} was not found.`);
      }

      return this.toEntity(row);
    }

    const [row] = await this.db
      .insert(quota)
      .values(this.toInsert(persisted))
      .returning();

    return this.toEntity(row);
  }

  /**
   * Removes the quota with the provided id.
   *
   * @see {@link IQuota.delete}
   */
  async delete(id: string): Promise<void> {
    await this.db.delete(quota).where(eq(quota.id, id));
  }
}
