import { and, desc, eq, inArray } from "drizzle-orm"
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core"

import { PortfolioPerformance } from "@domain/portfolio-performance/entities/portfolio-performance.entity"
import type { IPortfolioPerformance } from "@domain/portfolio-performance/interfaces/portfolio-performance.interface"
import {
  EntityId,
  PositiveMoney,
  QuotaQuantity,
  SignedMoney,
  SignedPercentage,
} from "@/value-objects"
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
   * Maps a database row to a domain entity.
   *
   * @remarks
   * Hydrates many value objects from their `numeric` string
   * representation. Nullable fields remain nullable.
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
  private toEntity(
    row: typeof portfolioPerformance.$inferSelect
  ): PortfolioPerformance {
    return PortfolioPerformance.create(
      {
        portfolioId: EntityId.create(row.portfolioId),
        date: row.date,
        quotasHeld: QuotaQuantity.create(row.quotasHeld),
        patrimony: PositiveMoney.create(row.patrimony),
        applicationTotal: PositiveMoney.create(row.applicationTotal),
        redemptionTotal: PositiveMoney.create(row.redemptionTotal),
        cashFlowNet: SignedMoney.create(row.cashFlowNet),
        earnings: SignedMoney.create(row.earnings),
        returnDaily: SignedPercentage.create(row.returnDaily),
        returnMonthly: row.returnMonthly
          ? SignedPercentage.create(row.returnMonthly)
          : null,
        returnYearly: row.returnYearly
          ? SignedPercentage.create(row.returnYearly)
          : null,
        returnLast12m: row.returnLast12m
          ? SignedPercentage.create(row.returnLast12m)
          : null,
        target: row.target ? SignedPercentage.create(row.target) : null,
        cumulativeTarget: row.cumulativeTarget
          ? SignedPercentage.create(row.cumulativeTarget)
          : null,
        inflationSpread: row.inflationSpread
          ? SignedPercentage.create(row.inflationSpread)
          : null,
        riskFreeSpread: row.riskFreeSpread
          ? SignedPercentage.create(row.riskFreeSpread)
          : null,
        marketSpread: row.marketSpread
          ? SignedPercentage.create(row.marketSpread)
          : null,
        createdAt: row.createdAt,
      },
      row.id
    )
  }

  /**
   * @summary
   * Maps a domain entity to insert values.
   *
   * @remarks
   * Converts value objects to their `numeric` string
   * representation for **Drizzle** insert operations.
   *
   * @explanation
   * Produces the column map required by **Drizzle** when
   * inserting a new performance row.
   *
   * @param entity - The performance snapshot to persist.
   * @returns The insert values.
   *
   * @example
   * const VALUES = toInsert(SNAPSHOT);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toInsert(
    entity: PortfolioPerformance
  ): typeof portfolioPerformance.$inferInsert {
    return {
      portfolioId: entity.portfolioId,
      date: entity.date,
      quotasHeld: entity.quotasHeld.value.toString(),
      patrimony: entity.patrimony.value.toString(),
      applicationTotal: entity.applicationTotal.value.toString(),
      redemptionTotal: entity.redemptionTotal.value.toString(),
      cashFlowNet: entity.cashFlowNet.value.toString(),
      earnings: entity.earnings.value.toString(),
      returnDaily: entity.returnDaily.value.toString(),
      returnMonthly: entity.returnMonthly?.value.toString() ?? null,
      returnYearly: entity.returnYearly?.value.toString() ?? null,
      returnLast12m: entity.returnLast12m?.value.toString() ?? null,
      target: entity.target?.value.toString() ?? null,
      cumulativeTarget: entity.cumulativeTarget?.value.toString() ?? null,
      inflationSpread: entity.inflationSpread?.value.toString() ?? null,
      riskFreeSpread: entity.riskFreeSpread?.value.toString() ?? null,
      marketSpread: entity.marketSpread?.value.toString() ?? null,
      createdAt: entity.createdAt,
    }
  }

  /**
   * @summary
   * Maps a domain entity to mutable update values.
   *
   * @remarks
   * Omits `createdAt` because it never changes after
   * insert.
   *
   * @explanation
   * Produces the column map required by **Drizzle** when
   * updating an existing performance row.
   *
   * @param entity - The performance snapshot to persist.
   * @returns The update values.
   *
   * @example
   * const VALUES = toUpdate(SNAPSHOT);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toUpdate(
    entity: PortfolioPerformance
  ): Partial<typeof portfolioPerformance.$inferInsert> {
    return {
      portfolioId: entity.portfolioId,
      date: entity.date,
      quotasHeld: entity.quotasHeld.value.toString(),
      patrimony: entity.patrimony.value.toString(),
      applicationTotal: entity.applicationTotal.value.toString(),
      redemptionTotal: entity.redemptionTotal.value.toString(),
      cashFlowNet: entity.cashFlowNet.value.toString(),
      earnings: entity.earnings.value.toString(),
      returnDaily: entity.returnDaily.value.toString(),
      returnMonthly: entity.returnMonthly?.value.toString() ?? null,
      returnYearly: entity.returnYearly?.value.toString() ?? null,
      returnLast12m: entity.returnLast12m?.value.toString() ?? null,
      target: entity.target?.value.toString() ?? null,
      cumulativeTarget: entity.cumulativeTarget?.value.toString() ?? null,
      inflationSpread: entity.inflationSpread?.value.toString() ?? null,
      riskFreeSpread: entity.riskFreeSpread?.value.toString() ?? null,
      marketSpread: entity.marketSpread?.value.toString() ?? null,
    }
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
   * @returns The entity or `null`.
   *
   * @example
   * const SNAP = await PERF_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(id: EntityId): Promise<PortfolioPerformance | null> {
    const [row] = await this.db
      .select()
      .from(portfolioPerformance)
      .where(eq(portfolioPerformance.id, id))
      .limit(1)

    return row ? this.toEntity(row) : null
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
    const rows = await this.db
      .select()
      .from(portfolioPerformance)
      .where(eq(portfolioPerformance.portfolioId, portfolioId))

    return rows.map((row) => this.toEntity(row))
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
    portfolioIds: string[]
  ): Promise<PortfolioPerformance[]> {
    if (portfolioIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(portfolioPerformance)
      .where(inArray(portfolioPerformance.portfolioId, portfolioIds))

    return rows.map((row) => this.toEntity(row))
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
    const [row] = await this.db
      .select()
      .from(portfolioPerformance)
      .where(
        and(
          eq(portfolioPerformance.portfolioId, portfolioId),
          eq(portfolioPerformance.date, date)
        )
      )
      .limit(1)

    return row ? this.toEntity(row) : null
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
    const [row] = await this.db
      .select()
      .from(portfolioPerformance)
      .where(eq(portfolioPerformance.portfolioId, portfolioId))
      .orderBy(desc(portfolioPerformance.date))
      .limit(1)

    return row ? this.toEntity(row) : null
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
    portfolioIds: string[]
  ): Promise<PortfolioPerformance[]> {
    if (portfolioIds.length === 0) {
      return []
    }

    const rows = await this.db
      .selectDistinctOn([portfolioPerformance.portfolioId])
      .from(portfolioPerformance)
      .where(inArray(portfolioPerformance.portfolioId, portfolioIds))
      .orderBy(
        portfolioPerformance.portfolioId,
        desc(portfolioPerformance.date)
      )

    return rows.map((row) => this.toEntity(row))
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
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await PERF_REPO.save(SNAPSHOT);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(persisted: PortfolioPerformance): Promise<PortfolioPerformance> {
    if (persisted.id) {
      const [row] = await this.db
        .update(portfolioPerformance)
        .set(this.toUpdate(persisted))
        .where(eq(portfolioPerformance.id, persisted.id))
        .returning()

      if (!row) {
        throw new NotFoundError(
          `PortfolioPerformance with id ${persisted.id} was not found.`
        )
      }

      return this.toEntity(row)
    }

    const [row] = await this.db
      .insert(portfolioPerformance)
      .values(this.toInsert(persisted))
      .returning()

    return this.toEntity(row)
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
