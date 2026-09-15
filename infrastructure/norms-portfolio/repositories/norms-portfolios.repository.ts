import { and, eq, inArray } from "drizzle-orm"
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core"

import { NormsPortfolios } from "@domain/norms-portfolio/entities/norms-portfolios.entity"
import type { INormsPortfolios } from "@domain/norms-portfolio/interfaces/norms-portfolios.interface"
import { EntityId, SignedPercentage } from "@/value-objects"
import { normsPortfolios } from "@db-schemas/norms-portfolios.schema"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Implements the norms-portfolios persistence contract.
 *
 * @remarks
 * Maps `norms_portfolios` rows to `NormsPortfolios`
 * entities and back. The table has no surrogate id; the
 * composite `(normId, portfolioId)` primary key identifies
 * each relation. Lookups and mutations are keyed on that
 * pair. There is no update mapper; only `toEntity` and
 * `toValues` are used. Percentage columns are stored as
 * `numeric` and hydrated into `SignedPercentage` value
 * objects.
 *
 * @explanation
 * Use this repository for all norms-portfolios data access.
 * Because the composite key carries identity, the `save`
 * method upserts via `onConflictDoUpdate`.
 *
 * @example
 * const NORMS_REPO = new NormsPortfoliosRepository(
 *   DB_CLIENT,
 * );
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class NormsPortfoliosRepository implements INormsPortfolios {
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
   * const NORMS_REPO = new NormsPortfoliosRepository(
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
  private toEntity(row: typeof normsPortfolios.$inferSelect): NormsPortfolios {
    return NormsPortfolios.create({
      normId: EntityId.create(row.normId),
      portfolioId: EntityId.create(row.portfolioId),
      minAllocation: SignedPercentage.create(row.minAllocation),
      maxAllocation: SignedPercentage.create(row.maxAllocation),
      targetAllocation: SignedPercentage.create(row.targetAllocation),
      createdAt: row.createdAt,
    })
  }

  /**
   * @summary
   * Maps a domain entity to persistence values.
   *
   * @remarks
   * Converts `SignedPercentage` values to strings for
   * **Drizzle** insert operations.
   *
   * @explanation
   * Produces the column map required by **Drizzle** when
   * inserting or upserting a norms-portfolios row.
   *
   * @param entity - The relation to persist.
   * @returns The persistence values.
   *
   * @example
   * const VALUES = toValues(RELATION);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toValues(
    entity: NormsPortfolios
  ): typeof normsPortfolios.$inferInsert {
    return {
      normId: entity.normId,
      portfolioId: entity.portfolioId,
      minAllocation: entity.minAllocation.value.toString(),
      maxAllocation: entity.maxAllocation.value.toString(),
      targetAllocation: entity.targetAllocation.value.toString(),
      createdAt: entity.createdAt,
    }
  }

  /**
   * @summary
   * Retrieves the relation for the provided ids.
   *
   * @remarks
   * Returns null when no row matches the pair.
   *
   * @explanation
   * Use this method to load a single relation by its
   * composite key. Callers must handle the null result.
   *
   * @param normId - The norm identifier.
   * @param portfolioId - The portfolio identifier.
   * @returns The entity or `null`.
   *
   * @example
   * const REL = await NORMS_REPO
   *   .findByNormIdAndPortfolioId(NORM_ID, PORT_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findByNormIdAndPortfolioId(
    normId: EntityId,
    portfolioId: EntityId
  ): Promise<NormsPortfolios | null> {
    const [row] = await this.db
      .select()
      .from(normsPortfolios)
      .where(
        and(
          eq(normsPortfolios.normId, normId),
          eq(normsPortfolios.portfolioId, portfolioId)
        )
      )
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  /**
   * @summary
   * Retrieves all relations for the provided portfolio id.
   *
   * @remarks
   * Returns an empty array when no rows match.
   *
   * @explanation
   * Use this method to load every norm relation that
   * belongs to a single portfolio.
   *
   * @param portfolioId - The portfolio to filter by.
   * @returns The matching relations.
   *
   * @example
   * const RELS = await NORMS_REPO
   *   .findAllByPortfolioId(PORT_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByPortfolioId(
    portfolioId: EntityId
  ): Promise<NormsPortfolios[]> {
    const rows = await this.db
      .select()
      .from(normsPortfolios)
      .where(eq(normsPortfolios.portfolioId, portfolioId))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves all relations for the provided portfolio ids.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns
   * an empty array when the input is empty.
   *
   * @explanation
   * Use this method to hydrate many norm relations across
   * multiple portfolios in a single query.
   *
   * @param portfolioIds - The ids of the portfolios.
   * @returns The matching relations.
   *
   * @example
   * const RELS = await NORMS_REPO
   *   .findAllByPortfolioIds(PORT_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByPortfolioIds(
    portfolioIds: string[]
  ): Promise<NormsPortfolios[]> {
    if (portfolioIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(normsPortfolios)
      .where(inArray(normsPortfolios.portfolioId, portfolioIds))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves all relations for the provided norm id.
   *
   * @remarks
   * Returns an empty array when no rows match.
   *
   * @explanation
   * Use this method to load every portfolio relation that
   * belongs to a single norm.
   *
   * @param normId - The norm to filter by.
   * @returns The matching relations.
   *
   * @example
   * const RELS = await NORMS_REPO
   *   .findAllByNormId(NORM_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByNormId(normId: EntityId): Promise<NormsPortfolios[]> {
    const rows = await this.db
      .select()
      .from(normsPortfolios)
      .where(eq(normsPortfolios.normId, normId))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Upserts the provided norms-portfolios relation.
   *
   * @remarks
   * The composite `(normId, portfolioId)` key carries
   * identity. An existing pair is updated in place via
   * `onConflictDoUpdate`; otherwise a new relation is
   * inserted.
   *
   * @explanation
   * Use this method to create or update a norms-portfolios
   * relation. Returns the persisted entity.
   *
   * @param persisted - The relation to persist.
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await NORMS_REPO.save(RELATION);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(persisted: NormsPortfolios): Promise<NormsPortfolios> {
    const [row] = await this.db
      .insert(normsPortfolios)
      .values(this.toValues(persisted))
      .onConflictDoUpdate({
        target: [normsPortfolios.normId, normsPortfolios.portfolioId],
        set: {
          minAllocation: persisted.minAllocation.value.toString(),
          maxAllocation: persisted.maxAllocation.value.toString(),
          targetAllocation: persisted.targetAllocation.value.toString(),
        },
      })
      .returning()

    return this.toEntity(row)
  }

  /**
   * @summary
   * Removes the relation for the provided ids.
   *
   * @remarks
   * Resolves when the row is removed.
   *
   * @explanation
   * Use this method to delete a norms-portfolios relation
   * by its composite key.
   *
   * @param normId - The norm identifier.
   * @param portfolioId - The portfolio identifier.
   *
   * @example
   * await NORMS_REPO.delete(NORM_ID, PORT_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async delete(normId: EntityId, portfolioId: EntityId): Promise<void> {
    await this.db
      .delete(normsPortfolios)
      .where(
        and(
          eq(normsPortfolios.normId, normId),
          eq(normsPortfolios.portfolioId, portfolioId)
        )
      )
  }
}
