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
 * @explanation
 * Use this function in the repository layer to build the
 * `NormsPortfolios` entity from a row of the
 * `norms_portfolios` table.
 * It keeps database details out of the domain layer.
 *
 * @param row - Database row returned by **Drizzle**.
 *
 * @returns The hydrated entity.
 *
 * @example
 * const REL = ToDomain(ROW);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function ToDomain(
  row: typeof normsPortfolios.$inferSelect
): NormsPortfolios {
  return NormsPortfolios.create({
    normId: EntityId.create(row.normId),
    portfolioId: EntityId.create(row.portfolioId),
    minAllocation: SignedPercentage.create(row.minAllocation),
    maxAllocation: SignedPercentage.create(row.maxAllocation),
    targetAllocation: SignedPercentage.create(
      row.targetAllocation
    ),
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
 * @explanation
 * Use this function in the insert path of the repository.
 * It prepares the entity as plain column values for the
 * `norms_portfolios` table.
 *
 * @param entity - Norms portfolio domain entity.
 *
 * @returns Row insert values.
 *
 * @example
 * const REL = ToInsert(REL);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function ToInsert(
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
