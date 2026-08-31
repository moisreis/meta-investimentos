import { and, desc, eq, inArray } from "drizzle-orm";

import { PortfolioPerformance } from "@/business/entities/performance/portfolio-performance.entity";
import type { IPortfolioPerformance } from "@/business/interfaces/performance/portfolio-performance.interface";
import PositiveMoney from "@/business/value-objects/positive-money.vo";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";
import SignedMoney from "@/business/value-objects/signed-money.vo";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";
import { portfolioPerformance } from "@/infrastructure/database/schemas";

import type { DbClient } from "../types";

/**
 * PostgreSQL-backed implementation of the
 * {@link IPortfolioPerformance} contract.
 *
 * Maps `portfolio_performance` rows to `PortfolioPerformance`
 * entities and back. Lookups rely on the primary key and the
 * `(portfolio_id, date)` unique pair and composite index.
 *
 * Numeric columns are stored as `numeric`, which postgres returns as
 * strings; they are hydrated into the corresponding value objects and
 * persisted through their `.value.toString()` representation.
 *
 * A save inserts a new row when the entity has no id and updates the
 * existing row otherwise. The batch `findLatestByPortfolioIds` lookup
 * resolves the latest snapshot of many portfolios in a single query.
 */
export class PortfolioPerformanceRepository implements IPortfolioPerformance {
  // --------------------------------------
  // FIELDS
  // --------------------------------------

  private readonly db: DbClient;

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `PortfolioPerformanceRepository` bound to the provided
   * database client.
   *
   * @param db - The database client to run queries against.
   */
  constructor(db: DbClient) {
    this.db = db;
  }

  // --------------------------------------
  // MAPPING METHODS
  // --------------------------------------

  /**
   * Maps the provided `portfolio_performance` row to a
   * {@link PortfolioPerformance} entity.
   *
   * @param row - The database row.
   * @returns The hydrated `PortfolioPerformance` entity.
   */
  private toEntity(
    row: typeof portfolioPerformance.$inferSelect,
  ): PortfolioPerformance {
    return PortfolioPerformance.create(
      {
        portfolioId: row.portfolioId,
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
      row.id,
    );
  }

  /**
   * Maps the provided entity to the insert values of the
   * `portfolio_performance` table.
   *
   * @param entity - The performance snapshot to persist.
   * @returns The insert values.
   */
  private toInsert(
    entity: PortfolioPerformance,
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
    };
  }

  /**
   * Maps the provided entity to the mutable update values of the
   * `portfolio_performance` table.
   *
   * `createdAt` never changes and is left out of the update.
   *
   * @param entity - The performance snapshot to persist.
   * @returns The update values.
   */
  private toUpdate(
    entity: PortfolioPerformance,
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
    };
  }

  // --------------------------------------
  // QUERY METHODS
  // --------------------------------------

  /**
   * Retrieves the portfolio performance with the provided id.
   *
   * @see {@link IPortfolioPerformance.findById}
   */
  async findById(id: string): Promise<PortfolioPerformance | null> {
    const [row] = await this.db
      .select()
      .from(portfolioPerformance)
      .where(eq(portfolioPerformance.id, id))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all performance snapshots of the provided portfolio id.
   *
   * @see {@link IPortfolioPerformance.findAllByPortfolioId}
   */
  async findAllByPortfolioId(
    portfolioId: string,
  ): Promise<PortfolioPerformance[]> {
    const rows = await this.db
      .select()
      .from(portfolioPerformance)
      .where(eq(portfolioPerformance.portfolioId, portfolioId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all performance snapshots of any of the provided
   * portfolio ids.
   *
   * Batched lookup for hydrating the performance series of many
   * portfolios without falling into an N+1 query pattern.
   *
   * @param portfolioIds - The ids of the portfolios to retrieve
   *   performance for.
   * @returns A promise resolving to the matching `PortfolioPerformance`
   *   entities.
   */
  async findAllByPortfolioIds(
    portfolioIds: string[],
  ): Promise<PortfolioPerformance[]> {
    if (portfolioIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(portfolioPerformance)
      .where(inArray(portfolioPerformance.portfolioId, portfolioIds));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves the performance snapshot of the provided portfolio id on
   * the provided date.
   *
   * @see {@link IPortfolioPerformance.findByPortfolioIdAndDate}
   */
  async findByPortfolioIdAndDate(
    portfolioId: string,
    date: Date,
  ): Promise<PortfolioPerformance | null> {
    const [row] = await this.db
      .select()
      .from(portfolioPerformance)
      .where(
        and(
          eq(portfolioPerformance.portfolioId, portfolioId),
          eq(portfolioPerformance.date, date),
        ),
      )
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves the most recent performance snapshot of the provided
   * portfolio id.
   *
   * @see {@link IPortfolioPerformance.findLatestByPortfolioId}
   */
  async findLatestByPortfolioId(
    portfolioId: string,
  ): Promise<PortfolioPerformance | null> {
    const [row] = await this.db
      .select()
      .from(portfolioPerformance)
      .where(eq(portfolioPerformance.portfolioId, portfolioId))
      .orderBy(desc(portfolioPerformance.date))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves the most recent performance snapshot of each of the
   * provided portfolio ids.
   *
   * A `DISTINCT ON (portfolio_id)` window returns the latest row per
   * portfolio in a single query, replacing one
   * `findLatestByPortfolioId` call per portfolio.
   *
   * @param portfolioIds - The ids of the portfolios to retrieve
   *   performance for.
   * @returns A promise resolving to the latest `PortfolioPerformance`
   *   per provided portfolio id.
   */
  async findLatestByPortfolioIds(
    portfolioIds: string[],
  ): Promise<PortfolioPerformance[]> {
    if (portfolioIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .selectDistinctOn([portfolioPerformance.portfolioId])
      .from(portfolioPerformance)
      .where(inArray(portfolioPerformance.portfolioId, portfolioIds))
      .orderBy(
        portfolioPerformance.portfolioId,
        desc(portfolioPerformance.date),
      );

    return rows.map((row) => this.toEntity(row));
  }

  // --------------------------------------
  // COMMAND METHODS
  // --------------------------------------

  /**
   * Persists the provided portfolio performance snapshot.
   *
   * @see {@link IPortfolioPerformance.save}
   */
  async save(persisted: PortfolioPerformance): Promise<PortfolioPerformance> {
    if (persisted.id) {
      const [row] = await this.db
        .update(portfolioPerformance)
        .set(this.toUpdate(persisted))
        .where(eq(portfolioPerformance.id, persisted.id))
        .returning();

      if (!row) {
        throw new Error(
          `PortfolioPerformance with id ${persisted.id} was not found.`,
        );
      }

      return this.toEntity(row);
    }

    const [row] = await this.db
      .insert(portfolioPerformance)
      .values(this.toInsert(persisted))
      .returning();

    return this.toEntity(row);
  }

  /**
   * Removes the portfolio performance with the provided id.
   *
   * @see {@link IPortfolioPerformance.delete}
   */
  async delete(id: string): Promise<void> {
    await this.db
      .delete(portfolioPerformance)
      .where(eq(portfolioPerformance.id, id));
  }
}
