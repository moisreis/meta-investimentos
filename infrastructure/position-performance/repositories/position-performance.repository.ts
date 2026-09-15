import { and, desc, eq, inArray } from "drizzle-orm"
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core"

import { PositionPerformance } from "@domain/position-performance/entities/position-performance.entity"
import type { IPositionPerformance } from "@domain/position-performance/interfaces/position-performance.interface"
import {
  EntityId,
  PositiveMoney,
  QuotaQuantity,
  SignedMoney,
  SignedPercentage,
} from "@/value-objects"
import { positionPerformance } from "@db-schemas/position-performance.schema"
import { NotFoundError } from "@errors/not-found.error"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Implements the position performance persistence contract.
 *
 * @remarks
 * Maps `position_performance` rows to entities and back.
 * Numeric columns return as strings from **PostgreSQL**
 * and hydrate into value objects; persistence uses
 * `.value.toString()`. Lookups rely on the primary key
 * and the `(position_id, date)` unique pair and composite
 * index. The `findLatestByPositionIds` lookup uses
 * `DISTINCT ON (position_id)` to resolve the latest row
 * of each position in a single query.
 *
 * @explanation
 * Use this repository for position performance data access
 * in the infrastructure layer. It translates persisted
 * snapshots into domain entities.
 *
 * @example
 * const REPO = new PositionPerformanceRepository(DB_CLIENT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class PositionPerformanceRepository implements IPositionPerformance {
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
   * const REPO = new PositionPerformanceRepository(DB_CLIENT);
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
   * const ENTITY = toEntity(ROW);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toEntity(
    row: typeof positionPerformance.$inferSelect
  ): PositionPerformance {
    return PositionPerformance.create(
      {
        positionId: EntityId.create(row.positionId),
        date: row.date,
        quotasHeld: QuotaQuantity.create(row.quotasHeld),
        patrimony: PositiveMoney.create(row.patrimony),
        applicationTotal: PositiveMoney.create(row.applicationTotal),
        redemptionTotal: PositiveMoney.create(row.redemptionTotal),
        cashFlowNet: SignedMoney.create(row.cashFlowNet),
        earnings: SignedMoney.create(row.earnings),
        returnDaily: SignedPercentage.create(row.returnDaily),
        returnMonthly: row.returnMonthly
          ? SignedPercentage.create(row.returnMonthly)
          : null,
        returnYearly: row.returnYearly
          ? SignedPercentage.create(row.returnYearly)
          : null,
        returnLast12m: row.returnLast12m
          ? SignedPercentage.create(row.returnLast12m)
          : null,
        allocation: SignedPercentage.create(row.allocation),
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
   * Serializes each value object with `.value.toString()`.
   *
   * @explanation
   * Use this mapper to build the row inserted when the
   * entity has no id.
   *
   * @param entity - The snapshot to persist.
   * @returns The insert values.
   *
   * @example
   * const VALUES = toInsert(ENTITY);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toInsert(
    entity: PositionPerformance
  ): typeof positionPerformance.$inferInsert {
    return {
      positionId: entity.positionId,
      date: entity.date,
      quotasHeld: entity.quotasHeld.value.toString(),
      patrimony: entity.patrimony.value.toString(),
      applicationTotal: entity.applicationTotal.value.toString(),
      redemptionTotal: entity.redemptionTotal.value.toString(),
      cashFlowNet: entity.cashFlowNet.value.toString(),
      earnings: entity.earnings.value.toString(),
      returnDaily: entity.returnDaily.value.toString(),
      returnMonthly: entity.returnMonthly?.value.toString() ?? null,
      returnYearly: entity.returnYearly?.value.toString() ?? null,
      returnLast12m: entity.returnLast12m?.value.toString() ?? null,
      allocation: entity.allocation.value.toString(),
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
   * @param entity - The snapshot to persist.
   * @returns The update values.
   *
   * @example
   * const VALUES = toUpdate(ENTITY);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toUpdate(
    entity: PositionPerformance
  ): Partial<typeof positionPerformance.$inferInsert> {
    return {
      positionId: entity.positionId,
      date: entity.date,
      quotasHeld: entity.quotasHeld.value.toString(),
      patrimony: entity.patrimony.value.toString(),
      applicationTotal: entity.applicationTotal.value.toString(),
      redemptionTotal: entity.redemptionTotal.value.toString(),
      cashFlowNet: entity.cashFlowNet.value.toString(),
      earnings: entity.earnings.value.toString(),
      returnDaily: entity.returnDaily.value.toString(),
      returnMonthly: entity.returnMonthly?.value.toString() ?? null,
      returnYearly: entity.returnYearly?.value.toString() ?? null,
      returnLast12m: entity.returnLast12m?.value.toString() ?? null,
      allocation: entity.allocation.value.toString(),
    }
  }

  /**
   * @summary
   * Retrieves the snapshot with the provided id.
   *
   * @remarks
   * Returns null when no row matches the id.
   *
   * @explanation
   * Use this method to load one snapshot by its primary key.
   * Callers must handle the null result.
   *
   * @param id - The unique identifier of the snapshot.
   * @returns The entity or `null`.
   *
   * @example
   * const SNAPSHOT = await POS_PERF_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(id: EntityId): Promise<PositionPerformance | null> {
    const [row] = await this.db
      .select()
      .from(positionPerformance)
      .where(eq(positionPerformance.id, id))
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  /**
   * @summary
   * Retrieves every snapshot of the provided position id.
   *
   * @remarks
   * Returns an empty array when no rows match.
   *
   * @explanation
   * Use this method to load the full performance series of
   * a single position.
   *
   * @param positionId - The id of the position.
   * @returns The matching snapshots.
   *
   * @example
   * const SNAPSHOTS = await POS_PERF_REPO
   *   .findAllByPositionId(POSITION_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByPositionId(
    positionId: EntityId
  ): Promise<PositionPerformance[]> {
    const rows = await this.db
      .select()
      .from(positionPerformance)
      .where(eq(positionPerformance.positionId, positionId))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves every snapshot of any provided position id.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns an
   * empty array when no ids match.
   *
   * @explanation
   * Use this method to hydrate the performance series across
   * many positions in one query instead of one query per
   * position.
   *
   * @param positionIds - The ids of the positions.
   * @returns The matching snapshots.
   *
   * @example
   * const SNAPSHOTS = await POS_PERF_REPO
   *   .findAllByPositionIds(POSITION_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByPositionIds(
    positionIds: string[]
  ): Promise<PositionPerformance[]> {
    if (positionIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(positionPerformance)
      .where(inArray(positionPerformance.positionId, positionIds))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves the snapshot for a position on a given date.
   *
   * @remarks
   * Returns null when no row matches the pair.
   *
   * @explanation
   * Use this method to load one snapshot per position and
   * date. Callers must handle the null result.
   *
   * @param positionId - The id of the position.
   * @param date - The snapshot date to match.
   * @returns The entity or `null`.
   *
   * @example
   * const SNAPSHOT = await POS_PERF_REPO
   *   .findByPositionIdAndDate(POSITION_ID, DATE);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findByPositionIdAndDate(
    positionId: EntityId,
    date: Date
  ): Promise<PositionPerformance | null> {
    const [row] = await this.db
      .select()
      .from(positionPerformance)
      .where(
        and(
          eq(positionPerformance.positionId, positionId),
          eq(positionPerformance.date, date)
        )
      )
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  /**
   * @summary
   * Retrieves the latest snapshot for the provided position id.
   *
   * @remarks
   * Orders rows by date descending and takes the first one.
   * Returns null when the position has no rows.
   *
   * @explanation
   * Use this method to load the most recent snapshot of a
   * single position in one query.
   *
   * @param positionId - The id of the position.
   * @returns The entity or `null`.
   *
   * @example
   * const SNAPSHOT = await POS_PERF_REPO
   *   .findLatestByPositionId(POSITION_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findLatestByPositionId(
    positionId: EntityId
  ): Promise<PositionPerformance | null> {
    const [row] = await this.db
      .select()
      .from(positionPerformance)
      .where(eq(positionPerformance.positionId, positionId))
      .orderBy(desc(positionPerformance.date))
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  /**
   * @summary
   * Retrieves the latest snapshot per position id.
   *
   * @remarks
   * Uses `DISTINCT ON (position_id)` to resolve the latest
   * row per position in one query. Returns an empty array
   * when no ids match.
   *
   * @explanation
   * Use this method to hydrate the latest snapshot across
   * many positions instead of one query per position.
   *
   * @param positionIds - The ids of the positions.
   * @returns The latest snapshots.
   *
   * @example
   * const SNAPSHOTS = await POS_PERF_REPO
   *   .findLatestByPositionIds(POSITION_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findLatestByPositionIds(
    positionIds: string[]
  ): Promise<PositionPerformance[]> {
    if (positionIds.length === 0) {
      return []
    }

    const rows = await this.db
      .selectDistinctOn([positionPerformance.positionId])
      .from(positionPerformance)
      .where(inArray(positionPerformance.positionId, positionIds))
      .orderBy(positionPerformance.positionId, desc(positionPerformance.date))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Persists the provided position performance snapshot.
   *
   * @remarks
   * Inserts a new row when the entity has no id. Updates
   * the existing row or throws `NotFoundError` when missing.
   *
   * @explanation
   * Use this method to create or update a snapshot. Returns
   * the persisted entity with its id.
   *
   * @param persisted - The snapshot to persist.
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await POS_PERF_REPO.save(SNAPSHOT);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(persisted: PositionPerformance): Promise<PositionPerformance> {
    if (persisted.id) {
      const [row] = await this.db
        .update(positionPerformance)
        .set(this.toUpdate(persisted))
        .where(eq(positionPerformance.id, persisted.id))
        .returning()

      if (!row) {
        throw new NotFoundError(
          `PositionPerformance with id ${persisted.id} was not found.`
        )
      }

      return this.toEntity(row)
    }

    const [row] = await this.db
      .insert(positionPerformance)
      .values(this.toInsert(persisted))
      .returning()

    return this.toEntity(row)
  }

  /**
   * @summary
   * Removes the snapshot with the provided id.
   *
   * @remarks
   * Resolves when the row is removed.
   *
   * @explanation
   * Use this method to delete a snapshot by its primary key.
   *
   * @param id - The unique identifier of the snapshot.
   *
   * @example
   * await POS_PERF_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async delete(id: EntityId): Promise<void> {
    await this.db
      .delete(positionPerformance)
      .where(eq(positionPerformance.id, id))
  }
}
