import { Statement } from "@domain/statement/entities/statement.entity"
import { EntityId } from "@/value-objects"
import { statement } from "@db-schemas/statement.schema"

/**
 * @summary
 * Maps a statement persistence row into a domain entity.
 *
 * @remarks
 * Reconstructs domain value objects from their persisted
 * primitive representations.
 *
 * @explanation
 * Use this function in the repository layer to build the
 * `Statement` entity from a row of the `statement` table.
 * It keeps database details out of the domain layer.
 *
 * @param row - Database row returned by **Drizzle**.
 *
 * @returns The hydrated entity.
 *
 * @example
 * const STATEMENT = ToDomain(ROW);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function ToDomain(
  row: typeof statement.$inferSelect
): Statement {
  return Statement.create(
    {
      portfolioId: row.portfolioId
        ? EntityId.create(row.portfolioId)
        : null,
      periodStart: new Date(row.periodStart),
      periodEnd: new Date(row.periodEnd),
      fileUrl: row.fileUrl,
      generatedByUserId: row.generatedByUserId
        ? EntityId.create(row.generatedByUserId)
        : null,
      createdAt: row.createdAt,
    },
    row.id
  )
}

/**
 * @summary
 * Maps a statement domain entity into persistence data.
 *
 * @remarks
 * Unwraps domain value objects into their primitive
 * database representations.
 *
 * @explanation
 * Use this function in the insert path of the repository.
 * It prepares the entity as plain column values for the
 * `statement` table.
 *
 * @param entity - Statement domain entity.
 *
 * @returns Row insert values.
 *
 * @example
 * const STATEMENT = ToInsert(STATEMENT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function ToInsert(
  entity: Statement
): typeof statement.$inferInsert {
  return {
    portfolioId: entity.portfolioId,
    periodStart: entity.periodStart.toISOString(),
    periodEnd: entity.periodEnd.toISOString(),
    fileUrl: entity.fileUrl,
    generatedByUserId: entity.generatedByUserId,
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
 * @param entity - Statement domain entity.
 *
 * @returns Row update values.
 *
 * @example
 * const STATEMENT = ToUpdate(STATEMENT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export function ToUpdate(
  entity: Statement
): Partial<typeof statement.$inferInsert> {
  return {
    portfolioId: entity.portfolioId,
    periodStart: entity.periodStart.toISOString(),
    periodEnd: entity.periodEnd.toISOString(),
    fileUrl: entity.fileUrl,
    generatedByUserId: entity.generatedByUserId,
  }
}
