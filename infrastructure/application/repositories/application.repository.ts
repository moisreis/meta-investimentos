import { and, asc, eq, gte, inArray, lte, sql } from "drizzle-orm"
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core"

import { Application } from "@domain/application/entities/application.entity"
import type { IApplication } from "@domain/application/interfaces/application.interface"
import { EntityId, PositiveMoney, QuotaQuantity } from "@/value-objects"
import { application } from "@db-schemas/application.schema"
import { NotFoundError } from "@errors/not-found.error"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Holds the aggregate totals of a position period.
 *
 * @remarks
 * Amounts and quotas are value objects. They are null
 * when no transaction exists in the period.
 *
 * @explanation
 * Use this shape to return the summed applications of a
 * position within a date range.
 *
 * @example
 * const TOTALS = { amount: null, quotas: null };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface ApplicationTotals {
  // Sum of application amounts, or `null` when none.
  amount: PositiveMoney | null

  // Sum of application quotas, or `null` when none.
  quotas: QuotaQuantity | null
}

/**
 * @summary
 * Implements the application persistence contract.
 *
 * @remarks
 * Maps `application` rows to `Application` entities and
 * back. Lookups rely on the primary key and the
 * `(position_id, date)` index.
 *
 * @explanation
 * Use this repository for all application data access in
 * the infrastructure layer. It translates rows into domain
 * entities and persists entity changes.
 *
 * @example
 * const REPO = new ApplicationRepository(DB_CLIENT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class ApplicationRepository implements IApplication {
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
   * const REPO = new ApplicationRepository(DB_CLIENT);
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
  private toEntity(row: typeof application.$inferSelect): Application {
    return Application.create(
      {
        positionId: EntityId.create(row.positionId),
        date: row.date,
        amount: PositiveMoney.create(row.amount),
        quotas: QuotaQuantity.create(row.quotas),
        reversedAt: row.reversedAt,
        reversedByUserId: row.reversedByUserId
          ? EntityId.create(row.reversedByUserId)
          : null,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
      row.id
    )
  }

  /**
   * @summary
   * Maps a domain entity to insert values.
   *
   * @remarks
   * Serializes value objects to their database
   * representation.
   *
   * @explanation
   * Converts an entity into the shape expected by
   * **Drizzle** insert operations.
   *
   * @param entity - The entity to serialize.
   * @returns The insert values.
   *
   * @example
   * const VALUES = toInsert(ENTITY);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
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
    }
  }

  /**
   * @summary
   * Maps a domain entity to update values.
   *
   * @remarks
   * Omits `createdAt` and `updatedAt`. The first never
   * changes; the second refreshes via `$onUpdate`.
   *
   * @explanation
   * Converts an entity into the shape expected by
   * **Drizzle** update operations.
   *
   * @param entity - The entity to serialize.
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
    entity: Application
  ): Partial<typeof application.$inferInsert> {
    return {
      positionId: entity.positionId,
      date: entity.date,
      amount: entity.amount.value.toString(),
      quotas: entity.quotas.value.toString(),
      reversedAt: entity.reversedAt,
      reversedByUserId: entity.reversedByUserId,
    }
  }

  /**
   * @summary
   * Retrieves the application with the provided id.
   *
   * @remarks
   * Returns `null` when no row matches the id.
   *
   * @explanation
   * Use this method to load an application by its primary
   * key. Callers must handle the null result.
   *
   * @param id - The unique identifier of the application.
   * @returns The entity or `null`.
   *
   * @example
   * const APP = await APP_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(id: EntityId): Promise<Application | null> {
    const [row] = await this.db
      .select()
      .from(application)
      .where(eq(application.id, id))
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  /**
   * @summary
   * Retrieves all applications of a position.
   *
   * @remarks
   * Rows are ordered oldest-first so FIFO consumption is
   * deterministic.
   *
   * @explanation
   * Use this method to load the full application history of
   * a position.
   *
   * @param positionId - The id of the position.
   * @returns The matching entities.
   *
   * @example
   * const APPS = await APP_REPO
   *   .findAllByPositionId(POSITION_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByPositionId(positionId: EntityId): Promise<Application[]> {
    const rows = await this.db
      .select()
      .from(application)
      .where(eq(application.positionId, positionId))
      .orderBy(asc(application.date), asc(application.createdAt))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves applications of a position in a period.
   *
   * @remarks
   * The period is inclusive of both dates. Rows are ordered
   * oldest-first so FIFO consumption is deterministic.
   *
   * @explanation
   * Use this method to list the applications of a position
   * inside a date range for processing or reporting.
   *
   * @param positionId - The id of the position.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   * @returns The matching entities.
   *
   * @example
   * const APPS = await APP_REPO
   *   .findAllByPositionIdInPeriod(ID, START, END);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByPositionIdInPeriod(
    positionId: EntityId,
    startDate: Date,
    endDate: Date
  ): Promise<Application[]> {
    const rows = await this.db
      .select()
      .from(application)
      .where(
        and(
          eq(application.positionId, positionId),
          gte(application.date, startDate),
          lte(application.date, endDate)
        )
      )
      .orderBy(asc(application.date), asc(application.createdAt))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves applications of multiple positions in a period.
   *
   * @remarks
   * The period is inclusive of both dates. Batched lookup
   * avoids an N+1 query pattern. Returns an empty array
   * when no ids match.
   *
   * @explanation
   * Use this method to hydrate applications across many
   * positions in one query instead of one per position.
   *
   * @param positionIds - The ids of the positions.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   * @returns The matching entities.
   *
   * @example
   * const APPS = await APP_REPO
   *   .findAllByPositionIdsInPeriod(IDS, START, END);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByPositionIdsInPeriod(
    positionIds: string[],
    startDate: Date,
    endDate: Date
  ): Promise<Application[]> {
    if (positionIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(application)
      .where(
        and(
          inArray(application.positionId, positionIds),
          gte(application.date, startDate),
          lte(application.date, endDate)
        )
      )

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Sums the amounts and quotas of a position in a period.
   *
   * @remarks
   * The period is inclusive of both dates. Null totals mean
   * no applications exist in the period.
   *
   * @explanation
   * Use this method to compute period totals without loading
   * every row into the application layer.
   *
   * @param positionId - The id of the position to total.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   * @returns The position totals.
   *
   * @example
   * const TOTALS = await APP_REPO
   *   .sumByPositionIdInPeriod(ID, START, END);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async sumByPositionIdInPeriod(
    positionId: string,
    startDate: Date,
    endDate: Date
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
          lte(application.date, endDate)
        )
      )

    return {
      amount: row.amount ? PositiveMoney.create(row.amount) : null,
      quotas: row.quotas ? QuotaQuantity.create(row.quotas) : null,
    }
  }

  /**
   * @summary
   * Persists the provided application.
   *
   * @remarks
   * Inserts a new row when the entity has no id. Updates
   * the existing row otherwise.
   *
   * @explanation
   * Use this method to create or update an application.
   * Returns the persisted entity with its id.
   *
   * @param persisted - The application to persist.
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await APP_REPO.save(APP);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(persisted: Application): Promise<Application> {
    if (persisted.id) {
      const [row] = await this.db
        .update(application)
        .set(this.toUpdate(persisted))
        .where(eq(application.id, persisted.id))
        .returning()

      if (!row) {
        throw new NotFoundError(
          `Application with id ${persisted.id} was not found.`
        )
      }

      return this.toEntity(row)
    }

    const [row] = await this.db
      .insert(application)
      .values(this.toInsert(persisted))
      .returning()

    return this.toEntity(row)
  }

  /**
   * @summary
   * Removes the application with the provided id.
   *
   * @remarks
   * Resolves when the row is removed.
   *
   * @explanation
   * Use this method to delete an application by its
   * primary key.
   *
   * @param id - The unique identifier of the application.
   *
   * @example
   * await APP_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(application).where(eq(application.id, id))
  }
}
