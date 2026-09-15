import { asc, eq, inArray } from "drizzle-orm"
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core"

import { Portfolio } from "@domain/portfolio/entities/portfolio.entity"
import type { IPortfolio } from "@domain/portfolio/interfaces/portfolio.interface"
import { EntityId, SignedPercentage } from "@/value-objects"
import { portfolio } from "@db-schemas/portfolio.schema"
import { NotFoundError } from "@errors/not-found.error"

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
  private toEntity(row: typeof portfolio.$inferSelect): Portfolio {
    return Portfolio.create(
      {
        acronym: row.acronym,
        name: row.name,
        userId: EntityId.create(row.userId),
        annualInterestRate: SignedPercentage.create(row.annualInterestRate),
        minAllocation: SignedPercentage.create(row.minAllocation),
        maxAllocation: SignedPercentage.create(row.maxAllocation),
        targetAllocation: SignedPercentage.create(row.targetAllocation),
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
   * Converts `SignedPercentage` values to strings for
   * **Drizzle** insert operations.
   *
   * @explanation
   * Produces the column map required by **Drizzle** when
   * inserting a new portfolio row.
   *
   * @param entity - The portfolio to persist.
   * @returns The insert values.
   *
   * @example
   * const VALUES = toInsert(PORTFOLIO);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toInsert(entity: Portfolio): typeof portfolio.$inferInsert {
    return {
      acronym: entity.acronym,
      name: entity.name,
      userId: entity.userId,
      annualInterestRate: entity.annualInterestRate.value.toString(),
      minAllocation: entity.minAllocation.value.toString(),
      maxAllocation: entity.maxAllocation.value.toString(),
      targetAllocation: entity.targetAllocation.value.toString(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }

  /**
   * @summary
   * Maps a domain entity to mutable update values.
   *
   * @remarks
   * Omits `createdAt` and `updatedAt`. The `updatedAt`
   * field is refreshed by the `$onUpdate` hook.
   *
   * @explanation
   * Produces the column map required by **Drizzle** when
   * updating an existing portfolio row.
   *
   * @param entity - The portfolio to persist.
   * @returns The update values.
   *
   * @example
   * const VALUES = toUpdate(PORTFOLIO);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toUpdate(entity: Portfolio): Partial<typeof portfolio.$inferInsert> {
    return {
      acronym: entity.acronym,
      name: entity.name,
      userId: entity.userId,
      annualInterestRate: entity.annualInterestRate.value.toString(),
      minAllocation: entity.minAllocation.value.toString(),
      maxAllocation: entity.maxAllocation.value.toString(),
      targetAllocation: entity.targetAllocation.value.toString(),
    }
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
    const [row] = await this.db
      .select()
      .from(portfolio)
      .where(eq(portfolio.id, id))
      .limit(1)

    return row ? this.toEntity(row) : null
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
    const rows = await this.db
      .select()
      .from(portfolio)
      .where(eq(portfolio.userId, userId))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves all portfolios with optional pagination.
   *
   * @remarks
   * Defaults to 100 rows when no limit is provided.
   *
   * @explanation
   * Use this method to list every portfolio, optionally
   * limited and offset for pagination.
   *
   * @param options - Optional limit and offset values.
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
    const rows = await this.db
      .select()
      .from(portfolio)
      .orderBy(asc(portfolio.createdAt))
      .limit(options?.limit ?? 100)
      .offset(options?.offset ?? 0)

    return rows.map((row) => this.toEntity(row))
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
  async findAllByIds(ids: string[]): Promise<Portfolio[]> {
    if (ids.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(portfolio)
      .where(inArray(portfolio.id, ids))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Persists the provided portfolio.
   *
   * @remarks
   * Inserts a new row when the entity has no id. Updates
   * the existing row otherwise. Throws `NotFoundError` when
   * the target row is missing.
   *
   * @explanation
   * Use this method to create or update a portfolio. Returns
   * the persisted entity with its id.
   *
   * @param persisted - The portfolio to persist.
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
      const [row] = await this.db
        .update(portfolio)
        .set(this.toUpdate(persisted))
        .where(eq(portfolio.id, persisted.id))
        .returning()

      if (!row) {
        throw new NotFoundError(
          `Portfolio with id ${persisted.id} was not found.`
        )
      }

      return this.toEntity(row)
    }

    const [row] = await this.db
      .insert(portfolio)
      .values(this.toInsert(persisted))
      .returning()

    return this.toEntity(row)
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
}
