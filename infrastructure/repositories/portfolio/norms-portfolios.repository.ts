import { and, eq, inArray } from "drizzle-orm";

import { NormsPortfolios } from "@/business/entities/portfolio/norms-portfolios.entity";
import type { INormsPortfolios } from "@/business/interfaces/portfolio/norms-portfolios.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import { normsPortfolios } from "@/infrastructure/database/schemas";

import type { DbClient } from "../types";

/**
 * PostgreSQL-backed implementation of the {@link INormsPortfolios}
 * contract.
 *
 * Maps `norms_portfolios` rows to `NormsPortfolios` entities and back.
 * The table has no surrogate id: the composite `(normId, portfolioId)`
 * primary key identifies a relation, so lookups and mutations are keyed
 * on that pair.
 *
 * Because there is no id to distinguish an insert from an update,
 * {@link NormsPortfoliosRepository.save} upserts the row through a
 * conflict handler on the composite key.
 *
 * Percentage columns are stored as `numeric`, which postgres returns
 * as strings; they are hydrated into `SignedPercentage` value objects
 * and persisted through their `.value.toString()` representation.
 */
export class NormsPortfoliosRepository implements INormsPortfolios {
  private readonly db: DbClient;

  /**
   * Creates a `NormsPortfoliosRepository` bound to the provided
   * database client.
   *
   * @param db - The database client to run queries against.
   */
  constructor(db: DbClient) {
    this.db = db;
  }

  /**
   * Maps the provided `norms_portfolios` row to a
   * {@link NormsPortfolios} entity.
   *
   * @param row - The database row.
   * @returns The hydrated `NormsPortfolios` entity.
   */
  private toEntity(row: typeof normsPortfolios.$inferSelect): NormsPortfolios {
    return NormsPortfolios.create({
      normId: EntityId.create(row.normId),
      portfolioId: EntityId.create(row.portfolioId),
      minAllocation: SignedPercentage.create(row.minAllocation),
      maxAllocation: SignedPercentage.create(row.maxAllocation),
      targetAllocation: SignedPercentage.create(row.targetAllocation),
      createdAt: row.createdAt,
    });
  }

  /**
   * Maps the provided entity to the values of the `norms_portfolios`
   * table.
   *
   * @param entity - The relation to persist.
   * @returns The persistence values.
   */
  private toValues(
    entity: NormsPortfolios,
  ): typeof normsPortfolios.$inferInsert {
    return {
      normId: entity.normId,
      portfolioId: entity.portfolioId,
      minAllocation: entity.minAllocation.value.toString(),
      maxAllocation: entity.maxAllocation.value.toString(),
      targetAllocation: entity.targetAllocation.value.toString(),
      createdAt: entity.createdAt,
    };
  }

  /**
   * Retrieves the relation between the provided norm id and portfolio
   * id.
   *
   * @see {@link INormsPortfolios.findByNormIdAndPortfolioId}
   */
  async findByNormIdAndPortfolioId(
    normId: EntityId,
    portfolioId: EntityId,
  ): Promise<NormsPortfolios | null> {
    const [row] = await this.db
      .select()
      .from(normsPortfolios)
      .where(
        and(
          eq(normsPortfolios.normId, normId),
          eq(normsPortfolios.portfolioId, portfolioId),
        ),
      )
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all relations belonging to the provided portfolio id.
   *
   * @see {@link INormsPortfolios.findAllByPortfolioId}
   */
  async findAllByPortfolioId(
    portfolioId: EntityId,
  ): Promise<NormsPortfolios[]> {
    const rows = await this.db
      .select()
      .from(normsPortfolios)
      .where(eq(normsPortfolios.portfolioId, portfolioId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all relations belonging to any of the provided portfolio
   * ids.
   *
   * Batched lookup for hydrating allocatable norm relations across many
   * portfolios without falling into an N+1 query pattern.
   *
   * @param portfolioIds - The ids of the portfolios to retrieve
   *   relations for.
   * @returns A promise resolving to the matching `NormsPortfolios`
   *   entities.
   */
  async findAllByPortfolioIds(
    portfolioIds: string[],
  ): Promise<NormsPortfolios[]> {
    if (portfolioIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(normsPortfolios)
      .where(inArray(normsPortfolios.portfolioId, portfolioIds));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all relations belonging to the provided norm id.
   *
   * @see {@link INormsPortfolios.findAllByNormId}
   */
  async findAllByNormId(normId: EntityId): Promise<NormsPortfolios[]> {
    const rows = await this.db
      .select()
      .from(normsPortfolios)
      .where(eq(normsPortfolios.normId, normId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Persists the provided norms-portfolios relation.
   *
   * The composite `(normId, portfolioId)` key carries identity, so the
   * row is upserted: an existing pair is updated in place, otherwise a
   * new relation is inserted.
   *
   * @see {@link INormsPortfolios.save}
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
      .returning();

    return this.toEntity(row);
  }

  /**
   * Removes the relation between the provided norm id and portfolio id.
   *
   * @see {@link INormsPortfolios.delete}
   */
  async delete(normId: EntityId, portfolioId: EntityId): Promise<void> {
    await this.db
      .delete(normsPortfolios)
      .where(
        and(
          eq(normsPortfolios.normId, normId),
          eq(normsPortfolios.portfolioId, portfolioId),
        ),
      );
  }
}
