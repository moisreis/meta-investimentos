import { and, desc, eq, inArray } from "drizzle-orm";

import { PositionPerformance } from "@/business/entities/performance/position-performance.entity";
import type { IPositionPerformance } from "@/business/interfaces/performance/position-performance.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import { positionPerformance } from "@/infrastructure/database/schemas";
import { NotFoundError } from "@/shared/errors";

import type { DbClient } from "../types";

/**
 * PostgreSQL-backed implementation of the
 * {@link IPositionPerformance} contract.
 *
 * Maps `position_performance` rows to `PositionPerformance` entities
 * and back. Lookups rely on the primary key and the `(position_id,
 * date)` unique pair and composite index.
 *
 * Numeric columns are stored as `numeric`, which postgres returns as
 * strings; they are hydrated into the corresponding value objects and
 * persisted through their `.value.toString()` representation.
 *
 * A save inserts a new row when the entity has no id and updates the
 * existing row otherwise. The batch `findLatestByPositionIds` lookup
 * resolves the latest snapshot of many positions in a single query.
 */
export class PositionPerformanceRepository implements IPositionPerformance {
  private readonly db: DbClient;

  /**
   * Creates a `PositionPerformanceRepository` bound to the provided
   * database client.
   *
   * @param db - The database client to run queries against.
   */
  constructor(db: DbClient) {
    this.db = db;
  }

  /**
   * Maps the provided `position_performance` row to a
   * {@link PositionPerformance} entity.
   *
   * @param row - The database row.
   * @returns The hydrated `PositionPerformance` entity.
   */
  private toEntity(
    row: typeof positionPerformance.$inferSelect,
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
      row.id,
    );
  }

  /**
   * Maps the provided entity to the insert values of the
   * `position_performance` table.
   *
   * @param entity - The performance snapshot to persist.
   * @returns The insert values.
   */
  private toInsert(
    entity: PositionPerformance,
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
    };
  }

  /**
   * Maps the provided entity to the mutable update values of the
   * `position_performance` table.
   *
   * `createdAt` never changes and is left out of the update.
   *
   * @param entity - The performance snapshot to persist.
   * @returns The update values.
   */
  private toUpdate(
    entity: PositionPerformance,
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
    };
  }

  /**
   * Retrieves the position performance with the provided id.
   *
   * @see {@link IPositionPerformance.findById}
   */
  async findById(id: EntityId): Promise<PositionPerformance | null> {
    const [row] = await this.db
      .select()
      .from(positionPerformance)
      .where(eq(positionPerformance.id, id))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all performance snapshots of the provided position id.
   *
   * @see {@link IPositionPerformance.findAllByPositionId}
   */
  async findAllByPositionId(
    positionId: EntityId,
  ): Promise<PositionPerformance[]> {
    const rows = await this.db
      .select()
      .from(positionPerformance)
      .where(eq(positionPerformance.positionId, positionId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all performance snapshots of any of the provided
   * position ids.
   *
   * Batched lookup for hydrating the performance series of many
   * positions without falling into an N+1 query pattern.
   *
   * @param positionIds - The ids of the positions to retrieve
   *   performance for.
   * @returns A promise resolving to the matching `PositionPerformance`
   *   entities.
   */
  async findAllByPositionIds(
    positionIds: string[],
  ): Promise<PositionPerformance[]> {
    if (positionIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(positionPerformance)
      .where(inArray(positionPerformance.positionId, positionIds));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves the performance snapshot of the provided position id on
   * the provided date.
   *
   * @see {@link IPositionPerformance.findByPositionIdAndDate}
   */
  async findByPositionIdAndDate(
    positionId: EntityId,
    date: Date,
  ): Promise<PositionPerformance | null> {
    const [row] = await this.db
      .select()
      .from(positionPerformance)
      .where(
        and(
          eq(positionPerformance.positionId, positionId),
          eq(positionPerformance.date, date),
        ),
      )
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves the most recent performance snapshot of the provided
   * position id.
   *
   * @see {@link IPositionPerformance.findLatestByPositionId}
   */
  async findLatestByPositionId(
    positionId: EntityId,
  ): Promise<PositionPerformance | null> {
    const [row] = await this.db
      .select()
      .from(positionPerformance)
      .where(eq(positionPerformance.positionId, positionId))
      .orderBy(desc(positionPerformance.date))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves the most recent performance snapshot of each of the
   * provided position ids.
   *
   * A `DISTINCT ON (position_id)` window returns the latest row per
   * position in a single query, replacing one
   * `findLatestByPositionId` call per position.
   *
   * @param positionIds - The ids of the positions to retrieve
   *   performance for.
   * @returns A promise resolving to the latest `PositionPerformance`
   *   per provided position id.
   */
  async findLatestByPositionIds(
    positionIds: string[],
  ): Promise<PositionPerformance[]> {
    if (positionIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .selectDistinctOn([positionPerformance.positionId])
      .from(positionPerformance)
      .where(inArray(positionPerformance.positionId, positionIds))
      .orderBy(positionPerformance.positionId, desc(positionPerformance.date));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Persists the provided position performance snapshot.
   *
   * @see {@link IPositionPerformance.save}
   */
  async save(persisted: PositionPerformance): Promise<PositionPerformance> {
    if (persisted.id) {
      const [row] = await this.db
        .update(positionPerformance)
        .set(this.toUpdate(persisted))
        .where(eq(positionPerformance.id, persisted.id))
        .returning();

      if (!row) {
        throw new NotFoundError(
          `PositionPerformance with id ${persisted.id} was not found.`,
        );
      }

      return this.toEntity(row);
    }

    const [row] = await this.db
      .insert(positionPerformance)
      .values(this.toInsert(persisted))
      .returning();

    return this.toEntity(row);
  }

  /**
   * Removes the position performance with the provided id.
   *
   * @see {@link IPositionPerformance.delete}
   */
  async delete(id: EntityId): Promise<void> {
    await this.db
      .delete(positionPerformance)
      .where(eq(positionPerformance.id, id));
  }
}
