import { and, eq, gte, inArray, lte, sql } from "drizzle-orm";

import { Application } from "@/business/entities/portfolio/application.entity";
import type { IApplication } from "@/business/interfaces/portfolio/application.interface";
import PositiveMoney from "@/business/value-objects/positive-money.vo";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";
import { application } from "@/infrastructure/database/schemas";

import type { DbClient } from "../types";

/**
 * Totals of the applications of a position within a period.
 */
export interface ApplicationTotals {
  /**
   * The sum of the application amounts, or `null` when the position
   * had no applications in the period.
   */
  amount: PositiveMoney | null;

  /**
   * The sum of the application quotas, or `null` when the position had
   * no applications in the period.
   */
  quotas: QuotaQuantity | null;
}

/**
 * PostgreSQL-backed implementation of the {@link IApplication}
 * contract.
 *
 * Maps `application` rows to `Application` entities and back. Lookups
 * rely on the primary key and the `(position_id, date)` index, so the
 * period queries (`findAllByPositionIdInPeriod` and
 * {@link ApplicationRepository.sumByPositionIdInPeriod}) stay on the
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
export class ApplicationRepository implements IApplication {
  // --------------------------------------
  // FIELDS
  // --------------------------------------

  private readonly db: DbClient;

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates an `ApplicationRepository` bound to the provided database
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
   * Maps the provided `application` row to an {@link Application}
   * entity.
   *
   * @param row - The database row.
   * @returns The hydrated `Application` entity.
   */
  private toEntity(row: typeof application.$inferSelect): Application {
    return Application.create(
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
   * Maps the provided entity to the insert values of the `application`
   * table.
   *
   * @param entity - The application to persist.
   * @returns The insert values.
   */
  private toInsert(entity: Application): typeof application.$inferInsert {
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
   * `application` table.
   *
   * `createdAt` and `updatedAt` are left out: `createdAt` never
   * changes and `updatedAt` is refreshed by the `$onUpdate` hook.
   *
   * @param entity - The application to persist.
   * @returns The update values.
   */
  private toUpdate(
    entity: Application,
  ): Partial<typeof application.$inferInsert> {
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
   * Retrieves the application with the provided id.
   *
   * @see {@link IApplication.findById}
   */
  async findById(id: string): Promise<Application | null> {
    const [row] = await this.db
      .select()
      .from(application)
      .where(eq(application.id, id))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all applications belonging to the provided position id.
   *
   * @see {@link IApplication.findAllByPositionId}
   */
  async findAllByPositionId(positionId: string): Promise<Application[]> {
    const rows = await this.db
      .select()
      .from(application)
      .where(eq(application.positionId, positionId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all applications of the provided position whose date
   * falls within the provided period, inclusive.
   *
   * @see {@link IApplication.findAllByPositionIdInPeriod}
   */
  async findAllByPositionIdInPeriod(
    positionId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Application[]> {
    const rows = await this.db
      .select()
      .from(application)
      .where(
        and(
          eq(application.positionId, positionId),
          gte(application.date, startDate),
          lte(application.date, endDate),
        ),
      );

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves the applications of any of the provided position ids
   * whose date falls within the provided period, inclusive.
   *
   * Batched lookup for aggregating the applications of many positions
   * in a single query instead of one query per position.
   *
   * @param positionIds - The ids of the positions to retrieve
   *   applications for.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   * @returns A promise resolving to the matching `Application`
   *   entities.
   */
  async findAllByPositionIdsInPeriod(
    positionIds: string[],
    startDate: Date,
    endDate: Date,
  ): Promise<Application[]> {
    if (positionIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(application)
      .where(
        and(
          inArray(application.positionId, positionIds),
          gte(application.date, startDate),
          lte(application.date, endDate),
        ),
      );

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Sums the amounts and quotas of the applications of the provided
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
  ): Promise<ApplicationTotals> {
    const [row] = await this.db
      .select({
        amount: sql<string>`sum(${application.amount})`,
        quotas: sql<string>`sum(${application.quotas})`,
      })
      .from(application)
      .where(
        and(
          eq(application.positionId, positionId),
          gte(application.date, startDate),
          lte(application.date, endDate),
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
   * Persists the provided application.
   *
   * @see {@link IApplication.save}
   */
  async save(persisted: Application): Promise<Application> {
    if (persisted.id) {
      const [row] = await this.db
        .update(application)
        .set(this.toUpdate(persisted))
        .where(eq(application.id, persisted.id))
        .returning();

      if (!row) {
        throw new Error(`Application with id ${persisted.id} was not found.`);
      }

      return this.toEntity(row);
    }

    const [row] = await this.db
      .insert(application)
      .values(this.toInsert(persisted))
      .returning();

    return this.toEntity(row);
  }

  /**
   * Removes the application with the provided id.
   *
   * @see {@link IApplication.delete}
   */
  async delete(id: string): Promise<void> {
    await this.db.delete(application).where(eq(application.id, id));
  }
}
