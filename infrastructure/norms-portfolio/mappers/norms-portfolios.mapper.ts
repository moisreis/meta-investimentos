import { NormsPortfolios } from "@domain/norms-portfolio/entities/norms-portfolios.entity"
import { EntityId, SignedPercentage } from "@/value-objects"
import { normsPortfolios } from "@db-schemas/norms-portfolios.schema"

/**
 * @summary
 * Maps a norms portfolio persistence row into a domain entity.
 *
 * @remarks
 * Reconstructs domain value objects from their persisted
 * primitive representations.
 *
 * @param row - Database row returned by Drizzle.
 * @returns A hydrated `NormsPortfolios` domain entity.
 */
export function toDomain(
  row: typeof normsPortfolios.$inferSelect
): NormsPortfolios {
  return NormsPortfolios.create({
    normId: EntityId.create(row.normId),
    portfolioId: EntityId.create(row.portfolioId),
    minAllocation: SignedPercentage.create(row.minAllocation),
    maxAllocation: SignedPercentage.create(row.maxAllocation),
    targetAllocation: SignedPercentage.create(row.targetAllocation),
    version: row.version,
    createdAt: row.createdAt,
  })
}

/**
 * @summary
 * Maps a norms portfolio domain entity into persistence data.
 *
 * @remarks
 * Unwraps domain value objects into their primitive
 * database representations.
 *
 * @param entity - Norms portfolio domain entity.
 * @returns Values compatible with the Drizzle insert schema.
 */
export function toInsert(
  entity: NormsPortfolios
): typeof normsPortfolios.$inferInsert {
  return {
    normId: entity.normId,
    portfolioId: entity.portfolioId,
    minAllocation: entity.minAllocation.value.toString(),
    maxAllocation: entity.maxAllocation.value.toString(),
    targetAllocation: entity.targetAllocation.value.toString(),
    version: entity.version,
    createdAt: entity.createdAt,
  }
}
