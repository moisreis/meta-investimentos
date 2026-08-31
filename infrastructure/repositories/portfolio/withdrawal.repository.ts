import { and, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { Withdrawal } from "@/business/entities/portfolio/withdrawal.entity";
import type { IWithdrawal } from "@/business/interfaces/portfolio/withdrawal.interface";
import PositiveMoney from "@/business/value-objects/positive-money.vo";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";
import { withdrawal } from "@/infrastructure/database/schemas";

import type { DbClient } from "../types";

/**
 * Totals of the withdrawals of a position within a period.
 */
export interface WithdrawalTotals {
  /**
   * The sum of the withdrawal amounts, or `null` when the position had
   * no withdrawals in the period.
   */
  amount: PositiveMoney | null;

  /**
   * The sum of the withdrawal quotas, or `null` when the position had
   * no withdrawals in the period.
   */
  quotas: QuotaQuantity | null;
}

/**
 * PostgreSQL-backed implementation of the {@link IWithdrawal}
 * contract.
 *
 * Maps `withdrawal` rows to `Withdrawal` entities and back. Lookups
 * rely on the primary key and the `(position_id, date)` index, so the
 * period queries (`findAllByPositionIdInPeriod` and
 * {@link WithdrawalRepository.sumByPositionIdInPeriod}) stay on the
 * index instead of scanning the whole table.
 *
 * Amounts and quotas are stored as `numeric`, which postgres returns
 * as strings; they are hydrated into `PositiveMoney` / `QuotaQuantity`
 * value objects and persisted through their `.value.toString()`
 * representation.
 *
 * A save inserts a new row when the entity has no id and updates the
 * existing row otherwise. Updates omit `updatedAt` so the `$onUpdate`
 * hook keeps the timestamp in sync with the mutation.
 */
export class WithdrawalRepository implements IWithdrawal {
  // --------------------------------------
  // FIELDS
  // --------------------------------------

  private readonly db: DbClient;

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `WithdrawalRepository` bound to the provided database
   * client.
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
   * Maps the provided `withdrawal` row to a {@link Withdrawal} entity.
   *
   * @param row - The database row.
   * @returns The hydrated `Withdrawal` entity.
   */
  private toEntity(row: typeof withdrawal.$inferSelect): Withdrawal {
    return Withdrawal.create(
      {
        positionId: row.positionId,
        date: row.date,
        amount: PositiveMoney.create(row.amount),
        quotas: QuotaQuantity.create(row.quotas),
        reversedAt: row.reversedAt,
        reversedByUserId: row.reversedByUserId,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
      row.id,
    );
  }

  /**
   * Maps the provided entity to the insert values of the `withdrawal`
   * table.
   *
   * @param entity - The withdrawal to persist.
   * @returns The insert values.
   */
  private toInsert(entity: Withdrawal): typeof withdrawal.$inferInsert {
    return {
      positionId: entity.positionId,
      date: entity.date,
      amount: entity.amount.value.toString(),
      quotas: entity.quotas.value.toString(),
      reversedAt: entity.reversedAt,
      reversedByUserId: entity.reversedByUserId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /**
   * Maps the provided entity to the mutable update values of the
   * `withdrawal` table.
   *
   * `createdAt` and `updatedAt` are left out: `createdAt` never
   * changes and `updatedAt` is refreshed by the `$onUpdate` hook.
   *
   * @param entity - The withdrawal to persist.
   * @returns The update values.
   */
  private toUpdate(
    entity: Withdrawal,
  ): Partial<typeof withdrawal.$inferInsert> {
    return {
      positionId: entity.positionId,
      date: entity.date,
      amount: entity.amount.value.toString(),
      quotas: entity.quotas.value.toString(),
      reversedAt: entity.reversedAt,
      reversedByUserId: entity.reversedByUserId,
    };
  }

  // --------------------------------------
  // QUERY METHODS
  // --------------------------------------

  /**
   * Retrieves the withdrawal with the provided id.
   *
   * @see {@link IWithdrawal.findById}
   */
  async findById(id: string): Promise<Withdrawal | null> {
    const [row] = await this.db
      .select()
      .from(withdrawal)
      .where(eq(withdrawal.id, id))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all withdrawals belonging to the provided position id.
   *
   * @see {@link IWithdrawal.findAllByPositionId}
   */
  async findAllByPositionId(positionId: string): Promise<Withdrawal[]> {
    const rows = await this.db
      .select()
      .from(withdrawal)
      .where(eq(withdrawal.positionId, positionId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all withdrawals of the provided position whose date
   * falls within the provided period, inclusive.
   *
   * @see {@link IWithdrawal.findAllByPositionIdInPeriod}
   */
  async findAllByPositionIdInPeriod(
    positionId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Withdrawal[]> {
    const rows = await this.db
      .select()
      .from(withdrawal)
      .where(
        and(
          eq(withdrawal.positionId, positionId),
          gte(withdrawal.date, startDate),
          lte(withdrawal.date, endDate),
        ),
      );

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves the withdrawals of any of the provided position ids
   * whose date falls within the provided period, inclusive.
   *
   * Batched lookup for aggregating the withdrawals of many positions
   * in a single query instead of one query per position.
   *
   * @param positionIds - The ids of the positions to retrieve
   *   withdrawals for.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   * @returns A promise resolving to the matching `Withdrawal`
   *   entities.
   */
  async findAllByPositionIdsInPeriod(
    positionIds: string[],
    startDate: Date,
    endDate: Date,
  ): Promise<Withdrawal[]> {
    if (positionIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(withdrawal)
      .where(
        and(
          inArray(withdrawal.positionId, positionIds),
          gte(withdrawal.date, startDate),
          lte(withdrawal.date, endDate),
        ),
      );

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Sums the amounts and quotas of the withdrawals of the provided
   * position within the provided period, inclusive.
   *
   * Computing these totals through a stream of `findAllByPositionIdInPeriod`
   * calls would load every row into the application only to reduce it
   * server-side; the aggregate pushes the reduction into the database.
   *
   * @param positionId - The id of the position to total.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   * @returns A promise resolving to the period totals of the position.
   */
  async sumByPositionIdInPeriod(
    positionId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<WithdrawalTotals> {
    const [row] = await this.db
      .select({
        amount: sql<string>`sum(${withdrawal.amount})`,
        quotas: sql<string>`sum(${withdrawal.quotas})`,
      })
      .from(withdrawal)
      .where(
        and(
          eq(withdrawal.positionId, positionId),
          gte(withdrawal.date, startDate),
          lte(withdrawal.date, endDate),
        ),
      );

    return {
      amount: row.amount ? PositiveMoney.create(row.amount) : null,
      quotas: row.quotas ? QuotaQuantity.create(row.quotas) : null,
    };
  }

  // --------------------------------------
  // COMMAND METHODS
  // --------------------------------------

  /**
   * Persists the provided withdrawal.
   *
   * @see {@link IWithdrawal.save}
   */
  async save(persisted: Withdrawal): Promise<Withdrawal> {
    if (persisted.id) {
      const [row] = await this.db
        .update(withdrawal)
        .set(this.toUpdate(persisted))
        .where(eq(withdrawal.id, persisted.id))
        .returning();

      if (!row) {
        throw new Error(`Withdrawal with id ${persisted.id} was not found.`);
      }

      return this.toEntity(row);
    }

    const [row] = await this.db
      .insert(withdrawal)
      .values(this.toInsert(persisted))
      .returning();

    return this.toEntity(row);
  }

  /**
   * Removes the withdrawal with the provided id.
   *
   * @see {@link IWithdrawal.delete}
   */
  async delete(id: string): Promise<void> {
    await this.db.delete(withdrawal).where(eq(withdrawal.id, id));
  }
}
