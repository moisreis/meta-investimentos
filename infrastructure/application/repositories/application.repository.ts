import {
  and,
  asc,
  eq,
  gte,
  inArray,
  isNull,
  lte,
  sql,
} from "drizzle-orm"
import type {
  PgAsyncDatabase,
  PgQueryResultHKT,
} from "drizzle-orm/pg-core"

import { Application } from "@domain/application/entities/application.entity"
import type { IApplication } from "@domain/application/interfaces/application.interface"
import type { ApplicationTotals } from "@domain/application/interfaces/application.interface"
import {
  EntityId,
  PositiveMoney,
  QuotaQuantity,
} from "@/value-objects"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "../mappers/application.mapper"
import { application } from "@db-schemas/application.schema"
import { ConcurrencyError } from "@errors/concurrency.error"
import { NotFoundError } from "@errors/not-found.error"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

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
   *
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
    const [ROW] = await this.db
      .select()
      .from(application)
      .where(eq(application.id, id))
      .limit(1)

    return ROW ? ToDomain(ROW) : null
  }

  /**
   * @summary
   * Retrieves all applications of a position.
   *
   * @remarks
   * Rows are ordered oldest-first so **FIFO** consumption is
   * deterministic.
   *
   * @explanation
   * Use this method to load the full application history of
   * a position.
   *
   * @param positionId - The id of the position.
   *
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
  async findAllByPositionId(
    positionId: EntityId
  ): Promise<Application[]> {
    const ROWS = await this.db
      .select()
      .from(application)
      .where(eq(application.positionId, positionId))
      .orderBy(asc(application.date), asc(application.createdAt))

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Retrieves applications of a position in a period.
   *
   * @remarks
   * The period is inclusive of both dates. Rows are ordered
   * oldest-first so **FIFO** consumption is deterministic.
   *
   * @explanation
   * Use this method to list the applications of a position
   * inside a date range for processing or reporting.
   *
   * @param positionId - The id of the position.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   *
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
    const ROWS = await this.db
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

    return ROWS.map((row) => ToDomain(row))
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
   *
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
    positionIds: EntityId[],
    startDate: Date,
    endDate: Date
  ): Promise<Application[]> {
    if (positionIds.length === 0) {
      return []
    }

    const ROWS = await this.db
      .select()
      .from(application)
      .where(
        and(
          inArray(application.positionId, positionIds),
          gte(application.date, startDate),
          lte(application.date, endDate)
        )
      )
      .orderBy(asc(application.date), asc(application.createdAt))

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Retrieves all applications of the provided positions.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns an
   * empty array when no ids are provided or when none
   * match. Rows are ordered oldest-first so **FIFO**
   * consumption is deterministic.
   *
   * @explanation
   * Use this method to hydrate the full application
   * history of many positions in a single query, feeding
   * registry screens that group rows from every portfolio.
   *
   * @param positionIds - The ids of the positions.
   *
   * @returns The matching entities.
   *
   * @example
   * const APPS = await APP_REPO
   *   .findAllByPositionIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async findAllByPositionIds(
    positionIds: EntityId[]
  ): Promise<Application[]> {
    if (positionIds.length === 0) {
      return []
    }

    const ROWS = await this.db
      .select()
      .from(application)
      .where(inArray(application.positionId, positionIds))
      .orderBy(asc(application.date), asc(application.createdAt))

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Sums the amounts and quotas of a position in a period.
   *
   * @remarks
   * The period is inclusive of both dates. Reversed
   * applications are excluded from the totals. Null
   * totals mean no applications exist in the period.
   *
   * @explanation
   * Use this method to compute period totals without loading
   * every row into the application layer.
   *
   * @param positionId - The id of the position to total.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   *
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
    positionId: EntityId,
    startDate: Date,
    endDate: Date
  ): Promise<ApplicationTotals> {
    const [ROW] = await this.db
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
          isNull(application.reversedAt)
        )
      )

    return {
      amount: ROW.amount
        ? PositiveMoney.create(ROW.amount)
        : null,
      quotas: ROW.quotas
        ? QuotaQuantity.create(ROW.quotas)
        : null,
    }
  }

  /**
   * @summary
   * Persists the provided application.
   *
   * @remarks
   * Inserts a new row when the entity has no id. Updates
   * the existing row only when the persisted version
   * matches the stored version, and bumps the version.
   * Throws `ConcurrencyError` on version mismatch and
   * `NotFoundError` when the target row is missing.
   *
   * @explanation
   * Use this method to create or update an application
   * with optimistic locking. Returns the persisted entity.
   *
   * @param persisted - The application to persist.
   *
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
      const [ROW] = await this.db
        .update(application)
        .set({
          ...ToUpdate(persisted),
          version: persisted.version + 1,
        })
        .where(
          and(
            eq(application.id, persisted.id),
            eq(application.version, persisted.version)
          )
        )
        .returning()

      if (ROW) {
        return ToDomain(ROW)
      }

      const [EXISTING] = await this.db
        .select({ id: application.id })
        .from(application)
        .where(eq(application.id, persisted.id))
        .limit(1)

      if (!EXISTING) {
        throw new NotFoundError(
          `Application with id ${persisted.id} was not found.`
        )
      }

      throw new ConcurrencyError(
        `Application with id ${persisted.id} has a stale version.`
      )
    }

    const [ROW] = await this.db
      .insert(application)
      .values(ToInsert(persisted))
      .returning()

    return ToDomain(ROW)
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
    await this.db
      .delete(application)
      .where(eq(application.id, id))
  }
}
