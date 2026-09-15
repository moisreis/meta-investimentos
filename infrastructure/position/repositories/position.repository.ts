import { and, eq, inArray } from "drizzle-orm"
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core"

import { Position } from "@domain/position/entities/position.entity"
import type { IPosition } from "@domain/position/interfaces/position.interface"
import { EntityId, PositiveMoney } from "@/value-objects"
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
  private toEntity(row: typeof position.$inferSelect): Position {
    return Position.create(
      {
        portfolioId: EntityId.create(row.portfolioId),
        fundId: EntityId.create(row.fundId),
        initialBalance: row.initialBalance
          ? PositiveMoney.create(row.initialBalance)
          : null,
        initialBalanceDate: row.initialBalanceDate,
        version: row.version,
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
   * Converts `PositiveMoney` to its string representation
   * for **Drizzle** insert operations.
   *
   * @explanation
   * Produces the column map required by **Drizzle** when
   * inserting a new position row.
   *
   * @param entity - The position to persist.
   * @returns The insert values.
   *
   * @example
   * const VALUES = toInsert(POSITION);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toInsert(entity: Position): typeof position.$inferInsert {
    return {
      portfolioId: entity.portfolioId,
      fundId: entity.fundId,
      initialBalance: entity.initialBalance?.value.toString() ?? null,
      initialBalanceDate: entity.initialBalanceDate,
      version: entity.version,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }

  /**
   * @summary
   * Maps a domain entity to mutable update values.
   *
   * @remarks
   * Omits `createdAt` and `updatedAt`. Bumps `version`
   * by one to enforce optimistic locking.
   *
   * @explanation
   * Produces the column map required by **Drizzle** when
   * updating an existing position row. The incremented
   * version allows the save method to detect stale writes.
   *
   * @param entity - The position to persist.
   * @returns The update values.
   *
   * @example
   * const VALUES = toUpdate(POSITION);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toUpdate(entity: Position): Partial<typeof position.$inferInsert> {
    return {
      portfolioId: entity.portfolioId,
      fundId: entity.fundId,
      initialBalance: entity.initialBalance?.value.toString() ?? null,
      initialBalanceDate: entity.initialBalanceDate,
      version: entity.version + 1,
    }
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
    const [row] = await this.db
      .select()
      .from(position)
      .where(eq(position.id, id))
      .limit(1)

    return row ? this.toEntity(row) : null
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
  async findAllByPortfolioId(portfolioId: EntityId): Promise<Position[]> {
    const rows = await this.db
      .select()
      .from(position)
      .where(eq(position.portfolioId, portfolioId))

    return rows.map((row) => this.toEntity(row))
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
  async findAllByPortfolioIds(portfolioIds: EntityId[]): Promise<Position[]> {
    if (portfolioIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(position)
      .where(inArray(position.portfolioId, portfolioIds))

    return rows.map((row) => this.toEntity(row))
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
  async findAllByFundIds(fundIds: string[]): Promise<Position[]> {
    if (fundIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(position)
      .where(inArray(position.fundId, fundIds))

    return rows.map((row) => this.toEntity(row))
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
    const [row] = await this.db
      .select()
      .from(position)
      .where(
        and(eq(position.portfolioId, portfolioId), eq(position.fundId, fundId))
      )
      .limit(1)

    return row ? this.toEntity(row) : null
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
      const [row] = await this.db
        .update(position)
        .set(this.toUpdate(persisted))
        .where(
          and(
            eq(position.id, persisted.id),
            eq(position.version, persisted.version)
          )
        )
        .returning()

      if (row) {
        return this.toEntity(row)
      }

      const [existing] = await this.db
        .select({ id: position.id })
        .from(position)
        .where(eq(position.id, persisted.id))
        .limit(1)

      if (!existing) {
        throw new NotFoundError(
          `Position with id ${persisted.id} was not found.`
        )
      }

      throw new ConcurrencyError(
        `Position with id ${persisted.id} has a stale version.`
      )
    }

    const [row] = await this.db
      .insert(position)
      .values(this.toInsert(persisted))
      .returning()

    return this.toEntity(row)
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
