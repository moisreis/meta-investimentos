import { and, eq, inArray, sql } from "drizzle-orm"
import type {
  PgAsyncDatabase,
  PgQueryResultHKT,
} from "drizzle-orm/pg-core"

import { Position } from "@domain/position/entities/position.entity"
import type {
  FundRowCount,
  IPosition,
  PortfolioRowCount,
} from "@domain/position/interfaces/position.interface"
import { EntityId, PositiveMoney } from "@/value-objects"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "../mappers/position.mapper"
import { position } from "@db-schemas/position.schema"
import { ConcurrencyError } from "@errors/concurrency.error"
import { NotFoundError } from "@errors/not-found.error"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Implements the position persistence contract.
 *
 * @remarks
 * Maps `position` rows to `Position` entities and back.
 * Lookups rely on the primary key, the portfolio index,
 * and the unique `(portfolio_id, fund_id)` pair. The
 * `initialBalance` column is stored as `numeric` and
 * hydrated into a `PositiveMoney` value object. Updates
 * use optimistic locking: the update only applies when
 * the persisted version matches the stored one, and the
 * version is bumped on success.
 *
 * @explanation
 * Use this repository for all position data access in the
 * infrastructure layer. It translates rows into domain
 * entities and persists entity changes. Updates omit
 * `updatedAt` so the `$onUpdate` hook keeps the timestamp
 * in sync with the mutation.
 *
 * @example
 * const POSITION_REPO = new PositionRepository(
 *   DB_CLIENT,
 * );
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class PositionRepository implements IPosition {
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
   * const POSITION_REPO = new PositionRepository(
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
   * Retrieves the position with the provided id.
   *
   * @remarks
   * Returns null when no row matches the id.
   *
   * @explanation
   * Use this method to load a position by its primary key.
   * Callers must handle the null result.
   *
   * @param id - The unique identifier of the position.
   *
   * @returns The entity or `null`.
   *
   * @example
   * const POS = await POSITION_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(id: EntityId): Promise<Position | null> {
    const [ROW] = await this.db
      .select()
      .from(position)
      .where(eq(position.id, id))
      .limit(1)

    return ROW ? ToDomain(ROW) : null
  }

  /**
   * @summary
   * Retrieves all positions for the provided portfolio id.
   *
   * @remarks
   * Returns an empty array when no rows match.
   *
   * @explanation
   * Use this method to load every position that belongs
   * to a single portfolio.
   *
   * @param portfolioId - The portfolio to filter by.
   *
   * @returns The matching positions.
   *
   * @example
   * const POSITIONS = await POSITION_REPO
   *   .findAllByPortfolioId(PORT_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByPortfolioId(
    portfolioId: EntityId
  ): Promise<Position[]> {
    const ROWS = await this.db
      .select()
      .from(position)
      .where(eq(position.portfolioId, portfolioId))

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Retrieves all positions for the provided portfolio ids.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns
   * an empty array when the input is empty.
   *
   * @explanation
   * Use this method to hydrate many positions across
   * multiple portfolios in a single query.
   *
   * @param portfolioIds - The ids of the portfolios.
   *
   * @returns The matching positions.
   *
   * @example
   * const POSITIONS = await POSITION_REPO
   *   .findAllByPortfolioIds(PORT_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByPortfolioIds(
    portfolioIds: EntityId[]
  ): Promise<Position[]> {
    if (portfolioIds.length === 0) {
      return []
    }

    const ROWS = await this.db
      .select()
      .from(position)
      .where(inArray(position.portfolioId, portfolioIds))

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Counts the position rows held per provided portfolio.
   *
   * @remarks
   * Runs a grouped query so no rows are hydrated. Returns
   * an empty array when the input is empty. Because the
   * `(portfolio, fund)` pair is unique, the count equals
   * the number of distinct funds held by the portfolio.
   *
   * @explanation
   * Use this method to tally positions across many
   * portfolios in a single aggregated query.
   *
   * @param portfolioIds - The ids of the portfolios.
   *
   * @returns The count per portfolio.
   *
   * @example
   * const COUNTS = await POSITION_REPO
   *   .countByPortfolioIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async countByPortfolioIds(
    portfolioIds: EntityId[]
  ): Promise<PortfolioRowCount[]> {
    if (portfolioIds.length === 0) {
      return []
    }

    const ROWS = await this.db
      .select({
        portfolioId: position.portfolioId,
        count: sql<number>`count(*)::int`,
      })
      .from(position)
      .where(inArray(position.portfolioId, portfolioIds))
      .groupBy(position.portfolioId)
      .orderBy(position.portfolioId)

    return ROWS.map((row) => ({
      portfolioId: EntityId.create(row.portfolioId),
      count: row.count,
    }))
  }

  /**
   * @summary
   * Counts the position rows held per provided fund.
   *
   * @remarks
   * Runs a grouped query so no rows are hydrated.
   * Returns an empty array when the input is empty.
   * Because the `(portfolio, fund)` pair is unique,
   * the count equals the number of portfolios that
   * hold the fund.
   *
   * @explanation
   * Use this method to tally positions across many
   * funds in a single aggregated query.
   *
   * @param fundIds - The ids of the funds.
   *
   * @returns The count per fund.
   *
   * @example
   * const COUNTS = await POSITION_REPO
   *   .countByFundIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async countByFundIds(
    fundIds: EntityId[]
  ): Promise<FundRowCount[]> {
    if (fundIds.length === 0) {
      return []
    }

    const ROWS = await this.db
      .select({
        fundId: position.fundId,
        count: sql<number>`count(*)::int`,
      })
      .from(position)
      .where(inArray(position.fundId, fundIds))
      .groupBy(position.fundId)
      .orderBy(position.fundId)

    return ROWS.map((row) => ({
      fundId: EntityId.create(row.fundId),
      count: row.count,
    }))
  }

  /**
   * @summary
   * Retrieves all positions holding any of the provided funds.
   *
   * @remarks
   * Returns an empty array when the input is empty.
   *
   * @explanation
   * Use this method to find every position that holds one
   * of the given fund ids, across all portfolios.
   *
   * @param fundIds - The fund ids to search for.
   *
   * @returns The matching positions.
   *
   * @example
   * const POSITIONS = await POSITION_REPO
   *   .findAllByFundIds(FUND_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByFundIds(
    fundIds: EntityId[]
  ): Promise<Position[]> {
    if (fundIds.length === 0) {
      return []
    }

    const ROWS = await this.db
      .select()
      .from(position)
      .where(inArray(position.fundId, fundIds))

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Retrieves the position for a fund in a portfolio.
   *
   * @remarks
   * Returns null when no row matches the pair.
   *
   * @explanation
   * Use this method to load a single position by its
   * composite `(portfolio_id, fund_id)` key.
   *
   * @param portfolioId - The portfolio identifier.
   * @param fundId - The fund identifier.
   *
   * @returns The entity or `null`.
   *
   * @example
   * const POS = await POSITION_REPO
   *   .findByPortfolioIdAndFundId(PORT_ID, FUND_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findByPortfolioIdAndFundId(
    portfolioId: EntityId,
    fundId: EntityId
  ): Promise<Position | null> {
    const [ROW] = await this.db
      .select()
      .from(position)
      .where(
        and(
          eq(position.portfolioId, portfolioId),
          eq(position.fundId, fundId)
        )
      )
      .limit(1)

    return ROW ? ToDomain(ROW) : null
  }

  /**
   * @summary
   * Persists the provided position.
   *
   * @remarks
   * Inserts a new row when the entity has no id. Updates
   * the existing row only when the persisted version
   * matches the stored version, and bumps the version.
   * Throws `ConcurrencyError` on version mismatch and
   * `NotFoundError` when the target row is missing.
   *
   * @explanation
   * Use this method to create or update a position with
   * optimistic locking. Returns the persisted entity.
   *
   * @param persisted - The position to persist.
   *
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await POSITION_REPO
   *   .save(POSITION);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(persisted: Position): Promise<Position> {
    if (persisted.id) {
      const [ROW] = await this.db
        .update(position)
        .set({
          ...ToUpdate(persisted),
          version: persisted.version + 1,
        })
        .where(
          and(
            eq(position.id, persisted.id),
            eq(position.version, persisted.version)
          )
        )
        .returning()

      if (ROW) {
        return ToDomain(ROW)
      }

      const [EXISTING] = await this.db
        .select({ id: position.id })
        .from(position)
        .where(eq(position.id, persisted.id))
        .limit(1)

      if (!EXISTING) {
        throw new NotFoundError(
          `Position with id ${persisted.id} was not found.`
        )
      }

      throw new ConcurrencyError(
        `Position with id ${persisted.id} has a stale version.`
      )
    }

    const [ROW] = await this.db
      .insert(position)
      .values(ToInsert(persisted))
      .returning()

    return ToDomain(ROW)
  }

  /**
   * @summary
   * Removes the position with the provided id.
   *
   * @remarks
   * Resolves when the row is removed.
   *
   * @explanation
   * Use this method to delete a position by its
   * primary key.
   *
   * @param id - The unique identifier of the position.
   *
   * @example
   * await POSITION_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(position).where(eq(position.id, id))
  }
}
