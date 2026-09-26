import { and, asc, eq, inArray } from "drizzle-orm"
import type {
  PgAsyncDatabase,
  PgQueryResultHKT,
} from "drizzle-orm/pg-core"

import { Portfolio } from "@domain/portfolio/entities/portfolio.entity"
import type { IPortfolio } from "@domain/portfolio/interfaces/portfolio.interface"
import { EntityId, SignedPercentage } from "@/value-objects"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "../mappers/portfolio.mapper"
import { portfolio } from "@db-schemas/portfolio.schema"
import { NotFoundError } from "@errors/not-found.error"
import { ConcurrencyError } from "@errors/concurrency.error"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Implements the portfolio persistence contract.
 *
 * @remarks
 * Maps `portfolio` rows to `Portfolio` entities and back.
 * Lookups rely on the primary key and the user id index.
 * Percentage columns are stored as `numeric`, which
 * **PostgreSQL** returns as strings; they are hydrated into
 * `SignedPercentage` value objects. A save inserts a new
 * row when the entity has no id and updates the existing
 * row otherwise.
 *
 * @explanation
 * Use this repository for all portfolio data access in the
 * infrastructure layer. It translates rows into domain
 * entities and persists entity changes. Updates omit
 * `updatedAt` so the `$onUpdate` hook keeps the timestamp
 * in sync with the mutation.
 *
 * @example
 * const PORTFOLIO_REPO = new PortfolioRepository(
 *   DB_CLIENT,
 * );
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class PortfolioRepository implements IPortfolio {
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
   * const PORTFOLIO_REPO = new PortfolioRepository(
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
   * Retrieves the portfolio with the provided id.
   *
   * @remarks
   * Returns null when no row matches the id.
   *
   * @explanation
   * Use this method to load a portfolio by its primary key.
   * Callers must handle the null result.
   *
   * @param id - The unique identifier of the portfolio.
   *
   * @returns The entity or `null`.
   *
   * @example
   * const PORTFOLIO = await PORTFOLIO_REPO
   *   .findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(id: EntityId): Promise<Portfolio | null> {
    const [ROW] = await this.db
      .select()
      .from(portfolio)
      .where(eq(portfolio.id, id))
      .limit(1)

    return ROW ? ToDomain(ROW) : null
  }

  /**
   * @summary
   * Retrieves all portfolios for the provided user id.
   *
   * @remarks
   * Returns an empty array when no rows match.
   *
   * @explanation
   * Use this method to load every portfolio that belongs
   * to a single user.
   *
   * @param userId - The user to filter by.
   *
   * @returns The matching portfolios.
   *
   * @example
   * const PORTS = await PORTFOLIO_REPO
   *   .findAllByUserId(USER_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByUserId(userId: EntityId): Promise<Portfolio[]> {
    const ROWS = await this.db
      .select()
      .from(portfolio)
      .where(eq(portfolio.userId, userId))

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Retrieves all portfolios with optional pagination.
   *
   * @remarks
   * Every row is returned unless `limit` is provided.
   *
   * @explanation
   * Use this method to list every portfolio, optionally
   * limited and offset for pagination.
   *
   * @param options - Optional limit and offset values.
   *
   * @returns The matching portfolios.
   *
   * @example
   * const PORTS = await PORTFOLIO_REPO.findAll();
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAll(options?: {
    limit?: number
    offset?: number
  }): Promise<Portfolio[]> {
    const QUERY = this.db
      .select()
      .from(portfolio)
      .orderBy(asc(portfolio.createdAt))

    // Returns every row unless the caller asks for a
    // window. A paginated caller must always set limit,
    // because offset is only valid alongside it.
    const ROWS =
      options?.limit === undefined
        ? await QUERY
        : await QUERY.limit(options.limit).offset(
            options.offset ?? 0
          )

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Retrieves all portfolios with any of the provided ids.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns
   * an empty array when the input is empty.
   *
   * @explanation
   * Use this method to hydrate many portfolios in one
   * query instead of one query per id.
   *
   * @param ids - The ids of the portfolios to retrieve.
   *
   * @returns The matching portfolios.
   *
   * @example
   * const PORTS = await PORTFOLIO_REPO
   *   .findAllByIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByIds(ids: EntityId[]): Promise<Portfolio[]> {
    if (ids.length === 0) {
      return []
    }

    const ROWS = await this.db
      .select()
      .from(portfolio)
      .where(inArray(portfolio.id, ids))

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Persists the provided portfolio.
   *
   * @remarks
   * Inserts a new row when the entity has no id. Updates
   * the existing row only when the persisted version
   * matches the stored version, and bumps the version.
   * Throws `ConcurrencyError` on version mismatch and
   * `NotFoundError` when the target row is missing.
   *
   * @explanation
   * Use this method to create or update a portfolio with
   * optimistic locking. Returns the persisted entity.
   *
   * @param persisted - The portfolio to persist.
   *
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await PORTFOLIO_REPO
   *   .save(PORTFOLIO);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(persisted: Portfolio): Promise<Portfolio> {
    if (persisted.id) {
      const [ROW] = await this.db
        .update(portfolio)
        .set({
          ...ToUpdate(persisted),
          version: persisted.version + 1,
        })
        .where(
          and(
            eq(portfolio.id, persisted.id),
            eq(portfolio.version, persisted.version)
          )
        )
        .returning()

      if (ROW) {
        return ToDomain(ROW)
      }

      const [EXISTING] = await this.db
        .select({ id: portfolio.id })
        .from(portfolio)
        .where(eq(portfolio.id, persisted.id))
        .limit(1)

      if (!EXISTING) {
        throw new NotFoundError(
          `Portfolio with id ${persisted.id} was not found.`
        )
      }

      throw new ConcurrencyError(
        `Portfolio with id ${persisted.id} has a stale version.`
      )
    }

    const [ROW] = await this.db
      .insert(portfolio)
      .values(ToInsert(persisted))
      .returning()

    return ToDomain(ROW)
  }

  /**
   * @summary
   * Removes the portfolio with the provided id.
   *
   * @remarks
   * Resolves when the row is removed.
   *
   * @explanation
   * Use this method to delete a portfolio by its
   * primary key.
   *
   * @param id - The unique identifier of the portfolio.
   *
   * @example
   * await PORTFOLIO_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(portfolio).where(eq(portfolio.id, id))
  }

  /**
   * @summary
   * Removes the portfolios with the provided ids.
   *
   * @remarks
   * A batched delete avoids an N+1 query pattern. Resolves
   * when the rows are removed; a no-op for an empty input.
   *
   * @explanation
   * Use this method to delete many portfolios in one query.
   *
   * @param ids - The ids of the portfolios to remove.
   *
   * @example
   * await PORTFOLIO_REPO.deleteByIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-22
   */
  async deleteByIds(ids: EntityId[]): Promise<void> {
    if (ids.length === 0) {
      return
    }

    await this.db
      .delete(portfolio)
      .where(inArray(portfolio.id, ids))
  }
}
