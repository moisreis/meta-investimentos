import { Portfolio } from "@domain/portfolio/entities/portfolio.entity"
import { EntityId, SignedPercentage } from "@/value-objects"
import { portfolio } from "@db-schemas/portfolio.schema"

/**
 * @summary
 * Maps a portfolio persistence row into a domain entity.
 *
 * @remarks
 * Reconstructs domain value objects from their persisted
 * primitive representations.
 *
 * @explanation
 * Use this function in the repository layer to build the
 * `Portfolio` entity from a row of the `portfolio` table.
 * It keeps database details out of the domain layer.
 *
 * @param row - Database row returned by **Drizzle**.
 *
 * @returns The hydrated entity.
 *
 * @example
 * const PORTFOLIO = ToDomain(ROW);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function ToDomain(
  row: typeof portfolio.$inferSelect
): Portfolio {
  return Portfolio.create(
    {
      acronym: row.acronym,
      name: row.name,
      userId: EntityId.create(row.userId),
      annualInterestRate: SignedPercentage.create(
        row.annualInterestRate
      ),
      minAllocation: SignedPercentage.create(row.minAllocation),
      maxAllocation: SignedPercentage.create(row.maxAllocation),
      targetAllocation: SignedPercentage.create(
        row.targetAllocation
      ),
      version: row.version,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    },
    row.id
  )
}

/**
 * @summary
 * Maps a portfolio domain entity into persistence data.
 *
 * @remarks
 * Unwraps domain value objects into their primitive
 * database representations.
 *
 * @explanation
 * Use this function in the insert path of the repository.
 * It prepares the entity as plain column values for the
 * `portfolio` table.
 *
 * @param entity - Portfolio domain entity.
 *
 * @returns Row insert values.
 *
 * @example
 * const PORTFOLIO = ToInsert(PORTFOLIO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function ToInsert(
  entity: Portfolio
): typeof portfolio.$inferInsert {
  return {
    acronym: entity.acronym,
    name: entity.name,
    userId: entity.userId,
    annualInterestRate:
      entity.annualInterestRate.value.toString(),
    minAllocation: entity.minAllocation.value.toString(),
    maxAllocation: entity.maxAllocation.value.toString(),
    targetAllocation: entity.targetAllocation.value.toString(),
    version: entity.version,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  }
}

/**
 * @summary
 * Maps an entity into update values.
 *
 * @remarks
 * Omits `createdAt`, `updatedAt` and `version`. The first
 * never changes; the second refreshes via `$onUpdate`.
 * `version` is managed by the repository to implement
 * optimistic locking.
 *
 * @explanation
 * `createdAt` is set once at insertion and never mutated.
 * `updatedAt` is auto-refreshed by **Drizzle**'s `$onUpdate`,
 * so passing it explicitly is unnecessary.
 *
 * @param entity - Portfolio domain entity.
 *
 * @returns Row update values.
 *
 * @example
 * const PORTFOLIO = ToUpdate(PORTFOLIO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export function ToUpdate(
  entity: Portfolio
): Partial<typeof portfolio.$inferInsert> {
  return {
    acronym: entity.acronym,
    name: entity.name,
    userId: entity.userId,
    annualInterestRate:
      entity.annualInterestRate.value.toString(),
    minAllocation: entity.minAllocation.value.toString(),
    maxAllocation: entity.maxAllocation.value.toString(),
    targetAllocation: entity.targetAllocation.value.toString(),
  }
}
