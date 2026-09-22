import { PortfolioPerformance } from "@domain/portfolio-performance/entities/portfolio-performance.entity"
import {
  EntityId,
  PositiveMoney,
  QuotaQuantity,
  SignedMoney,
  SignedPercentage,
} from "@/value-objects"
import { portfolioPerformance } from "@db-schemas/portfolio-performance.schema"

/**
 * @summary
 * Maps a portfolio performance persistence row into a
 * domain entity.
 *
 * @remarks
 * Reconstructs domain value objects from their persisted
 * primitive representations.
 *
 * @explanation
 * Use this function in the repository layer to build the
 * `PortfolioPerformance` entity from a row of the
 * `portfolio_performance` table.
 * It keeps database details out of the domain layer.
 *
 * @param row - Database row returned by **Drizzle**.
 *
 * @returns The hydrated entity.
 *
 * @example
 * const SNAP = toDomain(ROW);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function toDomain(
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
 * Maps a portfolio performance domain entity into
 * persistence data.
 *
 * @remarks
 * Unwraps domain value objects into their primitive
 * database representations.
 *
 * @explanation
 * Use this function in the insert path of the repository.
 * It prepares the entity as plain column values for the
 * `portfolio_performance` table.
 *
 * @param entity - Portfolio performance domain entity.
 *
 * @returns Row insert values.
 *
 * @example
 * const SNAP = toInsert(SNAP);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function toInsert(
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
 * Maps an entity into update values.
 *
 * @remarks
 * Omits `createdAt` and `updatedAt`. The first never changes;
 * the second refreshes via `$onUpdate`.
 *
 * @explanation
 * `createdAt` is set once at insertion and never mutated.
 * `updatedAt` is auto-refreshed by **Drizzle**'s `$onUpdate`,
 * so passing it explicitly is unnecessary.
 *
 * @param entity - Portfolio performance domain entity.
 *
 * @returns Row update values.
 *
 * @example
 * const SNAP = toUpdate(SNAP);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export function toUpdate(
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
