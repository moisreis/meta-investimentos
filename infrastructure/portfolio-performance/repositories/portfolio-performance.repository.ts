import { and, desc, eq, gte, inArray, lte } from "drizzle-orm"
import type {
  PgAsyncDatabase,
  PgQueryResultHKT,
} from "drizzle-orm/pg-core"

import { PortfolioPerformance } from "@domain/portfolio-performance/entities/portfolio-performance.entity"
import type { IPortfolioPerformance } from "@domain/portfolio-performance/interfaces/portfolio-performance.interface"
import {
  EntityId,
  PositiveMoney,
  QuotaQuantity,
  SignedMoney,
  SignedPercentage,
} from "@/value-objects"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "../mappers/portfolio-performance.mapper"
import { portfolioPerformance } from "@db-schemas/portfolio-performance.schema"
import { NotFoundError } from "@errors/not-found.error"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Implements the portfolio-performance persistence contract.
 *
 * @remarks
 * Maps `portfolio_performance` rows to
 * `PortfolioPerformance` entities and back. Lookups rely on
 * the primary key and the `(portfolio_id, date)` unique
 * pair. Numeric columns are stored as `numeric` and
 * hydrated into the corresponding value objects. The batch
 * `findLatestByPortfolioIds` lookup uses `DISTINCT ON` to
 * resolve the latest snapshot of many portfolios in one
 * query.
 *
 * @explanation
 * Use this repository for all portfolio-performance data
 * access in the infrastructure layer. It translates rows
 * into domain entities and persists entity changes.
 *
 * @example
 * const PERF_REPO = new PortfolioPerformanceRepository(
 *   DB_CLIENT,
 * );
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class PortfolioPerformanceRepository implements IPortfolioPerformance {
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
   * const PERF_REPO = new PortfolioPerformanceRepository(
   *   DB_CLIENT,
   * );
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
   * Retrieves the performance snapshot with the provided id.
   *
   * @remarks
   * Returns null when no row matches the id.
   *
   * @explanation
   * Use this method to load a snapshot by its primary key.
   * Callers must handle the null result.
   *
   * @param id - The unique identifier of the snapshot.
   *
   * @returns The entity or `null`.
   *
   * @example
   * const SNAP = await PERF_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(
    id: EntityId
  ): Promise<PortfolioPerformance | null> {
    const [ROW] = await this.db
      .select()
      .from(portfolioPerformance)
      .where(eq(portfolioPerformance.id, id))
      .limit(1)

    return ROW ? ToDomain(ROW) : null
  }

  /**
   * @summary
   * Retrieves all snapshots for the provided portfolio id.
   *
   * @remarks
   * Returns an empty array when no rows match.
   *
   * @explanation
   * Use this method to load the full performance history
   * of a single portfolio.
   *
   * @param portfolioId - The portfolio to filter by.
   *
   * @returns The matching snapshots.
   *
   * @example
   * const SNAPS = await PERF_REPO
   *   .findAllByPortfolioId(PORT_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByPortfolioId(
    portfolioId: EntityId
  ): Promise<PortfolioPerformance[]> {
    const ROWS = await this.db
      .select()
      .from(portfolioPerformance)
      .where(eq(portfolioPerformance.portfolioId, portfolioId))

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Retrieves all snapshots for the provided portfolio ids.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns
   * an empty array when the input is empty.
   *
   * @explanation
   * Use this method to hydrate many performance series
   * across multiple portfolios in a single query.
   *
   * @param portfolioIds - The ids of the portfolios.
   *
   * @returns The matching snapshots.
   *
   * @example
   * const SNAPS = await PERF_REPO
   *   .findAllByPortfolioIds(PORT_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByPortfolioIds(
    portfolioIds: EntityId[]
  ): Promise<PortfolioPerformance[]> {
    if (portfolioIds.length === 0) {
      return []
    }

    const ROWS = await this.db
      .select()
      .from(portfolioPerformance)
      .where(
        inArray(portfolioPerformance.portfolioId, portfolioIds)
      )

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Retrieves the snapshot for a portfolio on a given date.
   *
   * @remarks
   * Returns null when no row matches the pair.
   *
   * @explanation
   * Use this method to load a single performance snapshot
   * by its composite `(portfolio_id, date)` key.
   *
   * @param portfolioId - The portfolio identifier.
   * @param date - The snapshot date.
   *
   * @returns The entity or `null`.
   *
   * @example
   * const SNAP = await PERF_REPO
   *   .findByPortfolioIdAndDate(PORT_ID, DATE);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findByPortfolioIdAndDate(
    portfolioId: EntityId,
    date: Date
  ): Promise<PortfolioPerformance | null> {
    const [ROW] = await this.db
      .select()
      .from(portfolioPerformance)
      .where(
        and(
          eq(portfolioPerformance.portfolioId, portfolioId),
          eq(portfolioPerformance.date, date)
        )
      )
      .limit(1)

    return ROW ? ToDomain(ROW) : null
  }

  /**
   * @summary
   * Retrieves the latest snapshot for a portfolio id.
   *
   * @remarks
   * Orders by date descending and returns the first row.
   * Returns null when no rows match.
   *
   * @explanation
   * Use this method to load the most recent performance
   * snapshot of a single portfolio.
   *
   * @param portfolioId - The portfolio identifier.
   *
   * @returns The entity or `null`.
   *
   * @example
   * const SNAP = await PERF_REPO
   *   .findLatestByPortfolioId(PORT_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findLatestByPortfolioId(
    portfolioId: EntityId
  ): Promise<PortfolioPerformance | null> {
    const [ROW] = await this.db
      .select()
      .from(portfolioPerformance)
      .where(eq(portfolioPerformance.portfolioId, portfolioId))
      .orderBy(desc(portfolioPerformance.date))
      .limit(1)

    return ROW ? ToDomain(ROW) : null
  }

  /**
   * @summary
   * Retrieves the latest snapshot for each portfolio id.
   *
   * @remarks
   * Uses `DISTINCT ON (portfolio_id)` to return the most
   * recent row per portfolio in a single query. Replaces
   * one `findLatestByPortfolioId` call per portfolio.
   *
   * @explanation
   * Use this method to hydrate the latest snapshot of many
   * portfolios without issuing one query per portfolio.
   *
   * @param portfolioIds - The ids of the portfolios.
   *
   * @returns The latest snapshot.
   *
   * @example
   * const LATEST = await PERF_REPO
   *   .findLatestByPortfolioIds(PORTFOLIO_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findLatestByPortfolioIds(
    portfolioIds: EntityId[]
  ): Promise<PortfolioPerformance[]> {
    if (portfolioIds.length === 0) {
      return []
    }

    const ROWS = await this.db
      .selectDistinctOn([portfolioPerformance.portfolioId])
      .from(portfolioPerformance)
      .where(
        inArray(portfolioPerformance.portfolioId, portfolioIds)
      )
      .orderBy(
        portfolioPerformance.portfolioId,
        desc(portfolioPerformance.date)
      )

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Retrieves the latest snapshot of each portfolio within
   * a date range.
   *
   * @remarks
   * Uses `DISTINCT ON (portfolio_id)` combined with a date
   * boundary to return the most recent row of each
   * portfolio that closes the range in a single query.
   *
   * @explanation
   * Use this method to hydrate the snapshot inside
   * `[from, to]` of many portfolios without issuing one
   * query per portfolio.
   *
   * @param portfolioIds - The ids of the portfolios.
   * @param from - The inclusive start of the range.
   * @param to - The inclusive end of the range.
   *
   * @returns The latest snapshots in the range.
   *
   * @example
   * const IN_RANGE = await PERF_REPO
   *   .findLatestByPortfolioIdsInRange(PF_IDS, FROM, TO);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async findLatestByPortfolioIdsInRange(
    portfolioIds: EntityId[],
    from: Date,
    to: Date
  ): Promise<PortfolioPerformance[]> {
    if (portfolioIds.length === 0) {
      return []
    }

    const ROWS = await this.db
      .selectDistinctOn([portfolioPerformance.portfolioId])
      .from(portfolioPerformance)
      .where(
        and(
          inArray(
            portfolioPerformance.portfolioId,
            portfolioIds
          ),
          gte(portfolioPerformance.date, from),
          lte(portfolioPerformance.date, to)
        )
      )
      .orderBy(
        portfolioPerformance.portfolioId,
        desc(portfolioPerformance.date)
      )

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Retrieves the distinct snapshot dates of the portfolios.
   *
   * @remarks
   * Uses `DISTINCT ON (date)` to return one row per day,
   * ordered ascending, in a single query. Returns an empty
   * array when the input is empty.
   *
   * @explanation
   * Use this method to build the day index that drives the
   * enabled days of the date range filter.
   *
   * @param portfolioIds - The ids of the portfolios.
   *
   * @returns The distinct snapshot dates.
   *
   * @example
   * const DATES = await PERF_REPO
   *   .findDistinctDatesByPortfolioIds(PF_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async findDistinctDatesByPortfolioIds(
    portfolioIds: EntityId[]
  ): Promise<Date[]> {
    if (portfolioIds.length === 0) {
      return []
    }

    const ROWS = await this.db
      .selectDistinctOn([portfolioPerformance.date])
      .from(portfolioPerformance)
      .where(
        inArray(portfolioPerformance.portfolioId, portfolioIds)
      )
      .orderBy(portfolioPerformance.date)

    return ROWS.map((row) => row.date)
  }

  /**
   * @summary
   * Persists the provided performance snapshot.
   *
   * @remarks
   * Inserts a new row when the entity has no id. Updates
   * the existing row otherwise. Throws `NotFoundError` when
   * the target row is missing.
   *
   * @explanation
   * Use this method to create or update a performance
   * snapshot. Returns the persisted entity with its id.
   *
   * @param persisted - The snapshot to persist.
   *
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await PERF_REPO.save(SNAPSHOT);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(
    persisted: PortfolioPerformance
  ): Promise<PortfolioPerformance> {
    if (persisted.id) {
      const [ROW] = await this.db
        .update(portfolioPerformance)
        .set(ToUpdate(persisted))
        .where(eq(portfolioPerformance.id, persisted.id))
        .returning()

      if (!ROW) {
        throw new NotFoundError(
          `PortfolioPerformance with id ${persisted.id} was not found.`
        )
      }

      return ToDomain(ROW)
    }

    const [ROW] = await this.db
      .insert(portfolioPerformance)
      .values(ToInsert(persisted))
      .returning()

    return ToDomain(ROW)
  }

  /**
   * @summary
   * Removes the snapshot with the provided id.
   *
   * @remarks
   * Resolves when the row is removed.
   *
   * @explanation
   * Use this method to delete a performance snapshot
   * by its primary key.
   *
   * @param id - The unique identifier of the snapshot.
   *
   * @example
   * await PERF_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async delete(id: EntityId): Promise<void> {
    await this.db
      .delete(portfolioPerformance)
      .where(eq(portfolioPerformance.id, id))
  }
}
