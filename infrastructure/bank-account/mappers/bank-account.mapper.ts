import { BankAccount } from "@domain/bank-account/entities/bank-account.entity"
import { EntityId } from "@/value-objects"
import { bankAccount } from "@db-schemas/bank-account.schema"

/**
 * @summary
 * Maps a bank account persistence row into a domain entity.
 *
 * @remarks
 * Reconstructs domain value objects from their persisted
 * primitive representations.
 *
 * @param row - Database row returned by Drizzle.
 * @returns A hydrated `BankAccount` domain entity.
 */
export function toDomain(row: typeof bankAccount.$inferSelect): BankAccount {
  return BankAccount.create(
    {
      portfolioId: EntityId.create(row.portfolioId),
      bankId: EntityId.create(row.bankId),
      agency: row.agency,
      accountNumber: row.accountNumber,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    },
    row.id
  )
}

/**
 * @summary
 * Maps a bank account domain entity into persistence data.
 *
 * @remarks
 * Unwraps domain value objects into their primitive
 * database representations.
 *
 * @param entity - Bank account domain entity.
 * @returns Values compatible with the Drizzle insert schema.
 */
export function toInsert(entity: BankAccount): typeof bankAccount.$inferInsert {
  return {
    portfolioId: entity.portfolioId,
    bankId: entity.bankId,
    agency: entity.agency,
    accountNumber: entity.accountNumber,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  }
}

/**
 * @summary
 * Maps a bank account entity into update values.
 *
 * @remarks
 * Omits `createdAt` and `updatedAt`. The first never
 * changes; the second refreshes via `$onUpdate`.
 *
 * @explanation
 * Use for updates where Drizzle should only touch mutable
 * columns. Timestamps are managed at the database layer.
 *
 * @param entity - Bank account domain entity.
 * @returns Update values for the row.
 *
 * @author Moisés Reis
 * @date 2026-09-15
 */
export function toUpdate(
  entity: BankAccount
): Partial<typeof bankAccount.$inferInsert> {
  return {
    portfolioId: entity.portfolioId,
    bankId: entity.bankId,
    agency: entity.agency,
    accountNumber: entity.accountNumber,
  }
}
